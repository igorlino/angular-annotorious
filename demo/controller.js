angular.module('annotoriousdemo.controllers', []).
    controller('AnnotoriousCtrl', function ($scope,   $location) {
        /*$scope.$on('$routeChangeSuccess', function() {
            $scope.menuActive = $location.path().split("/")[1];
        });*/
        $scope.imagesForGallery = [
            {
                thumb:'images/thumb/image1.jpg',
                small:'images/small/image1.jpg',
                large:'images/large/image1.jpg'
            },
            {
                thumb:'images/thumb/image2.jpg',
                small:'images/small/image2.jpg',
                large:'images/large/image2.jpg'
            },
            {
                thumb:'images/thumb/image3.jpg',
                small:'images/small/image3.jpg',
                large:'images/large/image3.jpg'
            },
            {
                thumb:'images/thumb/image4.jpg',
                small:'images/small/image4.jpg',
                large:'images/large/image4.jpg'
            },
            {
                thumb:'images/thumb/image5.jpg',
                small:'images/small/image5.jpg',
                large:'images/large/image5.jpg'
            }
        ];
    });

