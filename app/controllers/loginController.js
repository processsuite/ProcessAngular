(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['processEngine', 'user','$state', '$location','$scope', '$stateParams', '$rootScope','ticketService'];

    function LoginController(processEngine, user, $state, $location, $scope, $stateParams, $rootScope, ticketService) {
        var vm = this;
        //console.log(user)
        vm.user = { name: "", pass: "", envi: "", email: "", question:"", newAnswer: "", confAnswer: "", newQuestion: "", newpass: "",  confpass: "", oldpass:"", answer:""};
        vm.user.question = user.question;
        vm.login = login;
        vm.showChangePass = false;
        vm.loginRecover = loginRecover;
        vm.loginRenew = loginRenew;
        vm.back = back;
        vm.forgot = forgot;
        vm.forgot_step1 = forgot_step1;
        vm.forgot_step2 = forgot_step2;
        vm.forgot_send = forgot_send;
        vm.environments = [];
        vm.showInfo = false;
        vm.selectedOption = {};
        vm.msg = $stateParams.msg;
        vm.saveNewSecurity = saveNewSecurity;
        vm.changePasswordExpired = changePasswordExpired;
        vm.validateQuestion = validateQuestion;
        vm.envShow = true;
        activate();

      function login() {
        	vm.msg = "";
            $scope.ticketService.delStatusCode();
            $scope.ticketService.resetListError();
			if (vm.user.envi!=""){
				vm.selectedOption.name = vm.user.envi;
			}
			$scope.documentService.delCtxOpenDoc();
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
                              if(data.primaraVez){
                                user.oldpass = vm.user.pass;
                                $state.go('root.login.primeravez',{},{reload:true});
                              }else{
                                $state.go('root.main',{},{reload:true});
                              }
                        });


                	}else{
                		if ($scope.ticketService.getStatusCode() == "15140") {
                            user.name = vm.user.name;
                            user.pass = vm.user.pass;
                            user.envi = vm.selectedOption.name;
                            user.sc = data.sessionCaida;
                            vm.isLogged = true;
                            $scope.ticketService.delStatusCode();
                            $scope.ticketService.resetListError();
                            // Preguntar al usuario si elimina o recupera la session
                            user.oldpass = vm.user.pass;
                            $state.go('root.login.recuperate',{},{reload:true});
                        }else if ($scope.ticketService.getStatusCode() == "15300") {
                            user.name = vm.user.name;
                            user.pass = vm.user.pass;
                            user.envi = vm.selectedOption.name;
                            user.sc = data.sessionCaida;
                            vm.isLogged = true;
                            $scope.ticketService.delStatusCode();
                            $scope.ticketService.resetListError();
                            user.oldpass = vm.user.pass;
                            $state.go('root.login.passwordexpired',{},{reload:true});
                        }else if ($scope.ticketService.getStatusCode() == "15330") {

                            user.sc = data.sessionCaida;
                            vm.isLogged = true;
                            $scope.ticketService.delStatusCode();
                            $scope.ticketService.resetListError();
                            user.oldpass = vm.user.pass;
                            processEngine.getProfile()
                            .then(function(data){
                                  user.question = data.pregunta;
                                    $state.go('root.login.validquestion',{'question': data.pregunta},{reload:true});
                            });
                        }
                	}
                });
        }

        function loginRecover() {
            processEngine.getSession(user)
                .then(function (data) {
                	if (data.statusCode == "0" || data.statusCode == "15305"){
                        $scope.ticketService.delWarning();
                        vm.response = data;
                        user.name = vm.user.name;
                        user.pass = vm.user.pass;
                        user.oldpass = vm.user.pass;
                          if($scope.ticketService.getStatusCode() == "15305"){
                            $scope.ticketService.codeWarning($scope.ticketService.getStatusCode())
                            $scope.ticketService.messageWarning($scope.ticketService.getDescriptionError($scope.ticketService.getStatusCode()))
                          }
                        processEngine.getProfile()
                        .then(function(data){
                            if(data.primaraVez){
                              $state.go('root.login.primeravez',{},{reload:true});
                            }else{
                              $state.go('root.main',{},{reload:true});
                            }
                        });
                	}else if (data.statusCode == "15300") {
                      user.name = vm.user.name;
                      user.pass = vm.user.pass;
                      user.envi = vm.selectedOption.name;
                      user.sc = data.sessionCaida;
                      vm.isLogged = true;
                      $scope.ticketService.delStatusCode();
                      $scope.ticketService.resetListError();
                      user.oldpass = vm.user.pass;
                      $state.go('root.login.passwordexpired',{},{reload:true});
                  }else if (data.statusCode == "15330") {

                      user.sc = data.sessionCaida;
                      vm.isLogged = true;
                      $scope.ticketService.delStatusCode();
                      $scope.ticketService.resetListError();
                      user.oldpass = vm.user.pass;
                      processEngine.getProfile()
                      .then(function(data){
                            user.question = data.pregunta;
                              $state.go('root.login.validquestion',{'question': data.pregunta},{reload:true});
                      });
                  }
                    return vm.response;
                })
        }

        function loginRenew() {
            processEngine.putSession(user)
                .then(function (data) {
                	if (data.statusCode == "0" || data.statusCode == "15305"){
                        $scope.ticketService.delWarning();
                        vm.response = data
                        user.name = vm.user.name;
                        user.pass = vm.user.pass;
                        user.oldpass = vm.user.pass;
                          if($scope.ticketService.getStatusCode() == "15305"){
                            $scope.ticketService.codeWarning($scope.ticketService.getStatusCode())
                            $scope.ticketService.messageWarning($scope.ticketService.getDescriptionError($scope.ticketService.getStatusCode()))
                          }
                        processEngine.getProfile()
                        .then(function(data){
                            if(data.primaraVez){
                              $state.go('root.login.primeravez',{},{reload:true});
                            }else{
                              $state.go('root.main',{},{reload:true});
                            }
                        });

                	}else if (data.statusCode == "15300") {
                      user.name = vm.user.name;
                      user.pass = vm.user.pass;
                      user.envi = vm.selectedOption.name;
                      user.sc = data.sessionCaida;
                      vm.isLogged = true;
                      $scope.ticketService.delStatusCode();
                      $scope.ticketService.resetListError();
                      user.oldpass = vm.user.pass;
                      $state.go('root.login.passwordexpired',{},{reload:true});
                  }else if (data.statusCode == "15330") {

                      user.sc = data.sessionCaida;
                      vm.isLogged = true;
                      $scope.ticketService.delStatusCode();
                      $scope.ticketService.resetListError();
                      user.oldpass = vm.user.pass;
                      processEngine.getProfile()
                      .then(function(data){
                            user.question = data.pregunta;
                              $state.go('root.login.validquestion',{'question': data.pregunta},{reload:true});
                      });
                  }
                    return vm.response;
                })
        }

        function back() {
          processEngine.deleteSession()
              .then(function(data) {
                $state.go('root.login',{},{reload:true});
              });

        }

        function activate() {
        	$scope.ticketService.resetListError();

            if (!!$state.params.environmentName) {
               verifyEnvironment();
            }
            if(config.environmentStatic!= undefined && !!config.environmentStatic){
              vm.user.envi = config.environmentStatic;
            }
            if(vm.environmentShow != undefined && vm.envShow != config.environmentShow){
              vm.envShow = vm.environmentShow;
            }
    		if (($state.current.name=="root.login") || ($state.current.name=="root.login.environment") || ($state.current.name=="root.login.forgot")){
    			$scope.ticketService.delTicket();
    			$scope.ticketService.resetListError();
    			if (vm.user.envi==""){
    				getEnvironments();
    			}
			} else if ($scope.ticketService.isAuthed()){
        	    /*if($state.current.name=="root.main.profile"){
        		}else if($state.current.name=="root.main.changepass"){
        		}else if($state.current.name=="root.main.changepassapro"){
        		}else if($state.current.name=="root.main.changesecquest"){
        		}else if ($state.current.name!="root.main"){*/

        		/*if (($state.current.name!="root.main")){
        			$scope.ticketService.delTicket();
					$state.go('root.login');
				}*/
				if ($state.current.name=="root.login.forgotsend"){
        			forgot_step2();
        		}
        	}
        }

        function verifyEnvironment() {
            /*processEngine.verifyEnvironment($state.params.environmentName)
                .then(function (isVerified) {
                    if (isVerified) {
                        vm.user.envi = $state.params.environmentName;
                    }
                });*/
        	vm.user.envi = $state.params.environmentName;
        }

        function getEnvironments() {
            processEngine.getEnvironments()
                .then(function(data) {
            		if (!$scope.ticketService.isShowError()){
                        vm.environments = data;
                        if (vm.environments.length==1){//validar si es un solo ambiente
                        	vm.user.envi = vm.environments[0].name;
                          vm.selectedOption = vm.environments[0];
                        }
                        return vm.environments;
            		}
                });
        }

        function setEnvironment(environment) {
        	user.server = environment;
        }

        function forgot() {
        	$state.go('root.login.forgot',{},{reload:true});
        }

        function forgot_step1() {
        	vm.user.pass = "";
        	$scope.ticketService.resetListError();
            processEngine.postSessionRc(vm)
            .then(function (data) {
            	if (!$scope.ticketService.isShowError()){
                    user.name = vm.user.name;
                    user.envi = vm.selectedOption.name;
                    user.email = vm.user.email;
                    $state.go('root.login.forgotsend',{},{reload:true});
                    vm.response = data;
            	}else{
					if ($scope.ticketService.getStatusCode() == "15140") {
	                    user.name = vm.user.name;
	                    user.envi = vm.selectedOption.name;
	                    user.email = vm.user.email;
						$scope.ticketService.delStatusCode();
						$state.go('root.login.forgotsend',{},{reload:true});
					}else if ($scope.ticketService.getStatusCode() == "15300") {

                    }else if ($scope.ticketService.getStatusCode() == "15330") {

                    }
            	}
            });
        }

        function forgot_step2() {
        	vm.user.name = user.name;
        	vm.user.envi = user.envi;
        	vm.user.email = user.email;
        	$scope.ticketService.resetListError();
            processEngine.getProfile()
            .then(function (data) {
            	if (!$scope.ticketService.isShowError()){
                	vm.user.question = data.pregunta;
            	}
            });
        }

        function forgot_send() {
            processEngine.recoverPass(vm)
            .then(function (data) {
            	if (!$scope.ticketService.isShowError()){
            		vm.showInfo = true;
                	vm.messageInfo = "SendPasswordEmail";
            	}
            });
        }

        function profile(){
        	$state.go('root.main.profile',{},{reload:true});
        }

        function saveNewSecurity(){
            if(vm.user.newpass != vm.user.confpass){
          		vm.showError = true;
          		vm.messageError = ticketService.getDescriptionError(12);
          	}else{
              vm.showError = false;
            }
            if(vm.user.newAnswer != vm.user.confAnswer){
          		vm.showError = true;
          		vm.messageError = ticketService.getDescriptionError(13);
          	}else if(!vm.showError){
              vm.showError = false;
            }
            if(!vm.showError){
              vm.user.oldpass = user.oldpass;//contraseña.
              vm.user.pass = vm.user.newpass;
              /*-----------------------------*/
              vm.user.question = vm.user.newQuestion;
              vm.user.answer = vm.user.newAnswer;
              vm.user.approval = "";
              processEngine.changePassProfile(vm)
              .then(function (data) {
                  if (!$scope.ticketService.isShowError()){
                      //vm.showInfo = true;
                      //vm.messageInfo = "Process completed successfully!";
                      processEngine.changeSecurityQuestionInicio(vm)
                        .then(function (data) {
                                if (!$scope.ticketService.isShowError()){
                                    //vm.showInfo = true;
                                    //vm.messageInfo = "Process completed successfully!";
                                    $state.go('root.main',{},{reload:true});
                                }
                            });
                      }
                });
            }


        }

        function changePasswordExpired(){
          if(vm.user.newpass != vm.user.confpass){
            vm.showError = true;
            vm.messageError = ticketService.getDescriptionError(12);
          }else{
            vm.showError = false;
          }

          if(!vm.showError){
            vm.user.oldpass = user.oldpass;//contraseña.
            vm.user.pass = vm.user.newpass;
            /*-----------------------------*/
            vm.user.question = vm.user.newQuestion;
            vm.user.answer = vm.user.newAnswer;
            vm.user.approval = "";
            processEngine.changePassProfile(vm)
            .then(function (data) {
                if (!$scope.ticketService.isShowError()){
                      $state.go('root.main',{},{reload:true});
                    }
              });
          }

        }

        function changeQuestionExpired(){
          if(vm.user.newAnswer != vm.user.confAnswer){
            vm.showError = true;
            vm.messageError = ticketService.getDescriptionError(13);
          }else if(!vm.showError){
            vm.showError = false;
          }

          vm.user.question = vm.user.newQuestion;
          vm.user.answer = vm.user.newAnswer;
          vm.user.approval = "";
          processEngine.changeSecurityQuestionInicio(vm)
            .then(function (data) {
                    if (!$scope.ticketService.isShowError()){
                        //vm.showInfo = true;
                        //vm.messageInfo = "Process completed successfully!";
                        $state.go('root.main',{},{reload:true});
                    }
                });
        }

        function validateQuestion(){
        //console.log(vm);
          //console.log('antes',user);
        processEngine.validateQuestionEmail(vm)
          .then(function (data) {
            if (!$scope.ticketService.isShowError()){
                vm.isLogged = true;
                $scope.ticketService.delStatusCode();
                $scope.ticketService.resetListError();
                vm.user.oldpass = user.oldpass;
                //console.log('despues',vm.user);
                $state.go('root.login.passwordexpired',{},{reload:true});
            }
          });
        }

    }

})();
