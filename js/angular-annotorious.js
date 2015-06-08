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

        function activateSelector(opt_item_url_or_callback, opt_callback) {
            return getAnnotorious().activateSelector(opt_item_url_or_callback, opt_callback);
        }

        function addAnnotation(annotation, opt_replace) {
            return getAnnotorious().addAnnotation(annotation, opt_replace);
        }

        function addHandler(type, handler) {
            return getAnnotorious().addHandler(type, handler);
        }

        function addPlugin(pluginName, opt_config_options) {
            return getAnnotorious().addPlugin(pluginName, opt_config_options);
        }

        function destroy(opt_item_url) {
            return getAnnotorious().destroy(opt_item_url);
        }

        function getAnnotations(opt_item_url) {
            return getAnnotorious().getAnnotations(opt_item_url);
        }

        function hideAnnotations(opt_item_url) {
            return getAnnotorious().hideAnnotations(opt_item_url);
        }

        function hideSelectionWidget(opt_item_url) {
            return getAnnotorious().hideSelectionWidget(opt_item_url);
        }

        function highlightAnnotation(annotation) {
            return getAnnotorious().highlightAnnotation(annotation);
        }

        function makeAnnotatable(item) {
            return getAnnotorious().makeAnnotatable(item);
        }

        function removeAll(opt_item_url) {
            return getAnnotorious().removeAll(opt_item_url);
        }

        function removeAnnotation(annotation) {
            return getAnnotorious().removeAnnotation(annotation);
        }

        /*
         reset Annotorious
         Annotorious will destroy the current annotation canvas, and create a new one
         */
        function reset() {
            return getAnnotorious().reset();
        }

        function showAnnotations(opt_item_url) {
            return getAnnotorious().showAnnotations(opt_item_url);
        }

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
                $element.bind('load', function() {
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
