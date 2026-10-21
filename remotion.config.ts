/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
// PNG frames: JPEG capture smears pixel-art edges before encoding.
Config.setVideoImageFormat("png");
Config.setCrf(16);
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
