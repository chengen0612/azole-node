/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
  port: 3001, // 這個是 browser-sync 用的
  // porxy 真正的 web server
  proxy: "localhost:3000",
  files: ["public/**/*.css", "views/**/*.pug", "public/**/*.js"],
  ignore: ["node_modules"],
  reloadDelay: 10,
  ui: false,
  notify: false,
};
