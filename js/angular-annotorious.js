(function () {
    'use strict';

    angular.module('annotorious', [])
        .directive('annotorious', annotoriousDirective);

    annotoriousDirective.$inject = ['$compile', '$rootScope', '$http', '$parse', '$timeout'];
    function annotoriousDirective($compile, $rootScope, $http, $parse, $timeout) {
        var service = {
            restrict: 'E',
            scope: {
                open: '=',
                templateUrl: '&',

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
                    $.colorbox.close();
                }
            }

            function init(open) {
                var options = {
                    href: $attributes.src,
                    boxFor: $attributes.boxFor,
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
                        $scope.$apply(function() {
                            $scope.open = false;
                        });
                        if ($scope.onClosed && $scope.onClosed()) {
                            $scope.onClosed()();
                        }
                    }
                };

                //generic way that sets all (non-function) parameters of colorbox.
                if ($attributes.options) {
                    var cbOptionsFunc = $parse($attributes.options);
                    var cbOptions = cbOptionsFunc($scope);
                    angular.extend(options, cbOptions);
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
                    if (options.boxFor) {
                        //opens the element by id boxFor
                        cb = $(options.boxFor).colorbox(options);
                    } else if (options.href) {
                        //opens the colorbox using an href.
                        cb = $.colorbox(options);
                    }
                }, 0);
            }

            function onComplete() {
                $rootScope.$apply(function () {
                    var content = $('#cboxLoadedContent');
                    $compile(content)($rootScope);
                });
            }
        }


    }
})
();
