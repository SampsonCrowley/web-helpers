#!/usr/bin/env node

const fs = require('fs')
const glob = require('glob')
const cssFiles = glob.sync('./src/**/*.css')

for(let i = 0; i < cssFiles.length; i++) {
  const cssFile = cssFiles[i]
        jsFile = cssFile.replace(/src\//, 'package/')
  fs.writeFileSync(jsFile, fs.readFileSync(cssFile))
}
