(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('tooltips', tooltips)
        .controller('ServiceController', ServiceController);

    ServiceController.$inject = ['processEngine', '$scope', '$state', '$modal'];

    function ServiceController(processEngine, $scope, $state, $modal) {
        var vm = this;
        vm.goCreateDocument = goCreateDocument;
        vm.openModal = openModal;
        vm.stringtojson = stringtojson;
        vm.services = [];
        activate();

        function activate() {
        	if ($scope.ticketService.isAuthed()){
        		getServices();
        	}
            return false;
        }

        function getServices() {
            processEngine.getServices()
                .then(function(data) {
                	if (data!=null){
                        vm.services = data;
                        return vm.services;
            		}
                });
        }

        function goCreateDocument(wfp,name,frmn){
        	$state.go('root.main.documentcreate', { 'wfp': wfp, 'name': name, 'frmn': frmn },{reload:'root.main.documentcreate'});
        }

        function openModal(wfp,name,frmn){
	       	 if ($scope.documentService.isOpenDoc()){
	    		 var arrayDoc = $scope.documentService.getCtxOpenDoc();
	    		 if (!arrayDoc[3]){//no read
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
	    		                	   goCreateDocument(wfp,name,frmn);
	    		                   });
	    		               }else{
	    		                   $scope.documentService.close()
	    		                   .then(function (data) {
	    		                	   goCreateDocument(wfp,name,frmn);
	    		                   });
	    		               }
	    	              }, function() {
	    	              });
	    		 }else{
	    			 $scope.documentService.close();
	    			 goCreateDocument(wfp,name,frmn);
	    		 }
	    	 }else{
	    		 goCreateDocument(wfp,name,frmn);
	    	 }
        }

        function stringtojson(child){
          let data = {};
            if(child.info.indexOf('{') != -1){
               data = angular.fromJson(child.info)
            }else{
              data.img = "app/images/documento.gif";
              data.text = child.info;
            }
          console.log(data)
          child.info = data;
        }


    }

    function tooltips(){
      return {
           restrict: 'A',
           link: function(scope, element, attrs){
               element.hover(function(){
                   // on mouseenter
                   element.tooltip('show');
               }, function(){
                   // on mouseleave
                   element.tooltip('hide');
               });
           }
       };
    }

})();
