(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['processEngine', '$stateParams', '$filter', '$sce', '$scope', '$state', '$modal', '$window', '$rootScope'];
    function ReportController(processEngine, $stateParams, $filter, $sce, $scope, $state, $modal, $window, $rootScope ) {
        var vm = this;

        vm.wfp = $stateParams.wfp;
        vm.wfh =  $stateParams.wfh;
        vm.name = $stateParams.name;
        vm.order = $stateParams.order;
        vm.from = $stateParams.from;
        vm.transito = true;
        vm.historico = true;
        vm.tipo = 0;
        vm.execReport = false;
        vm.grafica = false;
        vm.tipoGrafico = 0;
        vm.dataChart = [];
        vm.labelsChart = [];
        vm.seriesChart = [];
        vm.optionsChart = { legend: { display: true } };
        vm.params = [];
        vm.paramsData = {};
        vm.resultSearch = {};
        vm.exeReport = exeReport;
        vm.orderBy = orderBy;
        vm.getHtml = getHtml;
        //search ServerSide
        vm.tableState = null;
        vm.getDataServerSide = getDataServerSide;
        vm.getDataServerSideHead = getDataServerSideHead;
        vm.imprimirPlantilla = imprimirPlantilla;
        vm.isLoading = true;
        vm.displayedCollection = [];
        vm.numberItems = 20;
        vm.wfa = 0;

        activate();

        // fired when table rows are selected
        $scope.$watch('vm.displayedCollection', function(inst) {
          // get selected row
          inst.filter(function(r) {
             if (r.isSelected) {
            	 if ($scope.documentService.isOpenDoc()){
            		 var arrayDoc = $scope.documentService.getCtxOpenDoc();
            		 if (!arrayDoc[3]){//no read
            			 //open modal
            			 openModal(r);
            		 }else{
            			 $scope.documentService.close();
            			 goOpenDocument(r.camposOcultos[1].valor,r.camposOcultos[2].valor,vm.wfa);
            		 }
            	 }else{
            		 goOpenDocument(r.camposOcultos[1].valor,r.camposOcultos[2].valor,vm.wfa);
            	 }
            	//alert(JSON.stringify(r, null, 2));
             }
          })
        }, true);

        function goOpenDocument(nuDoc,nuInst,wfa) {
        	$state.go('root.main.documentopen', { 'nuDoc': nuDoc, 'nuInst': nuInst, 'wfa': wfa, 'fromState': $state.current.name },{reload:'root.main.documentopen'});
        };

        function getHtml(html) {
        	return $sce.trustAsHtml(html);
        }

        function getDataServerSideHead(tableState) {
            vm.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            vm.from = start+1;
            if (!vm.execReport){
 			   tableState.pagination.numberOfPages = 0;
   			   tableState.pagination.totalItemCount = 0;
   			   vm.isLoading = false;
   			   vm.execReport = true;
            }else{
            	if (!vm.grafica){
            		exeReport(tableState);
            	}
            }
        }

        function getDataServerSide(tableState) {
        	//simula llamado para no invocar el servicio y capturar solo el ordenamiento.
       	    if (tableState.sort.predicate) {
        	       vm.order = tableState.sort.predicate;
        	       search(vm.tableState);
        	}else{
        	       vm.order = '';
        	}
        }

        function openModal(r){
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
	                   $scope.documentService.saveClose('');
	                   goOpenDocument(r.camposOcultos[1].valor,r.camposOcultos[2].valor,vm.wfa);
	               }else{
	                   $scope.documentService.close();
	                   goOpenDocument(r.camposOcultos[1].valor,r.camposOcultos[2].valor,vm.wfa);
	               }
              }, function() {
              });
        }

        function activate() {
        	getParamReport();
        }

        function orderBy(orderBy) {
        	vm.order = orderBy;
        	exeReport();
        }

        function getParamReport() {
        	 return processEngine.getParamReport(vm)
                .then(function (data) {
                	if (data!=null){
                        vm.params = data;
                        return vm.params;
            		}
                });
        }

        function imprimirPlantilla(){
          vm.paramsData.rutaAgent = $rootScope.repAgentes+'\\';
          return processEngine.postGenerarFileReporte(vm)
                  .then(function (data) {
                    if (data!=null && data!='' ){
                      let link = $rootScope.iRepAnexos+'/'+data;
                      $window.open(link, '_blank');
                  }
                });
        }

        function exeReport(tableState) {
            vm.isLoading = true;
            vm.grafica = false;
			/*if (vm.transito && !vm.historico) vm.tipo = 1;
			else if (!vm.transito && vm.historico) vm.tipo = 2;
			else if (vm.transito && vm.historico) vm.tipo = 3;
			vm.tipo += 4;*/
            vm.tipo = 7; //todos
            //convert json data filters param
            vm.dataChart = [];
            vm.labelsChart = [];
            vm.seriesChart = [];
        	var camposBuscar = [];
        	var index = 0;
        	for(var i in vm.params) {
        	    var item = vm.params[i];
        	    if (item.value!=null && item.value!=""){
        	    	var filtervalue = "";
        	    	if (item.tipo =="L"){
        	    		filtervalue = item.value.value;
        	    	}else{
        	    		filtervalue = item.value;
        	    	}
            	    camposBuscar.push({
            	        "campoBd" : item.campoBd,
            	        "descripcion"  : item.descripcion,
            	        "valor"       : filtervalue,
            	        "pos"	: index
            	    });
        	    }
        	    index++;
        	}
        	vm.paramsData.camposBuscar = camposBuscar;
        	//alert(JSON.stringify(vm.paramsData, null, 2));
          	return processEngine.exeReport(vm)
                   .then(function (data) {
                	   if (data!=null){
                		   vm.wfa = data.wfa;
               			   if (data.tipo>vm.tipo){
               				   vm.grafica = true;
               				   vm.tipoGrafico = data.tipoGrafico;
               				   //load graph
               				   var indexInst = 0;
               				   for(var i in data.instReports) {
               					   var item = data.instReports[i];
               					   var dataObj = [];
               					   var index = 0;
               					   for(var j in item.camposMostrar){
               						   var item2 = item.camposMostrar[j];
               						   if (index!=0){
               							   if (vm.dataChart[(index-1)]==null){
               								  dataObj.push(item2.valor);
               								  vm.dataChart.push(dataObj);
               								  dataObj = [];
               							   }else{
               								  vm.dataChart[(index-1)].push(item2.valor);
               							   }
               						   }else{
               							   vm.labelsChart.push(item2.valor);
               						   }
               						   if (indexInst==0){
               							   if (index!=0){
               								   vm.seriesChart.push(item2.descripcion);
               							   }
               						   }
               						   index++;
               				   	   }
           						   indexInst++;
               				   }

               			   }
               			   vm.isLoading = false;
               			   if (data.instReports.length>0){
    	               		   vm.displayedCollection = data.instReports;
                         	   vm.numberItems = data.pagina;
                           	   tableState.pagination.numberOfPages = Math.ceil(data.total / vm.numberItems);
                           	   tableState.pagination.totalItemCount = data.total;
               			   }else{
                          vm.displayedCollection = null;
                   			   tableState.pagination.numberOfPages = 0;
                   			   tableState.pagination.totalItemCount = 0;
                   			   vm.grafica = false;
               			   }
               		}else{
               			   tableState.pagination.numberOfPages = 0;
               			   tableState.pagination.totalItemCount = 0;
               			   vm.isLoading = false;
               		}
                   });
        }

    }

})();
