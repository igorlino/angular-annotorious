[Angular Annotorious](https://github.com/igorlino/angular-annotorious/)
================================

[Angular Annotorious](https://github.com/igorlino/angular-annotorious/) is directive for the image annotation library [Annotorious](http://annotorious.github.io/) plugin.

## Features

Compatible with: jQuery 1.3.2+ in Firefox, Safari, Chrome, Opera, Internet Explorer 7+

- Image Annotation
- Angular directives to annotate individual images or a selection.
- Angular service to access all the annotarious API
- Appearance is controlled through CSS so it can be restyled.
- BETA OpenSeadragon integration. ( web-based viewer for high-resolution zoomable images )

## Installation

Via [Bower](http://bower.io/):

```bash
bower install angular-annotorious
```

Via [npm](https://www.npmjs.com/):

```bash
npm install angular-annotorious
```

In a browser:

```html
<link rel="stylesheet" type="text/css" href="http://annotorious.github.com/latest/annotorious.css" media="screen" />
<script src="http://annotorious.github.com/latest/annotorious.min.js"></script>
<script src="angular-annotorious.js"></script>
```

## Getting Started

Include the Annotorious plug-in and the directive on a page.

Basic with attribute
```html
<img src="http://annotorious.github.io/img/splash-image-1.jpg" annotorious-annotate>
```

Basic with dynamic src
```html
{{imgURL=http://annotorious.github.io/img/splash-image-1.jpg}}

<img ng-src="{{imgURL}}" annotorious-annotate>
```

Basic with tag
```html
<img id="anno1" src="http://annotorious.github.io/img/splash-image-1.jpg">

<annotorious options="{annotationsFor:'#anno1'}" />
```

Dynamic Query URLs

Do the image URLs change somehow between page load? (E.g. differences im the query string?)
You can add a "data-original" attribute to the image. Annotorious will then use the value of this attribute as the identifier/src used to re-associate annotations with images. 

```html
<img  src="http://any.long.url/that-could-change.jpg?foo=randomtoken" 
      data-original="stable-identifier-for-image"
      annotorious-annotate>
```


Multiple with tag
```html
<img class="group" src="http://annotorious.github.io/img/splash-image-1.jpg">
<img class="group" src="http://annotorious.github.io/img/splash-image-1.jpg">

<annotorious options="{annotationsFor:'.group'}" />
```

For more information on how to setup and customise, [check the examples](http://igorlino.github.io/angular-annotorious/).

## Storage providers

The storage provider examples are under 'src/storage-providers/'

Their purpose is to save and load annotations to/from the local browser storage.

It should give you an idea how to do it for other type of storage providers.

If you create another storage provider, that ends up generic enough, you may like to contribute it for the angular-annotorious community, your are very welcome.


## License
Licensed under MIT license.
