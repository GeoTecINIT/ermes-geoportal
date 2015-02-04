/* 
  DOJO configuration to work in a mnodular fashion.
  The run.js file sets up a regular expression that ensures modules are loaded correctly.
*/

/* global define, require, location*/  // Jshint option to indicate global objects
(function () {
  'use strict'; // // Jshint option to help catch coding problems

  var pathRX = new RegExp(/\/[^\/]+$/);
  var locationPath = location.pathname.replace(pathRX, '');

  require({
    async: true,  // Loads modules as needed
    aliases: [
      ['text', 'dojo/text']],
    packages: [{  // Defines packages using modified  pathname
      name: 'controllers',
      location: locationPath + 'js/controllers'
    }, 
    {
      name: 'services',
      location: locationPath + 'js/services'
    }, 
    {
      name: 'utils',
      location: locationPath + 'js/utils'
    }, 
    {
      name: 'widgets',
      location: locationPath + 'js/widgets'
    }, 
    {
      name: 'app',
      location: locationPath + 'js',
      main: 'main'
    }]}, 
    ['app']);

})();
