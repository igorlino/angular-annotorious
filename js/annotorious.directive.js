(function () {
    'use strict';

    angular.module('annotorious')
        .directive('annotorious', annotoriousDirective);

    annotoriousDirective.$inject = ['$compile', '$rootScope', '$http', '$parse', '$timeout'];
    function annotoriousDirective($compile, $rootScope, $http, $parse, $timeout) {
        var service = {
            restrict: 'A',
            scope: {
                cbOnOpen: '&colorboxOnOpen',
                cbOnLoad: '&colorboxOnLoad',
                cbOnComplete: '&colorboxOnComplete',
                cbOnCleanup: '&colorboxOnCleanup',
                cbOnClosed: '&colorboxOnClosed'

            },
            //compile: compile,
            link: link
        };
        return service;

        ////////////////////////////


        link.$inject = ['scope', 'element', 'attrs'];
        function link(scope, element, attrs) {
            element.click('bind', function () {

                var options = {
                    href: attrs.colorboxSrc,
                    onOpen: scope.cbOnOpen(),
                    onLoad: scope.cbOnLoad(),
                    onComplete: function () {
                        onComplete();
                        if (scope.cbOnComplete()) {
                            scope.cbOnComplete()();
                        }
                    },
                    onCleanup: scope.cbOnCleanup(),
                    onClosed: scope.cbOnClosed()
                };

                //generic way that sets all (non-function) parameters of colorbox.
                if (attrs.colorboxOptions) {
                    var cbOptionsFunc = $parse(attrs.colorboxOptions);
                    var cbOptions = cbOptionsFunc(scope);
                    angular.copy(cbOptions, options);
                }

                //clean undefined
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        if (typeof(options[key]) === 'undefined') {
                            delete options[key];
                        }
                    }
                }

                $timeout(function () {
                    if (options.href) {
                        //opens the colorbox using an href.
                        $.colorbox(options);
                    } else if (attrs.colorboxSelector) {
                        //opens the colorbox using all related elements by the selected.
                        $(attrs.colorboxSelector).colorbox(options);
                    } else {
                        //opens the element of the directive.
                        $(element).colorbox(options);
                    }
                });

            });

            scope.$on('$destroy', function () {
                element.remove();
            });
        }

        function onComplete() {
            $rootScope.$apply(function () {
                var content = $('#cboxLoadedContent');
                $compile(content)($rootScope);
            });
        }
    }
})
();
