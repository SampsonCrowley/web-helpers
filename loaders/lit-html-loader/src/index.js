import { getOptions, interpolateName } from 'loader-utils';
import sanitizeHTML from 'sanitize-html'
import fs from 'fs'
import path from 'path'
import { minify } from 'html-minifier'
// import validateOptions from 'schema-utils';
//
// const schema = {
//   type: 'object',
//   properties: {
//     filename: {
//       type: 'string'
//     }
//   }
// };
const defaultAllowedTags = [
  ...(new Array(6).fill().map((_, i) => `h${i + 1}`)),
  'a',
  'address',
  'b',
  'br',
  'caption',
  'code',
  'blockquote',
  'div',
  'em',
  'header',
  'hr',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  'span',
  'section',
  'strong',
  'style',
  'table',
  'tbody',
  'thead',
  'td',
  'th',
  'tr',
  'ul',
]

export default function(content) {
  const options = getOptions(this) || {},
        {
          aliasedAs,
          allowedAttributes,
          allowedTags,
          context = this.rootContext,
          filename,
          minify: minifyOptions,
          path: buildPath,
        } = options,
        sanitizedContent = minify(sanitizeHTML(content, {
          allowedTags: allowedTags || defaultAllowedTags,
          allowedAttributes: allowedAttributes || false,
        }), minifyOptions || {})

  if(filename) {
    const fileName = interpolateName(this, filename, {
      content,
      context,
      path: buildPath,
    }).replace(aliasedAs ? `${aliasedAs}/` : '', ''),

    outputPath = path.resolve(buildPath, fileName)

    fs.mkdir(path.dirname(outputPath), { recursive: true } , (dirErr) => {
      if(dirErr) return this.emitError(dirErr)

      fs.writeFile(outputPath, sanitizedContent, 'utf-8', (fileErr) => {
        if(fileErr) return this.emitError(fileErr)
        console.log('Exported HTML: ' + outputPath)
      })
    })


    // this.emitFile(fileName, sanitizedContent)
  }

  return generateTemplate(sanitizedContent)
}


function importHTMLFunction(){
    return `import { html } from 'lit-element';`;
}

function exportHtmlAsDefault(parsedFileContents) {
    return `export default html\`${parsedFileContents}\`;`;
}

function generateTemplate(parsedFileContents) {
  return `
        ${importHTMLFunction()}
        ${exportHtmlAsDefault(parsedFileContents)}
    `
}
