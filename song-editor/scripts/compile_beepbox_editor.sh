#!/bin/bash
set -e

# Compile editor/main.ts into build/editor/main.js and dependencies
pnpm exec tsc -p tsconfig_editor.json

# Combine build/editor/main.js and dependencies into website/beepbox_editor.js
pnpm exec rollup build/editor/main.js \
	--file ./website/beepbox_editor.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--sourcemap \
	--plugin @rollup/plugin-node-resolve

# Minify website/beepbox_editor.js into website/beepbox_editor.min.js
pnpm exec terser \
	./website/beepbox_editor.js \
	--source-map "content='./website/beepbox_editor.js.map',url=beepbox_editor.min.js.map" \
	-o ./website/beepbox_editor.min.js \
	--compress \
	--define OFFLINE=false \
	--mangle \
	--mangle-props regex="/^_.+/;"
