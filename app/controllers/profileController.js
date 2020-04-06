(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['processEngine', '$state','$scope'];

    function ProfileController(processEngine, $state, $scope) {
    	var vm = this;

        vm.profile = [];
        vm.load_profile = load_profile;
        vm.showInfo = false;

        vm.load_change_pass = load_change_pass;
        vm.load_change_pass_apro  = load_change_pass_apro;
        vm.load_change_sec_questions = load_change_sec_questions;
        vm.load_change_info = load_change_info;
        vm.oldpass = null;
        vm.change_pass = change_pass;
        vm.change_pass_apro = change_pass_apro;
        vm.change_questions = change_questions;
        vm.change_info = change_info;
        activate();

        function activate() {
        	if ($scope.ticketService.isAuthed()){
        	    if($state.current.name=="root.main.profile"){
        	    	getData();
        		}else if($state.current.name=="root.main.changepass"){
        		}else if($state.current.name=="root.main.changepassapro"){
        			getData();
        		}else if($state.current.name=="root.main.changesecquest"){
        		}else if($state.current.name=="root.main.changeinfo"){
        			getData();
        		}else{
        			$scope.ticketService.delTicket();
					$state.go('root.login');
				}
        	}
            return false;
        }

        function getData() {
            processEngine.getProfile()
                .then(function (data) {
                	if (data!=null){
                    	vm.profile.nombre = data.nombre;
                    	vm.profile.email = data.email;
                    	vm.profile.formatoFecha = data.formatoFecha;
                    	vm.profile.activoD = data.activoD;
                    	vm.profile.nuDocLect = data.nuDocLect;
                    	vm.profile.preguntaVencida = data.preguntaVencida;
                    	vm.profile.cantDiasVencLic = data.cantDiasVencLic;
                    	vm.profile.pregunta = data.pregunta;
                        return vm.profile;
                	}
                });
        }

        function load_profile(){
        	$state.go('root.main.profile');
        }

        function load_change_pass(){
        	$state.go('root.main.changepass');
        }

        function load_change_pass_apro(){
        	$state.go('root.main.changepassapro');
        }

        function load_change_sec_questions(){
        	$state.go('root.main.changesecquest');
        }

        function load_change_info(){
        	$state.go('root.main.changeinfo');
        }

        function change_info(){
    		processEngine.changeInfoProfile(vm)
    		.then(function (data) {
    			if (data!=null){
        			vm.showInfo = true;
            		vm.messageInfo = "Process completed successfully!";
    			}
            });
        }

        function change_pass(){
        	if(vm.user.pass != vm.user.confirmpass){
        		vm.showError = true;
        		vm.messageError = processEngine.getMessageError(12);
        	}else{
        		vm.showError = false;
        		vm.messageError = null;

        		processEngine.changePassProfile(vm)
        		.then(function (data) {
        			if (data!=null){
            			vm.showInfo = true;
                		vm.messageInfo = "Process completed successfully!";
        			}
                });
        	}
        }

        function change_pass_apro(){
        	if(vm.user.approval != vm.user.confirmApproval){
        		vm.showError = true;
        		vm.messageError = processEngine.getMessageError(14);
        	}else{
        		vm.showError = false;
        		vm.messageError = null;

        		processEngine.changePassApprovalProfile(vm)
        		.then(function (data) {
        			if (data!=null){
            			vm.showInfo = true;
                		vm.messageInfo = "Process completed successfully!";
        			}
                });
        	}
        }

        function change_questions(){
        	if(vm.user.answer != vm.user.confirmAnswer){
        		vm.showError = true;
        		vm.messageError = processEngine.getMessageError(13);
        	}else{
        		vm.showError = false;
        		vm.messageError = null;

        		processEngine.changeSecurityQuestionProfile(vm)
        		.then(function (data) {
        			if (data!=null){
            			vm.showInfo = true;
                		vm.messageInfo = "Process completed successfully!";
        			}
            });
        	}
        }

    }

})();
