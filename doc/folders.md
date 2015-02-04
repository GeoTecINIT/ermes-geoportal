# Folders 
An overview of the folder structure and organization of the project.

The `app` folder keeps only files that will be used in the JavaScript Web application. On the contrary, the `doc` folder contains notes, documents, and other non-executable files related to the application.

The `app` folder contains the main HTML web page of the application (index.html), the `css` folder that holds all style sheets for the application, `img` folder that holds all images for the application, and the `js` folder that holds all the JavaScript files used in the application. 

Within the `js` folder, apart from the ones listed bewlow, we can create new subfolders as required to fulfill new dependences: 
* modules to manage tasks at an application level are kept in the `controllers` folder
* modules that interact with outside web services are kept in the `services` folder
* helper modules are kept in the `utils` folder
* custom widgets we build are kept in the `widgets` folder
* `main.js` is where the actual web application is started
* `run.js` is where Dojo configuration takes place