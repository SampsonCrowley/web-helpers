#!/usr/bin/env node

const fs = require('fs')
const glob = require('glob')
const CleanCSS = require('clean-css')

const cssFiles = glob.sync('./src/**/*.css')

for(let i = 0; i < cssFiles.length; i++) {
  const cssFile = cssFiles[i]
        jsFile = cssFile.replace(/\.css$/, '.js')
  fs.writeFileSync(jsFile, generateTemplate(fs.readFileSync(cssFile)))
}

function generateCSSImport(){
    return `import {css} from 'lit-element';`;
}

function createCssExport(parsedFileContents) {
    return `export default css\`${new CleanCSS({}).minify(parsedFileContents).styles}\`;`;
}

function generateTemplate(parsedFileContents) {
  return `${generateCSSImport()}\n${createCssExport(parsedFileContents)}`
}
