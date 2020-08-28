(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('TasksController', TasksController)
        .directive('stSelectDistinct', SelectDistinct)
        .directive('stDateRange', DateRange)
    	.filter('customFilter', CustomFilter);

    TasksController.$inject = ['processEngine', '$stateParams', '$filter', '$scope', '$state', '$modal', '$window', '$rootScope', '$sce'];
    function TasksController(processEngine, $stateParams, $filter, $scope, $state, $modal, $window, $rootScope, $sce) {
        var vm = this;
        //seg
        vm.taskId = '';
        vm.taskDocId = '';
        vm.tipoSeg = 0;
        vm.segTasks = [];
        vm.segMails = [];
        vm.segMail = null;
        vm.segMailContent = '';
        vm.segAnexos = [];
        vm.segRelacionados = {};

        vm.semaforoTask = "";
        vm.tasks = [];
        vm.cesta = {};
        vm.process = [];
        vm.numCla = '';
        vm.displayedCollection = [];
        vm.notifications = [];
        vm.serverSide = false;
        vm.isLoading = true;
        vm.typeTask;
        vm.desdeTask;
        vm.openEmail = openEmail;
        vm.getSegTask = getSegTask;
        $scope.openDoc = openDoc;
        $scope.goOpenDocument = goOpenDocument;
        //search ServerSide
        vm.tableState;
        vm.numberItems = 20;
        vm.getDataServerSideHead = getDataServerSideHead;
        vm.getDataServerSide1 = getDataServerSide1;
        vm.searchServerSide = searchServerSide;
        vm.getTaskProcess = getTaskProcess;
        vm.execSearchs = false;
        vm.nuDocSearch = '';
        vm.detailSearch = '';
        vm.dateIniSearch = '';
        vm.dateFinSearch = '';
        vm.wfpSearch = 0;
        vm.wfaSearch = 0;
        vm.nbFilterActivity = '';

        vm.dataGantt = [];
        vm.tabGantt = false;
        vm.tabGanttActive = tabGanttActive;
        vm.apiGantt = apiGantt;
        vm.getHtml = getHtml

        function getHtml(html) {
            return $sce.trustAsHtml(html);
        };

        function tabGanttActive() {
        	vm.tabGantt = true;
        }

        function apiGantt(api) {
        	 api.core.on.ready($scope, function() {
             	//seg for gantt
             	if (vm.semaforo == 5){
             		vm.tipoSeg = 10;
             	}else{
             		vm.tipoSeg = 2;
             	}
             	processEngine.getSegGanttTask(vm)
                 .then(function (data) {
                	 if (data!=null){
             			//vm.segTasks = data;
             			//alert(JSON.stringify(data, null, 2));
                     	var nameRow = '';
                     	var resRow = '';
                     	var dataTask = [];
                     	for(var i in data.inst) {
                     	    var item = data.inst[i];
                 	    	var datetime1 = item.feIni.split(' ');
                 	    	var datetime1Date = datetime1[0].split('/');
                 	    	var datetime1Time = datetime1[1].split(':');
                 	    	var datetime2 = item.feFin.split(' ');
                 	    	var datetime2Date = datetime2[0].split('/');
                 	    	var datetime2Time = datetime2[1].split(':');

                 	    	var date1 = new Date(parseInt(datetime1Date[2]), parseInt(datetime1Date[1]) -1, parseInt(datetime1Date[0]), parseInt(datetime1Time[0]), parseInt(datetime1Time[1]), parseInt(datetime1Time[2]));
                 	    	var date2 = new Date(parseInt(datetime2Date[2]), parseInt(datetime2Date[1]) -1, parseInt(datetime2Date[0]), parseInt(datetime2Time[0]), parseInt(datetime2Time[1]), parseInt(datetime2Time[2]));


                     	    if (nameRow==''){
                     	    	nameRow = item.nbWfDest;
                     	    	resRow = item.nbPersona;
                     	    }
                     	    if ((nameRow!=item.nbWfDest) || (resRow!=item.nbPersona)){
                     	    	vm.dataGantt.push({
                         	        "name" : nameRow,
                         	        "data"  : {res:resRow},
                         	        "tasks" : dataTask
                         	    });
                             	nameRow = item.nbWfDest;
                             	resRow = item.nbPersona;
                             	dataTask = [];
                     	    	dataTask.push({
                         	        "name" : item.nbWfDest,
                         	        "from"  : date1,
                         	        "to"       : date2
                         	    });
                     	    }else{
                     	    	dataTask.push({
                         	        "name" : item.nbWfDest,
                         	        "from"  : date1,
                         	        "to"       : date2
                         	    });
                     	    }
                     	    if ((vm.dataGantt.length==0)&&(dataTask.length>0)){
                     	    	vm.dataGantt.push({
                         	        "name" : nameRow,
                         	        "data"  : {res:item.nbPersona},
                         	        "tasks" : dataTask
                         	    });
                     	    }
                     	}
                     	//return seg
                     	if (vm.semaforo == 5){
                     		vm.tipoSeg = 9;
                     	}else{
                     		vm.tipoSeg = 1;
                     	}
                     	//$scope.gantt.api.columns.generate();
             		}
                 });
        	 });
        }

        vm.columnsFormatters = {
            'from': function(from) {
                return from !== undefined ? from.format('lll') : undefined;
            },
            'to': function(to) {
                return to !== undefined ? to.format('lll') : undefined;
            }
        };
        vm.width = false;
        vm.zoom = 1;
		vm.scale = 'week';
		vm.autoExpand = 'none';
		vm.getColumnWidth = getColumnWidth;

        activate();

        function activate() {
        	$scope.ticketService.resetListError();
            getFilter();
    		if (!$window.formatDate){
    			$window.formatDate = $scope.documentService.getCtxAmb()[0];
    		}
        }

        function getColumnWidth(widthEnabled, scale, zoom) {
            if (!widthEnabled) {
                return undefined;
            }

            if (scale.match(/.*?week.*?/)) {
                return 150 * zoom;
            }

            if (scale.match(/.*?month.*?/)) {
                return 300 * zoom;
            }

            if (scale.match(/.*?quarter.*?/)) {
                return 500 * zoom;
            }

            if (scale.match(/.*?year.*?/)) {
                return 800 * zoom;
            }

            return 40 * zoom;
        };

        function goOpenDocument(nuDoc,nuInst,wfa) {
       	 if ($scope.documentService.isOpenDoc()){
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
        	                	  $state.go('root.main.documentopen', { 'nuDoc': nuDoc, 'nuInst': nuInst, 'wfa': wfa },{reload:true});
        	                   });
        	               }else{
        	                   $scope.documentService.close()
        	                   .then(function (data) {
        	                	  $state.go('root.main.documentopen', { 'nuDoc': nuDoc, 'nuInst': nuInst, 'wfa': wfa },{reload:true});
        	                   });
        	               }
                      }, function() {
                      });
       		 }else{
       			 $scope.documentService.close();
       			 $state.go('root.main.documentopen', { 'nuDoc': nuDoc, 'nuInst': nuInst, 'wfa': wfa },{reload:true});
       		 }
       	 }else{
       		 $state.go('root.main.documentopen', { 'nuDoc': nuDoc, 'nuInst': nuInst, 'wfa': wfa },{reload:true});
       	 }
       };

        function openDoc(taskId,nuInst,wfa,semaforoTask) {
        	if (taskId=='x'){
    		    $('#colTask').toggleClass('shift-left shift-right');
    		    $('#colDoc').toggleClass('span0 span2');
   		    	vm.taskDocId = '';
   		    	vm.taskNuInstId = '';
   		    	vm.taskWfaId = '';
        	}else{
            	//if ((taskId!=vm.taskDocId)||(nuInst!=vm.taskNuInstId)){
                	vm.taskDocId = taskId;
       		    	  vm.taskNuInstId = nuInst;
       		    	  vm.taskWfaId = wfa;
                	vm.semaforoTask = semaforoTask;
                	if (taskId!=vm.taskId){//close seg
                    	if ($('#rowTask').hasClass("shift-top"))
                	    {
                    	    $('#rowTask').toggleClass('shift-bottom shift-top');
                    	    $('#rowSeg').toggleClass('row0 row2');
                	    }
                	}
                	if (!$('#colTask').hasClass("shift-left")){
            		    $('#colTask').toggleClass('shift-left shift-right');
            		    $('#colDoc').toggleClass('span0 span2');
            	    }
            	//}
        	}
        }

        function openEmail(email) {
        	vm.segMailContent = '';
        	vm.segMail = email;
        	vm.segMail.para = vm.segMail.para.replace(';','; ');
        	processEngine.getSegContentEmail(vm.segMail)
            .then(function (data) {
            	if (data!=null){
        			vm.segMailContent = data;
        		}
            });
        }

        function getSegTask(taskId, semaforoTask) {
        	if (taskId=='x'){
        	    $('#rowTask').toggleClass('shift-bottom shift-top');
        	    $('#rowSeg').toggleClass('row0 row2');
        	    vm.taskId = '';
        	}else{
        		if (taskId!=vm.taskId){
                	vm.segTasks = [];
                	vm.dataGantt = [];
                	vm.tabGantt = false;
                	vm.segMails = [];
                	vm.segAnexos = [];
                	vm.segMail = null;
                	vm.segRelacionados = {};
                	vm.taskId = taskId;
                	vm.semaforoTask = semaforoTask;
                	if (vm.semaforo == 5){
                		vm.tipoSeg = 9;
                	}else{
                		vm.tipoSeg = 1;
                	}
                	$('.nav-tabs a[href="#seg1"]').tab('show');
                	if (!$('#rowTask').hasClass("shift-top"))
            	    {
                	    $('#rowTask').toggleClass('shift-bottom shift-top');
                	    $('#rowSeg').toggleClass('row0 row2');
            	    }
                	if (taskId!=vm.taskDocId){//close doc
                    	if ($('#colTask').hasClass("shift-left"))
                	    {
               		    	vm.taskDocId = '';
               		    	vm.taskNuInstId = '';
               		    	vm.taskWfaId = '';
                		    $('#colTask').toggleClass('shift-left shift-right');
                		    $('#colDoc').toggleClass('span0 span2');
                	    }
                	}
                	processEngine.getSegTask(vm)
                        .then(function (data) {
                        	if (data!=null){
                    			vm.segTasks = data;
                    		}
                        });

                	processEngine.getSegEmails(vm)
                    .then(function (data) {
                    	if (data!=null){
                       		vm.segMails = data;
                		}
                    });
                	processEngine.getSegAnexos(vm)
                    .then(function (data) {
                    	if (data!=null){
                			vm.segAnexos = data;
                		}
                    });
                	processEngine.getSegRelacionados(vm)
                    .then(function (data) {
                    	if (data!=null){
                			vm.segRelacionados = data;
                		}
                    });
        		}
        	}

        }

        function getTasks() {
        	vm.typeTask = 9;
        	vm.desdeTask = 0;
        	vm.nuDocSearch = 0;
        	vm.detailSearch = '';
        	vm.dateIniSearch = '';
        	vm.dateFinSearch = '';
          vm.wfpSearch = 0;
          vm.wfaSearch = 0;
        	 return processEngine.getTasks(vm)
                .then(function (data) {
                	if (data!=null){
               			vm.cesta = data;
                        vm.tasks = vm.cesta.insts;
                        return vm.tasks;
            		}
                });
        }

        function getTasksVencidos() {
        	vm.typeTask = 9;
        	vm.desdeTask = 0;
        	vm.nuDocSearch = 0;
        	vm.detailSearch = '';
        	vm.dateIniSearch = '';
        	vm.dateFinSearch = '';
            vm.wfpSearch = 0;
            vm.wfaSearch = 0;
        	 return processEngine.getTasksVencidos(vm)
                .then(function (data) {
                	if (data!=null){
               			vm.cesta = data;
                        vm.tasks = vm.cesta.insts;
                        return vm.tasks;
            		}
                });
        }

        function getTasksRiesgo() {
        	vm.typeTask = 9;
        	vm.desdeTask = 0;
        	vm.nuDocSearch = 0;
        	vm.detailSearch = '';
        	vm.dateIniSearch = '';
        	vm.dateFinSearch = '';
            vm.wfpSearch = 0;
            vm.wfaSearch = 0;
        	 return processEngine.getTasksRiesgo(vm)
                .then(function (data) {
                	if (data!=null){
               			vm.cesta = data;
                        vm.tasks = vm.cesta.insts;
                        return vm.tasks;
            		}
                });
        }

        function getTasksVigente() {
        	vm.typeTask = 9;
        	vm.desdeTask = 0;
        	vm.nuDocSearch = 0;
        	vm.detailSearch = '';
        	vm.dateIniSearch = '';
        	vm.dateFinSearch = '';
            vm.wfpSearch = 0;
            vm.wfaSearch = 0;
        	 return processEngine.getTasksVigente(vm)
                .then(function (data) {
                	if (data!=null){
               			vm.cesta = data;
                        vm.tasks = vm.cesta.insts;
                        return vm.tasks;
            		}
                });
        }

        function getTasksBorrador() {
        	vm.typeTask = 265;
        	vm.desdeTask = 0;
        	vm.nuDocSearch = 0;
        	vm.detailSearch = '';
        	vm.dateIniSearch = '';
        	vm.dateFinSearch = '';
            vm.wfpSearch = 0;
            vm.wfaSearch = 0;
        	 return processEngine.getTasksBorrador(vm)
                .then(function (data) {
                	if (data!=null){
               			vm.cesta = data;
                        vm.tasks = vm.cesta.insts;
                        return vm.tasks;
            		}
                });
        }

        function getTaskProcess(wfp,wfa,nbActivity){
            vm.wfpSearch = wfp;
            vm.wfaSearch = wfa;
            vm.nbFilterActivity = nbActivity;
            $('a.dropdown-toggle.form-controlSearch.process').dropdown('toggle');
            searchServerSide(vm.tableState);
        }

        function searchServerSide(tableState) {
            if (vm.semaforo == 4){//Enviados
            	vm.typeTask = 10;
           	    processEngine.getTasks(vm)
                   .then(function (data) {
                	   if (data!=null){
               			vm.cesta = data;
               			vm.displayedCollection = vm.cesta.insts;
               		}
               		 vm.isLoading = false;
               		 tableState.pagination.numberOfPages = Math.ceil(vm.cesta.total / vm.numberItems);
               		 tableState.pagination.totalItemCount = vm.cesta.total;
                   });
            }else if (vm.semaforo == 5){//Culminados
            	vm.typeTask = 74;
           	    processEngine.getTasks(vm)
                   .then(function (data) {
                	   if (data!=null){
               			vm.cesta = data;
               			vm.displayedCollection = vm.cesta.insts;
               		}
               		 vm.isLoading = false;
               		tableState.pagination.numberOfPages = Math.ceil(vm.cesta.total / vm.numberItems);
               		tableState.pagination.totalItemCount = vm.cesta.total;
                   });
            }
        }

        function getDataServerSideHead(tableState) {
            vm.isLoading = true;
            vm.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            vm.numberItems = 20;
            vm.desdeTask = start+1;
            if (!vm.execSearchs){
  			   	tableState.pagination.numberOfPages = 0;
    			tableState.pagination.totalItemCount = 0;
    			vm.isLoading = false;
    			vm.execSearchs = true;
             }else{
            	 searchServerSide(tableState);
             }

        }

        function getDataServerSide1(tableState) {
        	//simula llamado para no invocar el servicio y capturar solo el ordenamiento.
       	    if (tableState.sort.predicate) {
                   var filtered = vm.displayedCollection;
          		   vm.displayedCollection = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
          		   //alert(JSON.stringify(vm.displayedCollection, null, 2));
        	}
        }


        function getNotifications() {
        	vm.typeTask = 12;
        	 return processEngine.getTasks(vm)
                .then(function (data) {
                	if (data!=null){
            			vm.notifications = data;
                        return vm.tasks;
            		}
                });
        }

        $scope.getters = {
        		feIni:function(row) {
        	        	var dt1   = parseInt(row.feIni.substring(0,2));
        	        	var mon1  = parseInt(row.feIni.substring(3,5));
        	        	var yr1   = parseInt(row.feIni.substring(6,10));
        	        	var date1 = new Date(yr1, mon1-1, dt1);
        		        return new Date(date1);
        		   }
        		}

        function getFilter() {
            switch($stateParams.filter){
                case 0:
                    vm.semaforo = 0;
                    vm.name = "WorkVigente";
                    getTasksVigente();
                    vm.serverSide = false;
                    break;
                case 1:
                    vm.semaforo = 1;
                    vm.name = "WorkRiesgo";
                    getTasksRiesgo();
                    vm.serverSide = false;
                    break;
                case 2:
                    vm.semaforo = 2;
                    vm.name = "WorkVencido";
                    getTasksVencidos();
                    vm.serverSide = false;
                    break;
                case 3:
                    vm.semaforo = 3;
                    vm.name = "WorkBorrador";
                    getTasksBorrador();
                    vm.serverSide = false;
                    break;
                case 4:
                    vm.semaforo = 4;
                    vm.name = "WorkEnAtencion";
                    vm.numCla = 2;
                    vm.serverSide = true;
                	 processEngine.getTasksClasificacion(vm)
                     .then(function (data) {
                    	 if (data!=null){
                 			vm.process =  data;
                 		}
                     });
                    break;
                case 5:
                    vm.semaforo = 5;
                    vm.name = "WorkCulminado";
                    vm.numCla = 3;
                    vm.serverSide = true;
                	 processEngine.getTasksClasificacion(vm)
                     .then(function (data) {
                    	 if (data!=null){
                 			vm.process =  data;
                 		}
                     });
                    break;
                default:
                	vm.semaforo = '';
                	vm.name = "WorkTodos";//esta opcion es sin los Enviados(Atencion/Culminado)
                	vm.numCla = 0;
                	getTasks();
                	vm.serverSide = false;
                    break;
            }
        }

    }

    function SelectDistinct() {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
              collection: '=',
              predicate: '@',
              predicateExpression: '='
            },
            templateUrl: 'app/views/templates/selectdistinct.html',
            link: function(scope, element, attr, table) {

              scope.nbFilterActivity = '';

              var getPredicate = function() {
                var predicate = scope.predicate;
                if (!predicate && scope.predicateExpression) {
                  predicate = scope.predicateExpression;
                }
                return predicate;
              }

              scope.$watch('collection', function(newValue) {
                var predicate = getPredicate();

                if (newValue) {
                  var temp = [];
                  scope.distinctItems = [];

                  angular.forEach(scope.collection, function(item) {
                    var value = item[predicate];

                    if (value && value.trim().length > 0 && temp.indexOf(value) === -1) {
                      temp.push(value);
                    }
                  });
                  temp.sort();

                  scope.distinctItems = scope.distinctItems.concat(temp);
                  scope.selectedOption = '';//scope.distinctItems[0];
                  scope.optionChanged(scope.selectedOption);
                }
              }, true);

              scope.optionChanged = function(selectedOption) {
                var predicate = getPredicate();

                var query = {};

                query.distinct = selectedOption;

                if (query.distinct === '') {
                  query.distinct = '';
                }
                scope.nbFilterActivity = query.distinct;
                table.search(query, predicate);
              };
            }
          }
    }

    function DateRange(documentService) {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
                before: '=',
                after: '='
            },
            templateUrl: 'app/views/templates/dateRange.html',

            link: function (scope, element, attr, table ) {

                var inputs = element.find('input');
                var inputBefore = angular.element(inputs[0]);
                var inputAfter = angular.element(inputs[1]);
                var predicateName = attr.predicate;

            	inputBefore.datepicker({format: documentService.getCtxAmb()[0]}).on("changeDate", function (e) {
        			$(this).change();
        			$(this).datepicker('hide');
        			//scope.openBefore();
        		});

            	inputAfter.datepicker({format: documentService.getCtxAmb()[0]}).on("changeDate", function (e) {
        			$(this).change();
        			$(this).datepicker('hide');
        			//scope.openAfter();
        		});

                [inputBefore, inputAfter].forEach(function (input) {

                    input.bind('change', function () {


                        var query = {};

                        //if (!scope.isBeforeOpen && !scope.isAfterOpen) {

                            if (scope.before) {
                                query.before = scope.before;
                            }

                            if (scope.after) {
                                query.after = scope.after;
                            }

                            scope.$apply(function () {
                                table.search(query, predicateName);
                            });
                        //}
                    });
                });

                function open(before) {
                    return function () {
                        if (before) {
                            scope.isBeforeOpen = true;
                        } else {
                            scope.isAfterOpen = true;
                        }
                    };
                }

                scope.openBefore = open(true);
                scope.openAfter = open();
            }
        };
    }

    function CustomFilter($filter){
        var filterFilter = $filter('filter');

        var standardComparator = function standardComparator(obj, text) {

          text = ('' + text).toLowerCase();

          return ('' + obj).toLowerCase().indexOf(text) > -1;

        };


        return function customFilter(array, expression) {

          function customComparator(actual, expected) {


            var isBeforeActivated = expected.before;

            var isAfterActivated = expected.after;

            var isLower = expected.lower;

            var isHigher = expected.higher;

            var higherLimit;

            var lowerLimit;

            var itemDate;

            var queryDate;


            if (angular.isObject(expected)) {

              //exact match

              if (expected.distinct) {
                if (!actual || actual.toLowerCase() !== expected.distinct.toLowerCase()) {

                  return false;

                }


                return true;

              }


              //matchAny

              if (expected.matchAny) {
                if (expected.matchAny.all) {

                  return true;

                }


                if (!actual) {

                  return false;

                }


                for (var i = 0; i < expected.matchAny.items.length; i++) {

                  if (actual.toLowerCase() === expected.matchAny.items[i].toLowerCase()) {

                    return true;

                  }

                }


                return false;

              }


              //date range

              if (expected.before || expected.after) {
                try {

                  if (isBeforeActivated) {

                    higherLimit = expected.before;

    	        	var dt1   = parseInt(actual.substring(0,2));
    	        	var mon1  = parseInt(actual.substring(3,5));
    	        	var yr1   = parseInt(actual.substring(6,10));

    	        	var dt2   = parseInt(higherLimit.substring(0,2));
    	        	var mon2  = parseInt(higherLimit.substring(3,5));
    	        	var yr2   = parseInt(higherLimit.substring(6,10));

                    itemDate = new Date(yr1, mon1-1, dt1);//new Date(actual);

                    queryDate = new Date(yr2, mon2-1, dt2);//new Date(higherLimit);

                    if (itemDate > queryDate) {

                      return false;

                    }

                  }


                  if (isAfterActivated) {

                    lowerLimit = expected.after;

    	        	var dt1   = parseInt(actual.substring(0,2));
    	        	var mon1  = parseInt(actual.substring(3,5));
    	        	var yr1   = parseInt(actual.substring(6,10));

    	        	var dt2   = parseInt(lowerLimit.substring(0,2));
    	        	var mon2  = parseInt(lowerLimit.substring(3,5));
    	        	var yr2   = parseInt(lowerLimit.substring(6,10));

                    itemDate = new Date(yr1, mon1-1, dt1);//new Date(actual);

                    queryDate = new Date(yr2, mon2-1, dt2);//new Date(lowerLimit);

                    if (itemDate < queryDate) {

                      return false;

                    }

                  }


                  return true;

                } catch (e) {

                  return false;

                }


              } else if (isLower || isHigher) {
                //number range

                if (isLower) {

                  higherLimit = expected.lower;


                  if (actual > higherLimit) {

                    return false;

                  }

                }


                if (isHigher) {

                  lowerLimit = expected.higher;

                  if (actual < lowerLimit) {

                    return false;

                  }

                }


                return true;

              }

              //etc

              return true;


            }

            return standardComparator(actual, expected);

          }


          var output = filterFilter(array, expression, customComparator);

          return output;

        };
    }

})();
