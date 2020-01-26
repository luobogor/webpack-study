const less = require('less')
function loader(source) {
  console.log('less-loader.....')
  let css = ''
  less.render(source, function (err, c) {
    css = c.css
  })
  css = css.replace(/\n/g, '\\n')
  return css
}

module.exports = loader
