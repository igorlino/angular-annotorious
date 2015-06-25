/*global anno:false */
(function () {
    'use strict';

    angular.module('annotorious', [])
        .service('annotoriousService', annotoriousService)
        .directive('annotoriousAnnotate', annotoriousAnnotateDirective)
        .directive('annotorious', annotoriousDirective);

    function annotoriousService() {

        //Annotorious JavaScript API reference:
        // https://github.com/annotorious/annotorious/wiki/JavaScript-API

        var service = {
            getAnnotorious: getAnnotorious,
            createPlugin: createPlugin,

            activateSelector: activateSelector,//(opt_item_url_or_callback, opt_callback)
            addAnnotation: addAnnotation,//(annotation, opt_replace)

            setProperties: setProperties, //(opt_options)
            addHandler: addHandler, //(type, handler)
            addPlugin: addPlugin, //(pluginName, opt_config_options)
            destroy: destroy, //(opt_item_url)
            getAnnotations: getAnnotations, //(opt_item_url)
            hideAnnotations: hideAnnotations, //(opt_item_url)
            hideSelectionWidget: hideSelectionWidget, //(opt_item_url)
            highlightAnnotation: highlightAnnotation, //(annotation)
            makeAnnotatable: makeAnnotatable, //(item)
            removeAll: removeAll, //(opt_item_url)
            removeAnnotation: removeAnnotation, //(annotation)
            reset: reset, //()
            showAnnotations: showAnnotations, //(opt_item_url)
            showSelectionWidget: showSelectionWidget //(opt_item_url)
        };
        return service;

        ////////////

        function getAnnotorious() {
            return anno;
        }

        /**
         * Sets the color properties for the annotation canvas.
         * NOTE: The text dialogs are out-of-scope and per CSS customizable.
         * The following properties can be changed:
         *
         *  {
         *       outline: '#00f',
         *       stroke: '#ff0000',
         *       fill: 'rgba(255, 0, 0, 0.3)',
         *       hi_stroke: '#00ff00',
         *       hi_fill: 'rgba(0, 255, 0, 0.3)'
         *   }
         *
         * @param props
         */
        function setProperties(props) {
            getAnnotorious().setProperties(props);
        }

        /**
         * Creates and registers a plugin.
         *
         * @param pluginId
         * @param opt_config_options
         * @param pluginFunc
         * @param initFunc
         * @param annotatorFunc
         */
        function createPlugin(pluginId, opt_config_options, pluginFunc, initFunc, annotatorFunc) {
            if (!opt_config_options) {
                opt_config_options = {};
            }
            if (!pluginFunc) {
                pluginFunc = function (opt_config_options) {
                };
            }
            if (!initFunc) {
                initFunc = function (anno) {
                    // Add initialization code here, if needed (or just skip this method if not)
                };
            }
            if (!annotatorFunc) {
                annotatorFunc = function (annotator) {
                    // A Field can be an HTML string or a function(annotation) that returns a string
                    /*annotator.popup.addField(function(annotation) {
                     return '<em>Hello World: ' + annotation.text.length + ' chars</em>'
                     });*/
                };
            }

            // Set all plugin methods
            annotorious.plugin[pluginId] = pluginFunc;
            annotorious.plugin[pluginId].prototype.initPlugin = initFunc;
            annotorious.plugin[pluginId].prototype.onInitAnnotator = annotatorFunc;

            // Add the plugin
            addPlugin(pluginId, opt_config_options);
        }


        /**
         * NOTE: this method is currently only relevant for the OpenLayers module.
         * Feel free to ignore in case you are only using the standard image annotation features of Annotorious.
         * Manually actives the selector. The selector can be activated on a specific
         * item or globally, on all items (which serves mainly as a shortcut for pages where
         * there is only one annotatable item). The function can take a callback function as parameter,
         * which will be called when the selector is deactivated again.
         *
         * @param opt_item_url_or_callback
         * @param opt_callback
         * @returns {*}
         */
        function activateSelector(opt_item_url_or_callback, opt_callback) {
            return getAnnotorious().activateSelector(opt_item_url_or_callback, opt_callback);
        }

        /**
         * Adds a new annotation, or replaces an existing annotation with a new annotation.
         * (In the latter case, the parameter opt_replace must be the existing annotation.)
         *
         * @param annotation
         * @param opt_replace
         * @returns {*}
         */
        function addAnnotation(annotation, opt_replace) {
            return getAnnotorious().addAnnotation(annotation, opt_replace);
        }

        /**
         * Adds an event handler function.
         *
         Annotorious issues the following events:

         onMouseOverItem(event) - fired when the mouse enters an annotatable item
         onMouseOutOfItem(event) - fired when the mouse leaves an annotatable item
         onMouseOverAnnotation(event) - fired when the mouse enters an annotation
         onMouseOutOfAnnotation(event) - fired when the mouse leaves an annotation
         onSelectionStarted(event) - fired when the user starts a selection
         onSelectionCanceled(event) - fired when the user cancels a selection (not available on all selection tools)
         onSelectionCompleted(event) - fired when the user completes a selection
         onSelectionChanged(event) - fired when the user changed a selection
         beforePopupHide(popup) - fired just before the annotation info popup window hides
         beforeAnnotationRemoved(annotation) - fired before an annotation is removed (Note: it is possible to prevent annotation removal by returning false from the handler method!)
         onAnnotationRemoved(annotation) - fired when an annotation is removed from an imgae
         onAnnotationCreated(annotation) - fired when an annotation was created
         onAnnotationUpdated(annotation) - fired when an existing annotation was edited/updated
         *
         * @param type
         * @param handler
         * @returns {*}
         */
        function addHandler(type, handler) {
            return getAnnotorious().addHandler(type, handler);
        }

        /**
         * Registers a plugin. For more information,
         * see the Plugins Wiki page https://github.com/annotorious/annotorious/wiki/Plugins.
         *
         * @param pluginName
         * @param opt_config_options
         * @returns {*}
         */
        function addPlugin(pluginName, opt_config_options) {
            return getAnnotorious().addPlugin(pluginName, opt_config_options);
        }

        /**
         * Destroys annotation functionality on a specific item, or on all items on the page.
         * Note that this method differs from anno.reset() (see below) insofar as destroy does not
         * re-evaluate the annotatable CSS attributes. What is destroyed, stays destroyed.
         * (Until re-enabled through anno.makeAnnotatable()).
         *
         * @param opt_item_url
         * @returns {*}
         */
        function destroy(opt_item_url) {
            return getAnnotorious().destroy(opt_item_url);
        }

        /**
         * Returns the current annotations. opt_item_url is optional. If omitted,
         * the method call will return all annotations, on all annotatable items on the page.
         * If set to a specific item URL, only the annotations on that item will be returned.
         *
         * @param opt_item_url
         * @returns {*}
         */
        function getAnnotations(opt_item_url) {
            return getAnnotorious().getAnnotations(opt_item_url);
        }

        /**
         * Hides existing annotations on all, or a specific item.
         *
         * @param opt_item_url
         * @returns {*}
         */
        function hideAnnotations(opt_item_url) {
            return getAnnotorious().hideAnnotations(opt_item_url);
        }

        /**
         * Disables the selection widget (the small tooltip in the upper left corner which
         * says "Click and Drag to Annotate"), thus preventing users from creating new annotations
         * altogether. The typical use case for this is 'read-only' annotated images.
         * I.e. if you want to add some pre-defined annotations using anno.addAnnotation without the
         * user being able to add or change anything.
         *
         * The selection widget can be hidden on a specific item or globally, on all annotatable items on the page.
         *
         * @param opt_item_url
         * @returns {*}
         */
        function hideSelectionWidget(opt_item_url) {
            return getAnnotorious().hideSelectionWidget(opt_item_url);
        }

        /**
         * Highlights the specified annotation, just as if the mouse pointer was hovering over it.
         * The annotation will remain highlighted until one of these conditions is met:
         *
         * -The user moves the mouse into, and out of the annotation
         * -The user moves the mouse over another annotation
         * -The highlight is removed by calling this method with an empty parameter, e.g. anno.highlightAnnotation() or anno.highlightAnnotation(undefined)
         * -Another annotation is highlighted via anno.highlightAnnotation
         *
         * @param annotation
         * @returns {*}
         */
        function highlightAnnotation(annotation) {
            return getAnnotorious().highlightAnnotation(annotation);
        }

        /**
         * Makes an item on the screen annotatable (if there is a module available supporting the item format).
         * You can use this method as an alternative to CSS-based activation. It works just the same way,
         * and is simply there for convenience, and to prepare for (future) item formats that technically
         * don't support CSS-based activation (such as Web maps).
         *
         * @param item
         * @returns {*}
         */
        function makeAnnotatable(item) {
            return getAnnotorious().makeAnnotatable(item);
        }

        /**
         * Removes all annotations. If the optional parameter opt_item_url is set, only the annotations on the
         * specified item will be removed. Otherwise all annotations on all items on the page will be removed.
         *
         * @param opt_item_url
         * @returns {*}
         */
        function removeAll(opt_item_url) {
            return getAnnotorious().removeAll(opt_item_url);
        }

        /**
         * Removes an annotation from the page.
         *
         * @param annotation
         * @returns {*}
         */
        function removeAnnotation(annotation) {
            return getAnnotorious().removeAnnotation(annotation);
        }

        /**
         * Performs a 'hard reset' on Annotorious. This means all annotation features will be removed,
         * and the page will be re-scanned for items with the 'annotatable' CSS class. (Note: this method
         * could be handy in case you are working with JavaScript image carousels. Just make sure
         * the images have 'annotatable' set, then reset Annotorious after each page flip.)
         *
         * NOTE: Annotorious will destroy the current annotation canvas, and create a new one
         *
         * @returns {*}
         */
        function reset() {
            return getAnnotorious().reset();
        }

        /**
         * Shows existing annotations on all, or a specific item (if they were hidden using anno.hideAnnotations).
         *
         * @param opt_item_url
         * @returns {*}
         */
        function showAnnotations(opt_item_url) {
            return getAnnotorious().showAnnotations(opt_item_url);
        }

        /**
         * Enables the selection widget (the small tooltip in the upper left corner which says
         * "Click and Drag to Annotate"), thus enabling users to creating new annotations.
         * (Per default, the selection widget is enabled.)
         *
         * @param opt_item_url
         * @returns {*}
         */
        function showSelectionWidget(opt_item_url) {
            return getAnnotorious().showSelectionWidget(opt_item_url);
        }

    }

    annotoriousAnnotateDirective.$inject = ['annotoriousService', '$timeout'];
    function annotoriousAnnotateDirective(annotoriousService, $timeout) {
        var service = {
            restrict: 'A',
            link: annotateLink,
            priority: 100 // must lower priority than ngSrc (99)
        };
        return service;

        ////////////////////////////

        link.$inject = ['$scope', '$element', '$attributes'];
        function annotateLink($scope, $element, $attributes) {
            if ($attributes.src) {
                annotoriousService.makeAnnotatable($element[0]);
            } else {
                $element.bind('load', function () {
                    $scope.$apply(function () {
                        annotoriousService.makeAnnotatable($element[0]);
                    });
                });
            }
        }
    }

    annotoriousDirective.$inject = ['$compile', '$rootScope', '$http', '$parse', '$timeout', 'annotoriousService'];
    function annotoriousDirective($compile, $rootScope, $http, $parse, $timeout, annotoriousService) {
        var service = {
            restrict: 'E',
            scope: {
                open: '=',
                options: '=',

                onOpen: '&',
                onLoad: '&',
                onComplete: '&',
                onCleanup: '&',
                onClosed: '&'

            },
            require: 'annotorious',
            link: link,
            controller: controller,
            controllerAs: 'vm'
        };
        return service;

        ////////////////////////////

        controller.$inject = ['$scope'];
        function controller($scope) {

        }

        link.$inject = ['$scope', '$element', '$attributes'];
        function link($scope, $element, $attributes, controller) {
            var cb = null;

            $scope.$watch('open', function (newValue, oldValue) {
                //console.log("watch $scope.open(" + $scope.open + ") " + oldValue + "->" + newValue);
                if (oldValue !== newValue) {
                    updateOpen(newValue);
                }
            });

            $scope.$on('$destroy', function () {
                $element.remove();
            });

            init();

            function updateOpen(newValue) {
                if (newValue) {
                    init(newValue);
                } else {
                    if (options.annotationsFor) {
                        var annotatables = $(options.annotationsFor);
                        annotatables.each(function (idx) {
                            var item = this;
                            annotoriousService.makeAnnotatable(item);
                        });
                    }
                }
            }

            function init(open) {
                var options = {
                    //href: $attributes.src,
                    annotationsFor: $attributes.annotationsFor,
                    onOpen: function () {
                        if ($scope.onOpen && $scope.onOpen()) {
                            $scope.onOpen()();
                        }
                    },
                    onLoad: function () {
                        if ($scope.onLoad && $scope.onLoad()) {
                            $scope.onLoad()();
                        }
                    },
                    onComplete: function () {
                        onComplete();
                        if ($scope.onComplete && $scope.onComplete()) {
                            $scope.onComplete()();
                        }
                    },
                    onCleanup: function () {
                        if ($scope.onCleanup && $scope.onCleanup()) {
                            $scope.onCleanup()();
                        }
                    },
                    onClosed: function () {
                        $scope.$apply(function () {
                            $scope.open = false;
                        });
                        if ($scope.onClosed && $scope.onClosed()) {
                            $scope.onClosed()();
                        }


                    }
                };

                //generic way that sets all (non-function) parameters of annotorious.
                if ($scope.options) {
                    angular.extend(options, $scope.options);
                }

                //clean undefined
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        if (typeof(options[key]) === 'undefined') {
                            delete options[key];
                        }
                    }
                }

                if (typeof(open) !== 'undefined') {
                    options.open = open;
                }

                //wait for the DOM view to be ready
                $timeout(function () {

                    /*if your image is dynamically loaded,
                     make sure to set the 'annotatable' class on the element
                     and use anno.reset() after loading a new image if necessary.
                     I had to do this because annotorious was loading a 0x0px canvas when dynamically setting
                     the image src via an angular model.*/
                    if (options.annotationsFor) {
                        $(options.annotationsFor).each(function (i) {
                            var itemToAnnotate = this;
                            annotoriousService.makeAnnotatable(itemToAnnotate);
                        });
                    }
                }, 0);
            }

            function onComplete() {
                /*$rootScope.$apply(function () {
                 var content = $('#cboxLoadedContent');
                 $compile(content)($rootScope);
                 });*/
            }
        }


    }
})
();
