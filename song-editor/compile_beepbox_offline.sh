#!/bin/bash
set -e


echo "WARNING: This file assumes you have already ran npm run build!"

# TODO: Is there a cleaner way to do this?
cp website/beepbox_editor.min.js offline/resources/

# cp website/service_worker.js offline/resources/
# cp manifest.webmanifest offline/resources/

cp website/samples.js offline/resources/
cp website/samples2.js offline/resources/
cp website/samples3.js offline/resources/
cp website/drumsamples.js offline/resources/
cp website/kirby_samples.js offline/resources/
cp website/wario_samples.js offline/resources/
cp website/mario_paintbox_samples.js offline/resources/
cp website/nintaribox_samples.js offline/resources/

# cp website/404.html offline/resources/
# cp website/credits.html offline/resources/

cp website/UltraBoxALThemeLogo.png offline/resources/
cp website/UltraBoxAzurLaneThemeMemoryTaskBackground.png offline/resources/
cp website/UltraBoxAzurLaneThemeMouse.png offline/resources/
cp website/UltraboxAzurLaneThemeStarterSquad.png offline/resources/
cp website/wackybox_cursor.png offline/resources/


cp website/player/beepbox_player.min.js offline/resources/player

cp website/samples.js offline/resources/player
cp website/samples2.js offline/resources/player
cp website/samples3.js offline/resources/player
cp website/drumsamples.js offline/resources/player
cp website/kirby_samples.js offline/resources/player
cp website/wario_samples.js offline/resources/player
cp website/mario_paintbox_samples.js offline/resources/player
cp website/nintaribox_samples.js offline/resources/player



cd offline

cp neutralino.config.json dist/UltraBox\ Offline/

# --release will zip releases together in one file
neu build --release