angular.module('meanhotel').controller('HotelController', HotelController);

function HotelController($route, $routeParams, hotelDataFactory, AuthFactory) {
    var vm  = this;
    var id = $routeParams.id;
    hotelDataFactory.hotelDisplay(id).then(function(response) {
        vm.hotel = response.data;
        vm.stars = _getStarRating(response.data.stars);
    });

    function _getStarRating(stars) {
        return new Array(stars);
    }

    vm.isLoggedIn = function() {
      if(AuthFactory.isLoggedIn)
        return true;
      else
        return false;
    };

    vm.addReview = function() {
        var postData = {
          name: vm.name,
          rating: vm.rating,
          review: vm.review
        };
        if (vm.reviewForm.$valid) {
          hotelDataFactory.postReview(id, postData).then(function(response) {
            if (response.status === 201) {
                $route.reload();
            }
          }).catch(function(error) {
            console.log(error);
          });
        } else {
          vm.isSubmitted = true;
        }
    };
}