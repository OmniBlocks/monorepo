#!/bin/bash
set -e


echo "WARNING: This file assumes you have already ran npm run build!"

# TODO: Is there a cleaner way to do this?
cp website/beepbox_editor.min.js offline/

cp website/samples.js offline/
cp website/samples2.js offline/
cp website/samples3.js offline/
cp website/drumsamples.js offline/
cp website/kirby_samples.js offline/
cp website/wario_samples.js offline/
cp website/mario_paintbox_samples.js offline/
cp website/nintaribox_samples.js offline/

cp website/hotdog.png offline/

# cp website/404.html offline/
# cp website/credits.html offline/

cp website/theme_resources/ offline/ -r


cp website/player/beepbox_player.min.js offline/player

cp website/samples.js offline/player
cp website/samples2.js offline/player
cp website/samples3.js offline/player
cp website/drumsamples.js offline/player
cp website/kirby_samples.js offline/player
cp website/wario_samples.js offline/player
cp website/mario_paintbox_samples.js offline/player
cp website/nintaribox_samples.js offline/player



# cd offline

# --release will zip releases together in one file
# neu build --release