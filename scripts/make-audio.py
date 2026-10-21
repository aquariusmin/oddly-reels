"""Synthesise the reel's original chiptune music bed and sound effects.

Everything here is generated from scratch (no samples), so the output has no
third-party licence. Writes 44.1 kHz 16-bit WAV files to public/audio/.

    python3 scripts/make-audio.py
"""

import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(7)


def t(sec):
    return np.arange(int(SR * sec)) / SR


def square(freq, sec, duty=0.5):
    ph = (t(sec) * freq) % 1.0
    return np.where(ph < duty, 1.0, -1.0)


def triangle(freq, sec):
    ph = (t(sec) * freq) % 1.0
    return 4 * np.abs(ph - 0.5) - 1


def env(n, attack=0.005, release=0.08, sustain=1.0):
    e = np.full(n, sustain)
    a = min(n, int(SR * attack))
    r = min(n - a, int(SR * release))
    e[:a] = np.linspace(0, sustain, a)
    if r > 0:
        e[n - r:] = np.linspace(sustain, 0, r)
    return e


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def write(name, x, gain=0.9):
    x = x / max(1e-9, np.abs(x).max()) * gain
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def lowpass(x, alpha):
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc)
        y[i] = acc
    return y


# --- Sound effects ---------------------------------------------------------

def pop():
    # Rising square blip for caption entrances.
    sec = 0.09
    f = np.linspace(660, 1320, int(SR * sec))
    ph = np.cumsum(f) / SR % 1.0
    x = np.where(ph < 0.25, 1.0, -1.0) * env(len(f), 0.002, 0.06)
    return x


def click():
    # Short UI tick for menu / decoration changes.
    sec = 0.05
    x = square(1800, sec, 0.3) * np.exp(-t(sec) * 90)
    return x


def whoosh():
    # Band-limited noise swell for camera zooms.
    sec = 0.45
    n = int(SR * sec)
    noise = rng.uniform(-1, 1, n)
    sweep = np.linspace(0.04, 0.35, n)
    y = np.empty(n)
    acc = 0.0
    for i in range(n):
        acc += sweep[i] * (noise[i] - acc)
        y[i] = acc
    shape = np.sin(np.linspace(0, np.pi, n)) ** 2
    return y * shape


def sparkle():
    # Major arpeggio for "growth" moments.
    notes = [72, 76, 79, 84, 88]
    parts = []
    for i, m in enumerate(notes):
        s = square(midi(m), 0.07, 0.25) * env(int(SR * 0.07), 0.002, 0.05)
        parts.append(s * (0.8 + 0.05 * i))
    return np.concatenate(parts + [np.zeros(int(SR * 0.15))])


def chime():
    # Two-note sign-off for the outro.
    a = triangle(midi(84), 0.5) * np.exp(-t(0.5) * 6)
    b = square(midi(91), 0.6, 0.25) * np.exp(-t(0.6) * 5) * 0.5
    out = np.zeros(int(SR * 0.75))
    out[: len(a)] += a
    out[int(SR * 0.12): int(SR * 0.12) + len(b)] += b
    return out


# --- Music bed ---------------------------------------------------------------

def music(total_sec=20.5, bpm=112):
    beat = 60 / bpm
    step = beat / 2  # eighth notes
    out = np.zeros(int(SR * total_sec) + SR)

    def place(sig, at):
        i = int(SR * at)
        out[i: i + len(sig)] += sig[: max(0, len(out) - i)]

    # C – G – Am – F, one bar each.
    chords = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]
    lead = [
        [76, None, 79, 76, 74, None, 72, None],
        [74, None, 71, 74, 79, None, 74, None],
        [72, None, 76, 72, 81, None, 79, 76],
        [77, None, 76, 74, 72, None, None, None],
    ]
    bar = beat * 4
    bars = int(total_sec / bar) + 1
    for b in range(bars):
        root, triad = chords[b % 4]
        t0 = b * bar
        # Triangle bass on beats.
        for k in range(4):
            n = midi(root if k % 2 == 0 else root + 7)
            s = triangle(n, beat * 0.9) * env(int(SR * beat * 0.9), 0.003, 0.05)
            place(s * 0.55, t0 + k * beat)
        # Soft arpeggio pulse.
        for k in range(8):
            m = triad[k % 3] + 12
            s = square(midi(m), step * 0.5, 0.125) * env(int(SR * step * 0.5), 0.002, 0.03)
            place(s * 0.12, t0 + k * step)
        # Lead enters after the hook bar.
        if b >= 1:
            for k, m in enumerate(lead[b % 4]):
                if m is None:
                    continue
                s = square(midi(m), step * 0.85, 0.25) * env(int(SR * step * 0.85), 0.004, 0.06, 0.8)
                place(s * 0.2, t0 + k * step)
        # Noise hi-hat on off-beats, kick on 1 and 3.
        for k in range(8):
            if k % 2 == 1:
                h = rng.uniform(-1, 1, int(SR * 0.03)) * np.exp(-t(0.03) * 160)
                place(h * 0.12, t0 + k * step)
        for k in (0, 2):
            f = np.linspace(150, 45, int(SR * 0.12))
            kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t(0.12) * 30)
            place(kick * 0.5, t0 + k * beat)

    out = out[: int(SR * total_sec)]
    out = lowpass(out, 0.55)  # take the edge off the squares
    fade = int(SR * 0.8)
    out[-fade:] *= np.linspace(1, 0, fade)
    return out


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    write("pop.wav", pop(), 0.6)
    write("click.wav", click(), 0.5)
    write("whoosh.wav", whoosh(), 0.7)
    write("sparkle.wav", sparkle(), 0.6)
    write("chime.wav", chime(), 0.7)
    write("music.wav", music(), 0.8)
    print("wrote", sorted(os.listdir(OUT)))
