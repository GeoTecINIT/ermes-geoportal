# Folders 
An overview of the folder structure and organization of the project.

The `app` folder keeps only files that will be used in the JavaScript Web application. On the contrary, the `doc` folder contains notes, documents, and other non-executable files related to the application.

The `app` folder contains the main HTML web page of the application (index.html), the `css` folder that holds all style sheets for the application, 
the `config` folder that holds configurable files in JSON format, `img` folder that holds all images for the application, and the `js` folder that holds all the JavaScript files used in the application. 

Within the `js` folder, apart from the sub folders  listed below, new subfolders can be created as required to fulfill new dependences: 
* modules to manage tasks at an application level are kept in the `controllers` folder. 
* modules to manage the data model of the aplpcaiiton are kept in the `models` folder.
* modules that interact with extrenal web services are kept in the `services` folder.
* helper modules are kept in the `utils` folder.
* custom widgets we build are kept in the `widgets` folder; HTML snippets that are the user interfaca (view) of widgets are stored in the `template` folder.
* `index.html` is the application entry point. 
* `run.js` is where Dojo configuration takes place.
* `mainLauncher.js` is where the actual web application is started.