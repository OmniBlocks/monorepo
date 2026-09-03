#!/bin/bash
set -e

# Compile editor/EditorConfig.ts into build/editor/EditorConfig.js and dependencies
npx tsc -p tsconfig_editor.json

# Combine build/editor/EditorConfig.js and dependencies into website/manual/EditorConfig.js
npx rollup build/editor/EditorConfig.js \
	--file ./website/manual/EditorConfig.js \
	--format iife \
	--output.name EditorConfig \
	--context exports \
	--sourcemap \
	--plugin @rollup/plugin-node-resolve

# Minify website/manual/EditorConfig.js into website/manual/EditorConfig.min.js
npx terser \
	./website/manual/EditorConfig.js \
	--source-map "content='./website/manual/EditorConfig.js.map',url=EditorConfig.min.js.map" \
	-o ./website/manual/EditorConfig.min.js \
	--compress \
	--mangle \
	--mangle-props regex="/^_.+/;"
