(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('LoginExtController', LoginExtController);

    LoginExtController.$inject = ['processEngine', 'user','$state', '$location','$scope', '$stateParams', '$rootScope','ticketService'];

    function LoginExtController(processEngine, user, $state, $location, $scope, $stateParams, $rootScope, ticketService) {
        var vm = this;
        console.log("inicia servicio externo");
        let data = atob($stateParams.hashUser).split(':');
        console.log(data);
        vm.selectedOption = {};
        vm.selectedOption.name = $stateParams.ambiente;
        vm.user = {};
        vm.user.name = data[0];
        vm.user.pass = data[1];

        login();

        function login() {
          $scope.ticketService.delStatusCode();
          $scope.ticketService.resetListError();
              processEngine.postSession(vm)
                  .then(function (data) {
                      $scope.ticketService.delWarning();
                    if (!$scope.ticketService.isShowError() || $scope.ticketService.getStatusCode() == "15305"){
                          user.name = vm.user.name;
                          user.pass = vm.user.pass;
                          user.envi = vm.user.envi;
                          vm.isLogged = true;
                          if($scope.ticketService.getStatusCode() == "15305"){
                            $scope.ticketService.codeWarning($scope.ticketService.getStatusCode())
                            $scope.ticketService.messageWarning($scope.ticketService.getDescriptionError($scope.ticketService.getStatusCode()))
                          }
                          processEngine.getProfile()
                          .then(function(data){
                                $rootScope.fchultconex = data.fchultconex;
                                $rootScope.ip = data.ip;

                                if(data.primaraVez){
                                  user.oldpass = vm.user.pass;
                                  $state.go('root.login.primeravez',{},{reload:true});
                                }else{
                                  $scope.ticketService.userExt(1);
                                  $state.go('root.main',{},{reload:true});
                                }
                          });


                    }else{
                      console.log("Error iniciando sesion ",$scope.ticketService.getStatusCode());
                    }
                  });
          }
      }
  }
)();
