  require([
    'controllers/MainController',
    'dojo/domReady!'
  ], function (MainController) {

    console.debug('Starting application.');
    var start = new MainController();

  });