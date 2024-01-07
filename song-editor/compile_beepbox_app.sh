#!/bin/bash
set -e


# Copy SongEditor.ts into app_editor

# Edit the relative URLs of SongEditor.ts

# Copy AddSamplesPrompt.ts into app_editor

# Insert and replace text into AddSamplesPrompt.ts


# Compile editor/main.ts into build/editor/main.js and dependencies
npx tsc -p tsconfig_app.json

# Combine build/app_editor/main.js and dependencies into app/beepbox_app_editor.js
npx rollup build/app_editor/main.js \
	--file app/beepbox_app_editor.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--sourcemap \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify app/beepbox_app_editor.js into app/beepbox_app_editor.min.js
npx terser \
	app/beepbox_app_editor.js \
	--source-map "content='app/beepbox_app_editor.js.map',url=beepbox_app_editor.min.js.map" \
	-o app/beepbox_app_editor.min.js \
	--compress \
	--mangle \
	--mangle-props regex="/^_.+/;"