(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('HeaderIzqController', HeaderIzqController);

    HeaderIzqController.$inject = ['processEngine', 'user','$state', '$location','$scope', '$stateParams'];

    function HeaderIzqController(processEngine, user, $state, $location, $scope, $stateParams) {
        var vm = this;

        vm.goMain = goMain;
        vm.showInfo = false;
        vm.msg = $stateParams.msg;
        vm.nuDocLect = 'N';

        function goMain(){
        	$state.go('root.main',{},{reload:true});
        }

    }
})();
