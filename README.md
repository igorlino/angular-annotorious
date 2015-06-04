[Angular Annotorious](https://github.com/igorlino/angular-annotorious/)
================================

[Angular Annotorious](https://github.com/igorlino/angular-annotorious/) is directive for the image annotation library [Annotorious](http://annotorious.github.io/) plugin.

## Features

Compatible with: jQuery 1.3.2+ in Firefox, Safari, Chrome, Opera, Internet Explorer 7+

- Flexible Angular directive
- Image Annotation
- Appearance is controlled through CSS so it can be restyled.
- BETA OpenSeadragon integration. ( web-based viewer for high-resolution zoomable images )
## Installation

Via [Bower](http://bower.io/):

```bash
bower install angular-colorbox
```

Via [npm](https://www.npmjs.com/):

```bash
npm install angular-colorbox
```

In a browser:

```html
<link rel="stylesheet" type="text/css" href="colorbox.css" media="screen" />
<script src="jquery.colorbox.js"></script>
<script src="colorbox-module.js"></script>
<script src="colorbox-directive.js"></script>
```

## Getting Started

Include the Colorbox plug-in and the directive on a page.

Basic
```html
 <img    src="path_to_image" 
        colorbox
        colorbox-src="path_to_large_image" />
```

Extended
```html
 <img   src="path_to_image" 
        colorbox
        colorbox-options="{href:'images/large/image1.jpg', opacity:0.5, title:'A nice colorbox' }"
```

For more information on how to setup and customise, [check the examples](http://igorlino.github.io/angular-colorbox/).

## License
Licensed under MIT license.
