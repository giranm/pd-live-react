const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'sass-loader',
        options: {
          sassOptions: {
            includePaths: [path.resolve(__dirname, 'src/assets/images')],
          },
        },
      },
    ],
  },
};
