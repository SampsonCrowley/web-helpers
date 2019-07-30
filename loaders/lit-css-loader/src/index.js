// import { getOptions } from 'loader-utils';
import CleanCSS from 'clean-css'

// import validateOptions from 'schema-utils';
//
// const schema = {
//   type: 'object',
//   properties: {
//     test: {
//       type: 'string'
//     }
//   }
// };

export default function(source) {
  // const options = getOptions(this);

  // validateOptions(schema, options, 'Example Loader');

  // Apply some transformations to the source...

  // console.log(source, options)
  return generateTemplate(source)
}


function generateCSSImport(){
    return `import {css} from 'lit-element';`;
}

function createCssExport(parsedFileContents) {
    return `export default css\`${new CleanCSS({}).minify(parsedFileContents).styles}\`;`;
}

function generateTemplate(parsedFileContents) {
  return `
        ${generateCSSImport()}
        ${createCssExport(parsedFileContents)}
    `
}
