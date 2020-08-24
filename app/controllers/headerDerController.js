(function () {
    'use strict';
    angular
        .module('myApp')
        .controller('HeaderDerController', HeaderDerController);
    HeaderDerController.$inject = ['processEngine', 'user','$state', '$location','$scope', '$stateParams', '$modal', '$rootScope', '$window', 'Idle', 'inform', '$locale'];
    function HeaderDerController(processEngine, user, $state, $location, $scope, $stateParams, $modal, $rootScope, $window, Idle, inform, $locale) {
        var vm = this;
        vm.user = { name: "", pass: "", envi: "", email: "", question:"" };
        vm.isShowBarEmails = false;
        vm.barEmails = [];
        vm.agents = [];
        vm.profileNombre = "";
        vm.logout = logout;
        vm.profile = profile;
        vm.showInfo = false;
        vm.msg = $stateParams.msg;
        vm.openModal = openModal;
        vm.openLink = openLink;
        vm.nbConversacionOpen = '';
        vm.nuDocOpen = '';
        vm.goOpenDocument = goOpenDocument;
        vm.openModalCloseDocument = openModalCloseDocument;

        $rootScope.ultVezConexion=''
        $rootScope.ultIP=''

        activate();
        function logout() {
        	if ($scope.ticketService.isAuthed()){
                processEngine.deleteSession()
                .then(function (data) {
                	if (data!=null){
            			$scope.ticketService.delTicket();
            			$scope.ticketService.delStatusCode();
                        $state.go('root.login');
            		}
                    vm.response = data;
                    return vm.response;
                });
        	}
        }

        function activate() {
          console.log($state)
          /*if($state.url == 'root.login'){
            ultVez()
          }*/

    			if ($scope.ticketService.isAuthed()){
    				loadContext();

            /*Activacion de monitoreo de actividades en angular*/
              Idle.watch();
              $rootScope.$on('IdleStart', function() {
                    console.log('IdleStart');
                     inform.add("Sesion se cancelara en 60 segundos por inactividad",{ttl:8000, type:'warning'});
                  });

              $rootScope.$on('IdleEnd', function() {
                    console.log('IdleEnd');
                    inform.add("Sesion Extendida",{ttl:12000, type:'success'});
                    console.log('fin de eventro IdleEnd')
                });

              $rootScope.$on('IdleTimeout', function() {
                console.log('IdleTimeout');
                    if ($rootScope.ticketService.isAuthed()){
                          processEngine.deleteSession()
                            .then(function (data) {
                              if (data!=null){
                                  $rootScope.ticketService.delTicket();
                                  $rootScope.ticketService.delStatusCode();
                                  $state.go('root.login');
                                //  inform.add("Sesion cancelada por inactividad",{ttl:12000, type:'danger'});
                                  $window.location.reload();
                              }
                          });
                    }
                });


    			}
    			if ($scope.documentService.isOpenDoc()){
    				var arrayDoc = $scope.documentService.getCtxOpenDoc();
    		        vm.nbConversacionOpen = arrayDoc[4];
    		        vm.nuDocOpen = arrayDoc[0];
    			}
        }

        function loadContext() {
        	getEmails();
        	getAgentsGenerals();
        	loadProfile();
        }

        function getEmails() {
        	return processEngine.getEmails()
        	.then(function (respuesta) {
        		if (respuesta!=null){
                   	if(respuesta==''){
            			vm.isShowBarEmails = false;
            		}else{
                		vm.isShowBarEmails = true;
                		vm.barEmails = respuesta;
            		}
        		}
            });
        }

        function getAgentsGenerals() {
        	processEngine.getAgentsGenerals()
        	.then(function (data) {
        		if (data!=null){
        			vm.agents = data;
        		}
            });
        }

        function loadProfile() {
              var prof = processEngine.getProfile()
              .then(function (data) {
              	if (data!=null){
                  	vm.profileNombre = data.nombre;
                    $rootScope.profileNombre = data.nombre;
                  	$rootScope.nbAmbiente = data.ambiente;
                    $rootScope.admUsr = data.admusr;
                    /*se asgina formato decimal*/
                    $locale.NUMBER_FORMATS.DECIMAL_SEP = data.formatoDecimal;
                    $locale.NUMBER_FORMATS.GROUP_SEP = data.formatoMiles;

      	        		processEngine.loadEnvironment($rootScope.nbAmbiente)
      	                .then(function(data) {
      	                	if (data!=null){
      	                		$scope.documentService.saveCtxAmb(angular.lowercase(data.matriz.formatoFecha),data.matriz.FormatoMiles,data.matriz.FormatoDecimal,data.matriz.idioma);
      	                		if (data.matriz.idioma=='2'){
      	                			$.fn.datepicker.defaults.language = 'es';
      	                		}
      	                		$window.formatDate = angular.lowercase(data.matriz.formatoFecha);
                            $rootScope.tamanoAnexo = data.matriz.tamanoAnexo;
                            $rootScope.iRepAnexos = data.matriz.iRepAnexos;
                            $rootScope.repAgentes = data.matriz.repAgentes;
                            $rootScope.timeSave = data.matriz.timeSave;
      	                	}
      	                });

              	}
              });

        }

        function profile(){
        	$state.go('root.main.profile',{},{reload:'root.main.profile'});
        }

        function openLink(link){
        	$window.open(link, '_blank');
        }

        function openModal(){
	    		 var arrayDoc = $scope.documentService.getCtxOpenDoc();
	    		 if (!arrayDoc[3]){//no read
	    			 //open modal
	    	            var modalInstance = $modal.open({
	    	                templateUrl: 'app/views/templates/modalDocument.html',
	    	                keyboard: false,
	    	                backdrop: 'static',
	    	                controller: ModalInstController,
	    	                resolve: {
	    	                }
	    	              });
	    	              modalInstance.result.then(function(option) {
	    		               if (option=='1'){
	    		                   $scope.documentService.saveClose('')
	    		                   .then(function (data) {
	    		                	   logout();
	    		                   });
	    		               }else{
	    		                   $scope.documentService.close()
	    		                   .then(function (data) {
	    		                	   logout();
	    		                   });
	    		               }
	    	              }, function() {

	    	              });
	    		 }else{
	    			 logout();
	    		 }
        }

        function openModalCloseDocument(){
	    		 var arrayDoc = $scope.documentService.getCtxOpenDoc();
	    		 if (!arrayDoc[3]){//no read
	    			 //open modal
	    	            var modalInstance = $modal.open({
	    	                templateUrl: 'app/views/templates/modalDocument.html',
	    	                keyboard: false,
	    	                backdrop: 'static',
	    	                controller: ModalInstController,
	    	                resolve: {
	    	                }
	    	              });
	    	              modalInstance.result.then(function(option) {
	    		               if (option=='1'){
	    		                   $scope.documentService.saveClose('')
	    		                   .then(function (data) {
	    		                	   //logout();
	    		                   });
	    		               }else{
	    		                   $scope.documentService.close()
	    		                   .then(function (data) {
	    		                	   //logout();
	    		                   });
	    		               }
	    	              }, function() {

	    	              });
	    		 }else{
	    			// logout();
	    		 }
        }

        function goOpenDocument(){
        	var arrayDoc = $scope.documentService.getCtxOpenDoc();
        	$state.go('root.main.documentopen', { 'nuDoc': arrayDoc[0], 'nuInst': arrayDoc[1], 'wfa': arrayDoc[2] },{reload:'root.main.documentopen'});
        }

    }
})();
