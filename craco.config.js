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
  // FIX: https://github.com/facebook/create-react-app/discussions/11767#discussioncomment-2421668
  webpack: {
    configure: {
      ignoreWarnings: [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module
            && warning.module.resource.includes('node_modules')
            && warning.details
            && warning.details.includes('source-map-loader')
          );
        },
      ],
    },
  },
};
