/*global annotorious:false */
(function () {
    'use strict';

    /**
     * A local storage connector plugin.
     *
     * Requires js libraries
     * - jQuery
     * - Annotorious
     *
     * Requires angular modules for the angular services:
     *
     * - localStorageService (see https://github.com/grevory/angular-local-storage)
     * - uuid4 (see https://github.com/monicao/angular-uuid4)
     * - lodash (see https://github.com/rockabox/ng-lodash)
     */

    angular
        .module('annotorious')
        .run(appRun);

    /* @ngInject */
    function appRun(lodash, localStorageService, annotoriousService, uuid4) {
        var DEBUG = false;

        annotorious.plugin.Parse = parse;

        ///////////////////////////////////////////////

        annotorious.plugin.Parse.prototype.initPlugin = initPlugin;
        annotorious.plugin.Parse.prototype.onInitAnnotator = onInitAnnotator;

        //private methods
        annotorious.plugin.Parse.prototype._newLoadIndicator = _newLoadIndicator;
        annotorious.plugin.Parse.prototype._loadAnnotations = _loadAnnotations;
        annotorious.plugin.Parse.prototype._create = _create;
        annotorious.plugin.Parse.prototype._update = _update;
        annotorious.plugin.Parse.prototype._delete = _delete;

        annotoriousService.getAnnotorious().addPlugin('Parse', {debug: true});

        function getAnnotations() {
            /* jshint validthis: true */
            var self = this;
            var annotationsCache = localStorageService.get('annotationsCache');
            //if not existing, use an array
            if (!annotationsCache) {
                annotationsCache = [];
                localStorageService.set('annotationsCache', annotationsCache);
            }
            if (DEBUG) {
                console.log('annotorious-storage:getAnnotations:' + annotationsCache.length);
            }
            return annotationsCache;
        }

        function saveAnnotations(annotationsCache) {
            /* jshint validthis: true */
            var self = this;
            //if not existing, use an array
            if (annotationsCache) {
                var result = localStorageService.set('annotationsCache', annotationsCache);
            }
            if (DEBUG) {
                console.log('annotorious-storage:setAnnotations:' + annotationsCache.length);
            }
            return annotationsCache;
        }

        function parse(optConfigOptions) {
            /* jshint validthis: true */
            var self = this;
            /** @private **/
            self._DEBUG = optConfigOptions['debug'] || false;

            /** @private **/
            self._collection = null;
            /** @private **/
            self._loadIndicators = [];

            self._collection = getAnnotations();

        }

        function initPlugin(anno) {
            /* jshint validthis: true */
            var self = this;
            if (DEBUG) {
                console.log('annotorious-storage:initPlugin');
            }

            anno.addHandler('onAnnotationCreated', function (annotation) {
                self._create(annotation);
            });

            anno.addHandler('onAnnotationUpdated', function (annotation) {
                self._update(annotation);
            });

            anno.addHandler('onAnnotationRemoved', function (annotation) {
                self._delete(annotation);
            });
        }

        function onInitAnnotator(annotator) {
            /* jshint validthis: true */
            var self = this;
            if (DEBUG) {
                console.log('annotorious-storage:onInitAnnotator');
            }
            self._loadAnnotations(annotoriousService.getAnnotorious());

            var spinner = self._newLoadIndicator();
            annotator.element.appendChild(spinner);
            self._loadIndicators.push(spinner);
        }

        function _newLoadIndicator() {
            var outerDIV = document.createElement('div');
            outerDIV.className = 'annotorious-parse-plugin-load-outer';

            var innerDIV = document.createElement('div');
            innerDIV.className = 'annotorious-parse-plugin-load-inner';

            outerDIV.appendChild(innerDIV);
            return outerDIV;
        }

        function _loadAnnotations(anno) {
            /* jshint validthis: true */
            var self = this;
            var annotations = getAnnotations();
            lodash.forEach(annotations, function (annotation) {
                if (annotation.shapes && annotation.shapes.length > 0 && annotation.shapes[0].geometry) {
                    anno.addAnnotation(annotation);
                }
            });
        }

        function _create(annotationData) {
            /* jshint validthis: true */
            var self = this;
            var annotations = getAnnotations();
            annotationData.objectId = uuid4.generate();
            annotations.push(annotationData);
            saveAnnotations(annotations);
        }

        function _update(annotationData) {
            /* jshint validthis: true */
            var self = this;
            var annotations = getAnnotations();
            var found = true;
            for (var j = 0; j < annotations.length; j++) {
                if (annotationData.objectId === annotations[j].objectId) {
                    annotations[j] = annotationData;
                    found = true;
                    break;
                }
            }
            if (!found) {
                _create(annotationData);
            }
            saveAnnotations(annotations);
        }

        function _delete(annotationData) {
            /* jshint validthis: true */
            var self = this;
            var annotations = getAnnotations();
            var found = null;
            for (var j = 0; j < annotations.length; j++) {
                if (annotationData.objectId === annotations[j].objectId) {
                    annotations[j] = annotationData;
                    found = j;
                    break;
                }
            }
            if (found != null) {
                annotations.splice(j, 1);
                saveAnnotations(annotations);
            }
        }
    }
})();
