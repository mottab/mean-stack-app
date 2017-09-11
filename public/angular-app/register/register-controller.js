angular.module('meanhotel').controller('RegisterController', RegisterController);

function RegisterController($http) {
    var vm = this;
    vm.register = function() {
        var user = {
            username : vm.username,
            password : vm.password
        };
        if(!vm.username || !vm.password) {
            vm.error = 'Please add username and password';
        } else {
            if(vm.password !== vm.passwordRepeat) {
                vm.error = 'Passwords should match each others';
            } else {
                $http.post('/api/users/register', user).then(function(response){
                    console.log('user registeration done' , user);
                    vm.message = 'successful registeration, please login';
                    vm.error = '';
                }).catch(function(error){
                    console.log('error');
                    vm.error(error);
                });
            }
        }
    };
}