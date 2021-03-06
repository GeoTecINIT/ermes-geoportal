# Notes

This is a working document to keep updated notes on setting up the development environment for the ERMES project

## Setting up development environment

### Sublime Text 3 Build 3065 (http://www.sublimetext.com/3)

I've installed the following list of Sublime Text plugins or extension. It is good idea to follow the same order:
* [Package Control](https://packagecontrol.io/installation)
* Linting: [SublimeLinter](http://www.sublimeLinter.com),  a linter framework for Sublime Text 3.
* Linting: [SublimeLinter-jshint](https://github.com/SublimeLinter/SublimeLinter-jshint), JS linter using jshint plugin for SublimeLinter
* Linting: [SublimeLinter-json](https://github.com/SublimeLinter/SublimeLinter-json), JSON linter plugin for SublimeLinter
* [All AutoComplete](https://github.com/alienhard/SublimeAllAutocomplete), extends the default autocomplete (words found in the current file) to find matches in all open files.
* Markdown: [Markdownpreview](https://github.com/revolunet/sublimetext-markdown-preview)
* Markdown:[MarkdownEditing](https://github.com/SublimeText-Markdown/MarkdownEditing)
* Theme: [Cobalt2](https://github.com/wesbos/cobalt2)
    
Additional plugins that might be used in the future:     
* Beautify: http://jsbeautifier.org, http://cssbeautifier.com
* Miminifation:
* Task automation: [Grunt](http://gruntjs.com)
* GIT: SublimeGit Pluging (https://sublimegit.net/)
* GIT: Git Gutter plugin (https://github.com/jisaacks/GitGutter) lets you see in Gutter (next to the numbers) which lines are changed from the last Git Commit
* Coding: DocBlock plugin (https://github.com/spadgos/sublime-jsdocs)
* Project Manager, https://github.com/randy3k/Project-Manager
* 

### ArcGIS API for JavaScript

We use version [3.12](http://js.arcgis.com/3.12) of the ArcGIS API for JavaScript, which was upgraded to use Dojo 1.10.2. See [ESRI blog post](http://blogs.esri.com/esri/arcgis/2014/12/18/arcgis-api-for-javascript-version-3-12-released/)

### GIT, GitHub
 We are going to use github, because it provides these benefits to ease rapid development and demonstration:
 * It supports Markdown format for documentation
 * It supports one [User Page](https://help.github.com/articles/user-organization-and-project-pages/#user--organization-pages) for a user account 
 * It supports various [Project Pages](https://help.github.com/articles/user-organization-and-project-pages/#project-pages) for each individual project or reporsitory
 * It supports [wiki pages](https://github.com/ermes-fp7space/project-template/wiki) for further documentation, roadmap, changelog, etc.
 
We created a GitHub user account for the ERMES project: *ermes-fp7space*. [GitHub url](https://github.com/ermes-fp7space). It has the following public web sites:
* User Page: http://ermes-fp7space.github.io/ermes-fp7space
* Project Pages: http://ermes-fp7space.github.io/project-template/app

Buth are used for testing nad experimentation purpose for rapid demonstration. It is expected that the operational application will be deployed on UJI premises.

We could create more repos in the future for individual source projects as needed. For example:
* `project-template`: basic project structure and folder organization. 
* `ermes-prototype`: hosts the application prototype. Experimentation purpose. it will be active until the end March 2015.
* `ermes-rss`: will host the web application for the Regional Rice Service (RSS) for production purpose based on lesson learned during prototyping plus stakehodlers/pàrtners feedback. It will be launch after once `ermes-prototype` repo closes. 
* `timeseries-plots-js`: it might host a time series plot custom library (using D3) to create time series plots tied to pixel values of raster data. 
* ...

## Useful articles, books, documentation, and links

### Sublime Text:
* http://www.sitepoint.com/10-essential-sublime-text-plugins-full-stack-developer/
* https://scotch.io/collections/the-complete-visual-guide-to-sublime-text-3
* https://scotch.io/bar-talk/best-of-sublime-text-3-features-plugins-and-settings
* https://scotch.io/bar-talk/the-complete-visual-guide-to-sublime-text-3-getting-started-and-keyboard-shortcuts
* https://scotch.io/bar-talk/the-complete-visual-guide-to-sublime-text-3-plugins-part-1
* https://scotch.io/bar-talk/the-complete-visual-guide-to-sublime-text-3-plugins-part-2
* Sublime Text Power User Book, https://sublimetextbook.com/
* [Sublime Text 3: Setup, Package Control, and Settings](https://www.youtube.com/watch?v=zVLJfrIwEP8)

### Chrome Development Tools:
* http://developer.chrome.com/devtools
* http://discover-devtools.codeschool.com/
* [Emmet Re: View](http://re-view.emmet.io/)
* [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
* [Google Clousure Tools](https://developers.google.com/closure/): JS optimizer & minifier

### Dojo:
* [Dojo](http://dojotoolkit.org/)
* [Dojo Toolkit Reference Guide](http://dojotoolkit.org/reference-guide/1.10/)
* Tutorial: [Hello Dojo!](http://dojotoolkit.org/documentation/tutorials/1.10/hello_dojo/)
* Tutorial: [Introduction to AMD Modules](http://dojotoolkit.org/documentation/tutorials/1.9/modules/) introduces the loader and the `require` and `define` functions to use and create modules respectively
* Tutorial: [Classy JavaScript with dojo/_base/declare](http://dojotoolkit.org/documentation/tutorials/1.10/declare/) introduces the `declare` module to create classes 

### ESRI:
* [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)
* [ESRI github](https://github.com/Esri)
* [JavaScript: The Good Parts](http://shop.oreilly.com/product/9780596517748.do)