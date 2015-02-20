  require([
    'controllers/MainController',

    'dojo/domReady!'
  ], function (MainController) {

    console.debug('DEBUG - Starting application');
    var start = new MainController();

  });