angular.module('annotoriousdemo.controllers', []).
    controller('AnnotoriousCtrl', function ($scope, $location, colorboxService, annotoriousService) {

        $scope.annotateColorbox01a = {};
        $scope.annotateColorbox01 = {};

        $scope.imagesForGallery = [];
        $scope.setApproot = function (appRoot) {
            //only change when needed.
            if ($scope.approot && appRoot === $scope.approot) {
                return;
            }
            $scope.approot = appRoot;
            $scope.imagesForGallery = [
                {
                    thumb: appRoot + 'images/thumb/image1.jpg',
                    small: appRoot + 'images/small/image1.jpg',
                    large: appRoot + 'images/large/image1.jpg'
                },
                {
                    thumb: appRoot + 'images/thumb/image2.jpg',
                    small: appRoot + 'images/small/image2.jpg',
                    large: appRoot + 'images/large/image2.jpg'
                },
                {
                    thumb: appRoot + 'images/thumb/image3.jpg',
                    small: appRoot + 'images/small/image3.jpg',
                    large: appRoot + 'images/large/image3.jpg'
                },
                {
                    thumb: appRoot + 'images/thumb/image4.jpg',
                    small: appRoot + 'images/small/image4.jpg',
                    large: appRoot + 'images/large/image4.jpg'
                },
                {
                    thumb: appRoot + 'images/thumb/image5.jpg',
                    small: appRoot + 'images/small/image5.jpg',
                    large: appRoot + 'images/large/image5.jpg'
                }
            ];

            $scope.zoomModel1 = $scope.imagesForGallery[0];
            $scope.zoomModel2 = $scope.imagesForGallery[1];

            $scope.zoomModelGallery01 = $scope.imagesForGallery[1];
            $scope.zoomModelGallery04 = $scope.imagesForGallery[3];
            $scope.zoomModelGallery05 = $scope.imagesForGallery[0];

            angular.extend($scope.annotateColorbox01a,
                {
                    href: appRoot + 'images/large/image2.jpg',
                    width: '75%',
                    height: '75%',
                    onComplete: function () {
                        var photo = $("#cboxLoadedContent .cboxPhoto")[0];
                        if (photo.src) {
                            console.log('annotateColorbox01a ' + photo.src);
                            annotoriousService.makeAnnotatable(photo);
                            var annotations = annotoriousService.getAnnotations(photo.src);
                            console.log(annotations);
                            if (annotations && annotations.length > 0) {
                                annotoriousService.showAnnotations(photo.src);
                                colorboxService.resize();
                            }

                        }
                    },
                    onCleanup: function () {
                        //alert('onCleanupa ');
                        annotatableImage();
                    }
                });

            angular.extend($scope.annotateColorbox01, {
                href: appRoot + 'images/large/image4.jpg',
                className: 'colorbox-to-annotate',
                onComplete: function () {
                    var photo = $("#cboxLoadedContent .cboxPhoto")[0];
                    if (photo.src) {
                        console.log('annotateColorbox01 ' + photo.src);
                        annotoriousService.makeAnnotatable(photo);
                        colorboxService.resize();
                        var annotations = annotoriousService.getAnnotations(photo.src);
                        console.log(annotations);
                        if (annotations && annotations.length > 0) {
                            annotoriousService.showAnnotations(photo.src);
                            colorboxService.resize();
                        }

                    }
                },
                onCleanup: function () {
                    //alert('onCleanupa ');
                    annotatableImage();
                }
            });
        };

        //default
        $scope.setApproot('');

        $scope.annotateColorbox03 = {
            rel: 'img-group-01',
            slideshow: false,
            open: false,
            onComplete: function () {
                console.log('03-complete');
                var photo = colorboxService.getCurrentPhoto();
                if (photo.src) {
                    console.log('annotateColorbox03 ' + photo.src);
                    annotoriousService.makeAnnotatable(photo);
                    var annotations = annotoriousService.getAnnotations(photo.src);
                    console.log(annotations);
                    if (annotations && annotations.length > 0) {
                        annotoriousService.showAnnotations(photo.src);
                        colorboxService.resize();
                    }

                }
            },
            onLoad: function () {
                console.log('03-onLoad');
                annotatableImage();
            },
            onCleanup: function () {
                console.log('03-cleanup');
                annotatableImage();
            }
        };

        function annotatableImage() {
            var photo = colorboxService.getCurrentPhoto();
            if (photo && photo.src) {
                //required
                annotoriousService.reset(photo.src);
            }
        }


        $scope.zoomOptions = {
            scrollZoom: true,
            zoomWindowWidth: 600,
            zoomWindowHeight: 600,
            easing: true,
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 500,
            lensFadeIn: 500,
            lensFadeOut: 500,

            initial: 'small'
        };

        $scope.zoomOptionsGallery01 = {
            scrollZoom: true,
            zoomWindowWidth: 600,
            zoomWindowHeight: 600,
            easing: true,
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 500,
            lensFadeIn: 500,
            lensFadeOut: 500,

            initial: 'small',

            gallery: 'gallery_01',
            cursor: 'pointer',
            galleryActiveClass: "active",
            imageCrossfade: true,
            loadingIcon: false
        };

        $scope.zoomOptionsGallery04 = {
            scrollZoom: true,
            zoomWindowWidth: 600,
            zoomWindowHeight: 600,
            easing: true,
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 500,
            lensFadeIn: 500,
            lensFadeOut: 500,

            initial: 'small',

            gallery: 'gallery_04',
            cursor: 'pointer',
            galleryActiveClass: "active",
            imageCrossfade: true,
            loadingIcon: false
        };


        $scope.setActiveImageInGallery = function (prop, img) {
            $scope[prop] = img;
            //console.log(img);
        };
        $scope.setScopeValue = function (prop, value) {
            $scope[prop] = value;
        };
    });

