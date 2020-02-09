function WebpackOptionsDefaulter() {}

module.exports = WebpackOptionsDefaulter;

WebpackOptionsDefaulter.prototype.process = function (options) {
  Object.assign(options, {
    target: 'web',
  })
}

const realOptions = {
  "entry": "./src/index.js",
  "output": {
    "filename": "bundle.js",
    "path": "/Users/jinzhanye/Desktop/dev/github/webpack-study/webpack1-test/dist",
    "libraryTarget": "var",
    "sourceMapFilename": "[file].map",
    "hotUpdateChunkFilename": "[id].[hash].hot-update.js",
    "hotUpdateMainFilename": "[hash].hot-update.json",
    "hashFunction": "md5",
    "hashDigest": "hex",
    "hashDigestLength": 20,
    "sourcePrefix": "\t"
  },
  "context": "/Users/jinzhanye/Desktop/dev/github/webpack-study/webpack1-test",
  "debug": false,
  "devtool": false,
  "target": "web",
  "node": {
    "console": false,
    "process": true,
    "global": true,
    "buffer": true,
    "__filename": "mock",
    "__dirname": "mock"
  },
  "resolve": {
    "fastUnsafe": [],
    "alias": {},
    "packageAlias": "browser",
    "modulesDirectories": [
      "web_modules",
      "node_modules"
    ],
    "packageMains": [
      "webpack",
      "browser",
      "web",
      "browserify",
      [
        "jam",
        "main"
      ],
      "main"
    ],
    "extensions": [
      "",
      ".webpack.js",
      ".web.js",
      ".js"
    ]
  },
  "resolveLoader": {
    "fastUnsafe": [],
    "alias": {},
    "modulesDirectories": [
      "web_loaders",
      "web_modules",
      "node_loaders",
      "node_modules"
    ],
    "packageMains": [
      "webpackLoader",
      "webLoader",
      "loader",
      "main"
    ],
    "extensions": [
      "",
      ".webpack-loader.js",
      ".web-loader.js",
      ".loader.js",
      ".js"
    ],
    "moduleTemplates": [
      "*-webpack-loader",
      "*-web-loader",
      "*-loader",
      "*"
    ]
  },
  "optimize": {
    "occurenceOrderPreferEntry": true
  }
}

