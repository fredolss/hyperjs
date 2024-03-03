import * as esbuild from 'esbuild'
import * as fs from 'node:fs';
var json = JSON.parse(fs.readFileSync('./package.json')); 

await esbuild.build({
  entryPoints: ["src/HyperJS.ts"],
  bundle: true,
  minify: true,
  outfile: 'dist/' + json.name +'.min.js',
})