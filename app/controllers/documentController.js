(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('stMatrizForm', MatrizForm)
        .directive('stDocumentForm', DocumentForm)
        .directive('onFinishRender', onFinishRender)
        .directive('updateFieldProcess', UpdateFieldProcess)
        .directive('timeConvert',timeConvert)
        .controller('DocumentController', DocumentController)
    	   .service('documentService', documentService);

    DocumentController.$inject = ['processEngine', '$stateParams', '$sce', '$scope', '$rootScope', '$modal', 'documentService', '$state', '$window', '$filter'];
    function DocumentController(processEngine, $stateParams, $sce, $scope, $rootScope, $modal, documentService, $state, $window, $filter) {
        var vm = this;
        //create doc
        vm.wfp = $stateParams.wfp;
        vm.wfh =  $stateParams.wfh;
        vm.frmn = $stateParams.frmn;
        vm.name = $stateParams.name;
        //open doc
        vm.nuDoc = ($stateParams.nuDoc!=null?$stateParams.nuDoc:0);//Default 0
        vm.nuInst = $stateParams.nuInst;
        vm.wfa = $stateParams.wfa;
        //from $state
        vm.fromState = $stateParams.fromState;
    };

    function onFinishRender($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.broadcasteventname ? attr.broadcasteventname : 'ngRepeatFinished');
                });
                }
            }
        };
    };

	function DocumentForm() {
        return {
            restrict: 'E',
            scope: {
              //for create
              wfp: '=',
              wfh: '=',
              frmn: '=',
              name: '=',
              //for open
              nuDoc: '=',
              nuInst: '=',
              wfa: '=',
              lectura: '=',
              hideDoc: '&',
              fromState: '='
            },
            templateUrl: 'app/views/templates/documentForm.html',
            controller: function (processEngine, $stateParams, $sce, $scope, $rootScope, $modal, documentService, $state, $window, $filter, ticketService, $compile, $timeout, $q, $locale, $interval, blockUI, blockUIConfig, inform) {
	            //event/agent
	            $scope.eventCampo = '';
	            $scope.eventFila = 0;
	            $scope.eventXml = '';
	            $scope.eventSelList = 0;
              $scope.eventSelListM = "";
	            $scope.eventCtx = '';
	            $scope.agentCodigo = '';
	            $scope.agentCtx = '';
	            $scope.eventResult = {};
	            $scope.agentMsg = [];
	            $scope.agentTipoMsg = false;
	            //listajax
	            $scope.listObjectsAjax = [];
	            $scope.selectedObjectAjax = {};
	            //Send form
	            $scope.sendObj = {};
	            $scope.optsSend = {
	            		sendComment: '',
	            		sendChkPriority : 0,
	            		sendCcMail : ''
	            };
	            $scope.sendAcc = '';
	            //Permisos
	            $scope.anular = false;
	            $scope.anexar = false;
	            $scope.desAnexar = false;
	            $scope.imprimir = false;
	            //others
	            $scope.frmnName = '';
	            $scope.docData = {};
	            $scope.nuDocUser = 0;
	            $scope.ticketService = ticketService;
	            $scope.listAnexos = [];
	            //$window.formatDate = angular.lowercase($rootScope.formatDate);
              $scope.listCamDepList = []; //campo donde se guardan las listas dependientes de columnas de matriz

              $scope.templateUrl = "comentarioId.html";

              $scope.templateUrlObj = "comentarioIdObj.html";

              $scope.changeForm = false;
	            var vm = $scope;

	            $scope.backState = function() {
	            	$state.go($rootScope.fromStateToDoc, { 'filter': $rootScope.fromParamFilter, 'wfp': $rootScope.fromParamWfp, 'wfh': $rootScope.fromParamWfh, 'name': $rootScope.fromParamName },{reload:$rootScope.fromStateToDoc});
	            };

	            $scope.getHtml = function(html) {
	            	return $sce.trustAsHtml(html);
	            };

              $scope.toTime = function(field){
                 let  hours = field.value.substr(0,2);
                 let minutes = field.value.substr(3,4);
                 let ampm = hours >= 12 ? 'PM' : 'AM';
                 hours = hours % 12;
                 hours = hours ? hours : 12; // the hour '0' should be '12'
                 minutes = parseInt(minutes) < 10 ? '0'+parseInt(minutes) : minutes;
                 field.value = hours + ':' + minutes + ' ' + ampm;

              }
	            $scope.openDocumentRead = function() {
                processEngine.getProfile()
                .then(function (data) {
                    $scope.perfilUser = data;
                    console.log('DECIMAL_SEP ',$locale.NUMBER_FORMATS.DECIMAL_SEP);
                    console.log('GROUP_SEP ', $locale.NUMBER_FORMATS.GROUP_SEP);
                    if($locale.NUMBER_FORMATS.DECIMAL_SEP != $scope.perfilUser.formatoDecimal){
                        $locale.NUMBER_FORMATS.DECIMAL_SEP = $scope.perfilUser.formatoDecimal;
                    }
                    if($locale.NUMBER_FORMATS.GROUP_SEP != $scope.perfilUser.formatoMiles){
                      $locale.NUMBER_FORMATS.GROUP_SEP = $scope.perfilUser.formatoMiles;
                    }
                  processEngine.openDocumentRead(vm)
                     .then(function (data) {
                     	if (data!=null){
                             data.lectura = (data.lectura=="true")
                             data.adquirible = (data.adquirible=="true")
                             data.recuperable = (data.recuperable=="true")
                             data.notificacion = (data.notificacion=="true")
                             data.espera = (data.espera=="true")
                             $scope.docData = data;
                             //$scope.frmn = $scope.docData.forms[0].frmn;
                             $scope.frmn = $scope.docData.FORMA.frmn;
                             $scope.frmnName = $scope.docData.FORMA.nombre;
                             $timeout(function () {
                               $scope.includeClientFiles();  //iniciar manejo cliente despues que haga diges angular
                            });
                            	documentService.closeRead();
                 		}
                   });
                });
            	   /* */
	            };


//	            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {//para guardar temporalmente los valores
//	            	 if ((fromState.name === "root.main.documentopen")||(fromState.name === "root.main.documentcreate")) {
//		            	 if ($scope.lectura=='N'){
//			 	             	if (!$scope.docData.lectura){
//			 	             		console.log("guardando doc temp....");
//			 	             		processEngine.saveFormDocument(vm);
//				             	}
//			            	 }
//	            	 }
//	            });

	            $scope.$watchGroup(['nuDoc', 'nuInst'], function(newValues, oldValues, scope) {
	            	if ((newValues[0] !== oldValues[0])||(newValues[1] !== oldValues[1])){
	            		$scope.initDocument();
	            	}
	            });

	            $scope.$on('ngRepeatBroadcast1', function(ngRepeatFinishedEvent) {
	            	setDates();
	            });

	            $scope.goOpenDocument = function(nuDoc,nuInst,wfa) {
	            	 if (documentService.isOpenDoc()){
	            		 var arrayDoc = documentService.getCtxOpenDoc();
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
		         	                   documentService.saveClose('')
		         	                   .then(function (data) {
		         	                	  $state.go('root.main.documentopen', { 'nuDoc': nuDoc, 'nuInst': nuInst, 'wfa': wfa },{reload:'root.main.documentopen'});
		         	                   });
		         	               }else{
		         	                   documentService.close()
		         	                   .then(function (data) {
		         	                	  $state.go('root.main.documentopen', { 'nuDoc': nuDoc, 'nuInst': nuInst, 'wfa': wfa },{reload:'root.main.documentopen'});
		         	                   });
		         	               }
		                       }, function() {
		                       });
	            		 }else{
	            			 documentService.close();
	            			 $state.go('root.main.documentopen', { 'nuDoc': nuDoc, 'nuInst': nuInst, 'wfa': wfa },{reload:'root.main.documentopen'});
	            		 }
	            	 }else{
	            		 $state.go('root.main.documentopen', { 'nuDoc': nuDoc, 'nuInst': nuInst, 'wfa': wfa },{reload:'root.main.documentopen'});
	            	 }
	            };

	            $scope.createDocument = function() {
            	     processEngine.createDocument(vm)
                     .then(function (data) {
                     	if (data!=null){
                            data.lectura = (data.lectura=="true")
                            data.adquirible = (data.adquirible=="true")
                            data.recuperable = (data.recuperable=="true")
                            data.notificacion = (data.notificacion=="true")
                            data.espera = (data.espera=="true")
                            $scope.docData = data;
                            //$scope.frmn = $scope.docData.forms[0].frmn;
                            $scope.frmn = $scope.docData.FORMA.frmn;
                            $scope.frmnName = $scope.docData.FORMA.nombre;
                        	  documentService.saveCtxOpenDoc(data.nu_doc,0,data.wfa,data.lectura,data.nb_conversacion);
                          	processEngine.getProfile()
                            .then(function (dataP) {
                            	if (dataP!=null){
                                $scope.perfilUser = dataP;
                                //$locale.NUMBER_FORMATS.DECIMAL_SEP = $scope.perfilUser.formatoDecimal;
                                //$locale.NUMBER_FORMATS.GROUP_SEP = $scope.perfilUser.formatoMiles;
                                if($locale.NUMBER_FORMATS.DECIMAL_SEP != $scope.perfilUser.formatoDecimal){
                                    $locale.NUMBER_FORMATS.DECIMAL_SEP = $scope.perfilUser.formatoDecimal;
//                                        console.log('asignado decimal', $scope.perfilUser.formatoDecimal)
                                }
                                if($locale.NUMBER_FORMATS.GROUP_SEP != $scope.perfilUser.formatoMiles){
                                  $locale.NUMBER_FORMATS.GROUP_SEP = $scope.perfilUser.formatoMiles;
//                                      console.log('asignado miles', $scope.perfilUser.formatoMiles)
                                }

                                	$scope.anular = dataP.anular;
                                  $scope.anexar = dataP.anexar;
                                  $scope.desAnexar = dataP.desanexar;
                                  $scope.imprimir = dataP.imprimir;
                                  $timeout(function () {
                                    $scope.includeClientFiles();  //iniciar manejo cliente despues que haga diges angular
                                 });
                               	}
                            });
                          	//al iniciar no hay anexos
                 		}
                     });
	            };

	            $scope.includeClientFiles = function() {
                //console.log($scope.docData);
                var Formatodec = $scope.perfilUser.formatoDecimal;
                $scope.nbAmbiente = $scope.perfilUser.ambiente;

                $scope.docData.fileClientGeneral = "include/"+$scope.nbAmbiente+"/"+$scope.docData.wfp+"/ManejoCliente-"+$scope.docData.wfp+".js";
                $scope.docData.fileClient = "include/"+$scope.nbAmbiente+"/"+$scope.docData.wfp+"/ManejoCliente-"+$scope.frmn+"-"+$scope.docData.wfa+"-"+$scope.docData.estado+".js";
	            	$(".clientFiles").html("");
                	var link = '<script "type="text/javascript"> var Formatodec = "'+Formatodec+'";</script>'+
                              '<script type="text/javascript" src="include/EventProcess.js"></script>'+
                              '<script type="text/javascript" src="include/Formulario.js"></script>'+
                              '<script type="text/javascript" src="include/GenericoMatrices.js"></script>'+
                              '<script type="text/javascript" src="include/GenericoFormulas.js"></script>'+
                              '<script type="text/javascript" src="include/C_ValidaForma.js"></script>';
                	if ($scope.docData.fileClientGeneral!=''){
                		link = link + ' <script src="' + $scope.docData.fileClientGeneral + '" type="text/javascript"></script>';
               		}
                	if ($scope.docData.fileClient!=''){
                	  link = link + '<script src="' + $scope.docData.fileClient + '" type="text/javascript"></script>';
                	}
        		    $(".clientFiles").append( $compile(link)($scope) );
	            };

	            $scope.openDocument = function() {
            	    processEngine.openDocument(vm)
                    .then(function (data) {
                    if (data!=null){
                            data.lectura = (data.lectura=="true")
                            data.adquirible = (data.adquirible=="true")
                            data.recuperable = (data.recuperable=="true")
                            data.notificacion = (data.notificacion=="true")
                            data.espera = (data.espera=="true")
                            $scope.docData = data;
                            //$scope.frmn = $scope.docData.forms[0].frmn;
                            $scope.frmn = $scope.docData.FORMA.frmn;
                            $scope.frmnName = $scope.docData.FORMA.nombre;
                            documentService.saveCtxOpenDoc(data.nu_doc,$scope.nuInst,vm.wfa,data.lectura,data.nb_conversacion);
     	                  	//buscar anexos
     	                   	processEngine.attachedDocument()
     	                    .then(function (data) {
     	                    	if (data!=null){
     	                    		$scope.listAnexos = data;
     	     	                   	processEngine.getProfile()
     	     	                    .then(function (dataP) {
     	     	                    	if (dataP!=null){
                                    $scope.perfilUser = dataP;
                                  //  $locale.NUMBER_FORMATS.DECIMAL_SEP = $scope.perfilUser.formatoDecimal;
                                  //  $locale.NUMBER_FORMATS.GROUP_SEP = $scope.perfilUser.formatoMiles;

//                                      console.log('DECIMAL_SEP ',$locale.NUMBER_FORMATS.DECIMAL_SEP);
//                                      console.log('GROUP_SEP ', $locale.NUMBER_FORMATS.GROUP_SEP);
                                      if($locale.NUMBER_FORMATS.DECIMAL_SEP != $scope.perfilUser.formatoDecimal){
                                          $locale.NUMBER_FORMATS.DECIMAL_SEP = $scope.perfilUser.formatoDecimal;
  //                                        console.log('asignado decimal', $scope.perfilUser.formatoDecimal)
                                      }
                                      if($locale.NUMBER_FORMATS.GROUP_SEP != $scope.perfilUser.formatoMiles){
                                        $locale.NUMBER_FORMATS.GROUP_SEP = $scope.perfilUser.formatoMiles;
  //                                      console.log('asignado miles', $scope.perfilUser.formatoMiles)
                                      }


     	     	                        	 $scope.anular = dataP.anular;
     	     	                            $scope.anexar = dataP.anexar;
     	     	                            $scope.desAnexar = dataP.desanexar;
     	     	                            $scope.imprimir = dataP.imprimir;
                                        $timeout(function () {
                                          $scope.includeClientFiles();  //iniciar manejo cliente despues que haga diges angular
                                       });
     	     	                    	}
     	     	                    });
     	                    	}
     	                    });
                		}
                    });
	            };

              $scope.stringToBoolean = function(string){
                let boolean = false;
                boolean = (string=="true")
                return boolean;
              }

              $scope.getVisible = function(campo){
                let opciones = campo.CAMPO;
                let visible = false;
                  for(let opt in opciones){
                    if(opciones[opt].lectura == 'true'){
                        visible = true;
                        break;
                    }
                  }
                  return visible;
              }

              $scope.getValue = function(campo){
                let opciones = campo.CAMPO;
                for(let opt in opciones){
                  if(opciones[opt].value == 'T'){
                    if(opciones[opt].exclusivo == "true"){
                      campo.value  = opciones[opt].nombre;
                      break;
                    }else{
                      opciones[opt].checked = true;
                    }
                  }
                }
              }

	            $scope.loadFormDocument = function(frmn) {
	                processEngine.saveFormDocument(vm)
	                .then(function (data) {
	                    $('.formularioContent').scrollTop(0);
	                    $scope.getDocument(frmn);
	                });
	            };

	            $scope.getDocument = function(frmn) {
	            	$scope.frmn = frmn;
	            	$scope.loadDoc = false;
            	    processEngine.getDocument(vm)
                    .then(function (data) {
                     	if (data!=null){
                          data.lectura = (data.lectura=="true")
                          data.adquirible = (data.adquirible=="true")
                          data.recuperable = (data.recuperable=="true")
                          data.notificacion = (data.notificacion=="true")
                          data.espera = (data.espera=="true")
                          $scope.docData = data;
                          //$scope.frmn = $scope.docData.forms[0].frmn;
                          $scope.frmn = $scope.docData.FORMA.frmn;
                          $scope.frmnName = $scope.docData.FORMA.nombre;
                          processEngine.attachedDocument()
                          .then(function (data) {
                              if (data!=null){
                                $scope.listAnexos = data;
                              }
                              processEngine.getProfile()
                              .then(function (dataP) {
                                if (dataP!=null){
                                  $scope.perfilUser = dataP;
                                //  $locale.NUMBER_FORMATS.DECIMAL_SEP = $scope.perfilUser.formatoDecimal;
                                //  $locale.NUMBER_FORMATS.GROUP_SEP = $scope.perfilUser.formatoMiles;
                                    $scope.anular = dataP.anular;
                                      $scope.anexar = dataP.anexar;
                                      $scope.desAnexar = dataP.desanexar;
                                      $scope.imprimir = dataP.imprimir;
                                      $timeout(function () {
                                        $scope.includeClientFiles();  //iniciar manejo cliente despues que haga diges angular
                                     });
                                }});
                            })

                    		}
                    });
	            };

	            $scope.setChangeValue = function(field) {
	            	field.change = true;
                $scope.setChangeForm(true);
	            };

              $scope.setChangeForm = function(f){
                $scope.changeForm = f;
              }

              $scope.setCheckValues = function(field) {
                if(field.checked == true){
                    field.value = 'T';
                }else if(field.checked == false){
                    field.value = 'F';
                }
              };

	            $scope.actionsDocument = function(sendAcc) {
                /*funcion para validar las funciones creadas en manejo cliente*/
                let flag = evaluar_event( event.type, event.target.id);
                if(!flag){
                  return false;
                }

	             	$scope.sendObj = {};
	             	$scope.sendAcc = sendAcc;
	             	if (sendAcc=='A'){//avanzar
	             		if (!$scope.docData.lectura){

                    if(!$('[name=\"documentForm\"]').valid()){
                  		alertmb('Debe llenar los campos obligatorios (<span style="color:red;font-weight: bold;">*</span>)',1,1,'Aceptar');
                  		return false;
                  	}
	                         processEngine.saveFormDocument(vm)
	                         .then(function (data) {
	                         	processEngine.destinationsDocument()
	                         	.then(function (data) {
	                         		if (data!=null){
	                         			//alert(JSON.stringify(data, null, 2));
	                         			if (data.msgObligatorios!=''){
	                         				var listMessage = ticketService.getMessageError();
	                         				listMessage.push(data.msgObligatorios);
	                         				ticketService.setMessageError(listMessage);
	                         				$('#'+data.focus).focus();
	                         			}else{
	                         				//open modal send
	                         				$scope.sendObj = data;
	                         				$scope.openSendModal();
	                         			}
	                         		}
	                             });
	                         });
	             		}else{
	                     	processEngine.destinationsDocument()
	                     	.then(function (data) {
	                     		if (data!=null){
	                     			//alert(JSON.stringify(data, null, 2));
	                     			if (data.msgObligatorios!=''){
	                     				var listMessage = ticketService.getMessageError();
	                     				listMessage.push(data.msgObligatorios);
	                     				ticketService.setMessageError(listMessage);
	                     				$('#'+data.focus).focus();
	                     			}else{
	                     				//open modal send
	                     				$scope.sendObj = data;
	                     				$scope.openSendModal();
	                     			}
	                     		}
	                         });
	             		}
	             	}else if (sendAcc=='R'){//rechazar
	             		if (!$scope.docData.lectura){
	                         processEngine.saveFormDocument(vm)
	                         .then(function (data) {
	                         	processEngine.objectDocument($scope.optsSend.sendComment,$scope.optsSend.sendChkPriority,true,$scope.optsSend.sendCcMail,0)
	                             .then(function (data) {
	                         		if (data!=null){
	                         			//alert(JSON.stringify(data, null, 2));
	                         			if (data.msgObligatorios!=''){
	                         				var listMessage = ticketService.getMessageError();
	                         				listMessage.push(data.msgObligatorios);
	                         				ticketService.setMessageError(listMessage);
	                         				$('#'+data.focus).focus();
	                         			}else{
	                         				//open modal send
	                         				$scope.sendObj = data;
	                         				$scope.openSendModal();
	                         			}
	                         		}
	                             });
	                         });
	             		}else{
	             			processEngine.objectDocument($scope.optsSend.sendComment,$scope.optsSend.sendChkPriority,true,$scope.optsSend.sendCcMail,0)
	                         .then(function (data) {
	                     		if (data!=null){
	                     			//alert(JSON.stringify(data, null, 2));
	                     			if (data.msgObligatorios!=''){
	                     				var listMessage = ticketService.getMessageError();
	                     				listMessage.push(data.msgObligatorios);
	                     				ticketService.setMessageError(listMessage);
	                     				$('#'+data.focus).focus();
	                     			}else{
	                     				//open modal send
	                     				$scope.sendObj = data;
	                     				$scope.openSendModal();
	                     			}
	                     		}
	                         });
	             		}
	             	}else if (sendAcc=='C'){//anular
	             		if (!$scope.docData.lectura){
	                         processEngine.saveFormDocument(vm)
	                         .then(function (data) {
	                         	processEngine.cancelDocument($scope.optsSend.sendComment,true)
	                             .then(function (data) {
	                         		if (data!=null){
	                         			//alert(JSON.stringify(data, null, 2));
	                         			if (data.msgObligatorios!=''){
	                         				var listMessage = ticketService.getMessageError();
	                         				listMessage.push(data.msgObligatorios);
	                         				ticketService.setMessageError(listMessage);
	                         				$('#'+data.focus).focus();
	                         			}else{
	                         				//open modal send
	                         				$scope.sendObj = data;
	                         				$scope.openSendModal();
	                         			}
	                         		}
	                             });
	                         });
	             		}else{
	             			processEngine.cancelDocument($scope.optsSend.sendComment,true)
	                         .then(function (data) {
	                     		if (data!=null){
	                     			//alert(JSON.stringify(data, null, 2));
	                     			if (data.msgObligatorios!=''){
	                     				var listMessage = ticketService.getMessageError();
	                     				listMessage.push(data.msgObligatorios);
	                     				ticketService.setMessageError(listMessage);
	                     				$('#'+data.focus).focus();
	                     			}else{
	                     				//open modal send
	                     				$scope.sendObj = data;
	                     				$scope.openSendModal();
	                     			}
	                     		}
	                         });
	             		}
	             	}else if (sendAcc=='V'){//adquirir
	         			processEngine.acquireDocument($scope.optsSend.sendComment,true)
	                     .then(function (data) {
	                 		if (data!=null){
	                 			//alert(JSON.stringify(data, null, 2));
	                 			if (data.msgObligatorios!=''){
	                 				var listMessage = ticketService.getMessageError();
	                 				listMessage.push(data.msgObligatorios);
	                 				ticketService.setMessageError(listMessage);
	                 				$('#'+data.focus).focus();
	                 			}else{
	                 				//open modal send
	                 				$scope.sendObj = data;
	                 				$scope.nuInst = data.destinos[0].puestos[0].nuInstn;
	                 				$scope.openSendModal();
	                 			}
	                 		}
	                     });
	             	}else if (sendAcc=='O'){//recuperar
	         			processEngine.recoverDocument()
	                     .then(function (data) {
	                 		if (data!=null){
	             				//open modal send
	             				$scope.sendObj = data;
	             				$scope.openSendModal();
	                 		}
	                     });
	             	}
	            };

	            $scope.saveform = function(sendAcc) {
	                 processEngine.saveFormDocument(vm)
	                 .then(function (data) {
	                 });
	            };

              $scope.consoleVm = function(){
                  console.log(vm.docData.forms[0]);
                  return vm.docData.forms[0] // funcion para cargar datos del objeto pasado al motor.
              }

	            $scope.saveDocument = function(sendAcc) {
	             	processEngine.saveFormDocument(vm)
	                 .then(function (data) {
	                     processEngine.saveDocument($scope.optsSend.sendComment)
	                     .then(function (data) {
                         $scope.getDocument(vm.docData.FORMA.frmn);
	                     });
	                 });
	            };

	            $scope.ejecEventAgent = function(campo,fila, opcionesmultiples) {
                //console.log(opcionesmultiples)
                if(event != undefined){
                  let flag = evaluar_event( event.type, event.target.id);
                  if(!flag){
                    return false;
                  }
                }

	             	//saveform TODO
	             	processEngine.saveFormDocument(vm)
	                 .then(function (data) {
	                     $scope.eventResult = {};
	                     $scope.eventCampo = campo;
	                     $scope.eventFila = fila;
                       $scope.eventOpcionesM = opcionesmultiples;
	                     $scope.eventCtx = '';
	                     $scope.agentMsg = [];
	                     $scope.agentTipoMsg = false;
	                     processEngine.ejecEventAgent(vm)
	                     .then(function (data) {
	                     	if (data!=null){
	                     		$scope.eventResult = data;
	                     		$scope.eventXml = data.xmlData;
	                     		//console.log(JSON.stringify(data, null, 2));
	                     		if (data.filas.length>0){
	                     			//openmodal agent
	                     			$scope.openAgentModal();
	                     		}else{
	                     			if (data.xmlData!='' && data.xmlData!=null){
		                     			if (data.messages.length==0){
		                     				data.messages.push($filter('translate')(ticketService.getDescriptionError('70070')));
		                     			}
	                     			}else if(!data.msgError) {
	                     				$scope.getDocument($scope.frmn);
	                     			}
	                     		}
	                     		$scope.agentMsg = data.messages;
	                     		$scope.agentTipoMsg = data.msgError;
	                     	}
	                     });
	                 });
	            };

	            $scope.ejecAgent = function(codigo,ctx) {
	             	//saveform TODO
	             	processEngine.saveFormDocument(vm)
	                 .then(function (data) {
	                     $scope.eventResult = {};
	                     $scope.agentCodigo = '';
	                     $scope.agentCtx = '';
	                     $scope.agentMsg = [];
	                     $scope.agentTipoMsg = false;
	                     processEngine.ejecAgent(vm)
	                     .then(function (data) {
	                     	if (data!=null){
	                     		$scope.eventResult = data;
	                     		$scope.eventXml = data.xmlData;
	                     		//console.log(JSON.stringify(data, null, 2));
	                     		if (data.filas.length>0){
	                     			//TODO validar si es posible abrir lista de valores aqui?????
	                     			//openAgentModal();
	                     		}else{
	                     			if (data.xmlData!='' && data.xmlData!=null){
		                     			if (data.messages.length==0){
		                     				data.messages.push($filter('translate')(ticketService.getDescriptionError('70070')));
		                     			}
	                     			}else{
	                     				$scope.getDocument($scope.frmn);
	                     			}
	                     		}
	                     		$scope.agentMsg = data.messages;
	                     		$scope.agentTipoMsg = data.msgError;
	                     	}
	                     });
	                 });
	            };

	            $scope.eventAjaxChanged = function (id,identField,fila) {
	            	if (identField){
	            		var idFieldObj = identField;
	            	}else{
	            		var idFieldObj = this.$parent.$$childHead.id;
	            	}
	            	if (fila){
	            		var idField = 'M' + fila + idFieldObj.substring(0,idFieldObj.indexOf("_Ajax"));
	            	}else{
	            		var idField = idFieldObj.substring(0,idFieldObj.indexOf("_Ajax"));
	            	}
    				  	var optionObj = $("#" + idField);
    				    $timeout(function () {
    				    	optionObj.val(id).trigger('change');
    				    });
	    	    };

	    	    $scope.selectedAjax = function(selected) {
	    	        if (selected) {
                 	  //resolver lista de valores
                 	  $scope.eventSelList = selected.originalObject.numeroFila;
                       processEngine.resolveListEventAgent(vm)
                       .then(function (data) {
                       	if (data!=null){
                       		$scope.getDocument($scope.frmn);
                       	}
                       });
	    	        }
	    	    };

	            $scope.searchEventAjax = function(userInputString, timeoutPromise, identField, fila) {
                    $scope.eventResult = {};
    	            	if (identField){
    	            		var idFieldObj = identField;
    	            	}else{
    	            		var idFieldObj = this.$parent.$$childHead.id;
    	            	}
    	            	var idField = idFieldObj.substring(0,idFieldObj.indexOf("_Ajax"));
                        $scope.eventCampo = idField;
    	            	if (fila){
    	            		$scope.eventFila = fila;
    	            	}else{
    	            		$scope.eventFila = $("#" + this.$parent.$$childHead.id).attr('fila');
    	            	}
                    $scope.eventCtx = '';
                    $scope.agentMsg = [];
                    $scope.agentTipoMsg = false;

                    //blockUIConfig.autoBlock  = false;//deshabilita el bloquedo de la pantalla.
                    return processEngine.saveFormDocument(vm).then(function (data) {
                    	return processEngine.ejecEventAgent(vm);
                    }).then(function (data) {
                    	if (data!=null){
                    		$scope.eventResult = data;
                    		$scope.eventXml = data.xmlData;
                    		$scope.agentMsg = data.messages;
                    		$scope.agentTipoMsg = data.msgError;
        				    var camposBuscar = {
        							"data" : []
        						};
                        	for(var i in data.filas) {
                        	    var item = data.filas[i];
                  						camposBuscar.data.push({
                  							"valor" : item.valores[1],
                  							"titulo"  : item.valores[2],
                  							"descripcion"       : item.valores[3],
                  							"numeroFila"       : item.numero
                  						});
                        	}
                      //  blockUIConfig.autoBlock  = true;//habilita el bloquedo de la pantalla.
                    		return camposBuscar;

                    	}
                    });
	            };
              $scope.generarArchivoPDF = function(agent){
                let flag = evaluar_event( event.type, event.target.id);
                if(!flag){
                  return false;
                }
                let url = agent.href;
                let interpretar = url.match(/\{([^{}]*[^{}]*)\}/g)
                if(interpretar!= null && interpretar.length > 0){
                    angular.forEach(interpretar,function(k,v){
                        let valor = k.replace('{','').replace('}','')
                        url = url.replace(k,obtener_valor(valor))
                    });
                }
                url = url.replace('ireport?', '');
                let variables = url.split('&');
                var gArch = {'pAnexar':1,'pDelimitador':'', 'pConsulta':'', 'pCampoInd':''};
                angular.forEach(variables,function(k,v){
                  //
                    let valor = {};//k.split("=")
                    valor[0] = k.substr(0,k.indexOf('='));
                    valor[1] = k.substr(k.indexOf('=')+1);
                    gArch.pConsultabool = 0;
                    if(valor[0]=='A'){ gArch.pathArch = valor[1]+'\\';}
                    if(valor[0]=='B'){ gArch.pNombreArch = valor[1];}
                    if(valor[0]=='C'){ gArch.pCampoInd = valor[1];}
                    if(valor[0]=='D'){ gArch.pDescripcion = valor[1];}
                    if(valor[0]=='N'){ gArch.pDelimitador = valor[1];}
                    if(valor[0]=='F'){ gArch.pAnexar = valor[1]=='S'?1:0;}
                    if(valor[0]=='Consultastr'){gArch.pConsulta = valor[1];}
                    if(valor[0] == 'Consultabool'){gArch.pConsultabool = valor[1]=='S'?1:0;}
                    if(valor[0]=='M'){ gArch.pExtArch = valor[1];}
                    //pConsulta
                });
                vm.gArch = gArch;
                processEngine.saveFormDocument(vm).then(function (data){
                    processEngine.postGenerarFilePDF(vm).then(function(data){
                      if(data!='' && data != null){
                        //console.log($rootScope.iRepAnexos);
                        let a = data.split("/");
                        let b = "";
                        if(a.length > 0){
                          b = a[a.length -1] //obtengo siempre el ultimo registro del arreglo
                        }else{
                          b = data;
                        }
                        let link = $rootScope.iRepAnexos+'/'+b;
                        $window.open(link, '_blank');
                        processEngine.attachedDocument()
                           .then(function (data) {
                            if (data!=null){
                              $scope.listAnexos = data;
                              $scope.changeAnexos = true;
                              $scope.getDocument(vm.frmn);
                            }
                           });
                      }
                    });
                });

              }

            $scope.generarArchivo= function(agent){
              //  console.log(event.type);
                let flag = evaluar_event( event.type, event.target.id);
                if(!flag){
                  return false;
                }

                let url = agent.href;
                let interpretar = url.match(/\{([^{}]*[^{}]*)\}/g)
                if(interpretar!= null && interpretar.length > 0){
                    angular.forEach(interpretar,function(k,v){
                        let valor = k.replace('{','').replace('}','')
                        url = url.replace(k,obtener_valor(valor))
                    });
                }


                url = url.replace('OfficeWeb.asp?', '');
                let variables = url.split('&');
                var gArch = {'pAnexar':1,'pDelimitador':'', 'pConsulta':'', 'pCampoInd':''};
                angular.forEach(variables,function(k,v){
                  //
                    let valor = {};//k.split("=")
                    valor[0] = k.substr(0,k.indexOf('='));
                    valor[1] = k.substr(k.indexOf('=')+1);

                    if(valor[0]=='A'){ gArch.pathArch = valor[1]+'\\';}
                    if(valor[0]=='B'){ gArch.pNombreArch = valor[1];}
                    if(valor[0]=='C'){ gArch.pCampoInd = valor[1];}
                    if(valor[0]=='D'){ gArch.pDescripcion = valor[1];}
                    if(valor[0]=='N'){ gArch.pDelimitador = valor[1];}
                    if(valor[0]=='F'){ gArch.pAnexar = valor[1]=='S'?1:0;}
                    if(valor[0]=='Consultastr'){ gArch.pConsulta = valor[1];}
                    if(valor[0]=='M'){ gArch.pExtArch = valor[1];}
                    //pConsulta
                });
                vm.gArch = gArch;
                processEngine.saveFormDocument(vm).then(function (data){
                    processEngine.postGenerarFile(vm).then(function(data){
                        console.log(data);
                        if(data!='' && data != null){
                          //console.log($rootScope.iRepAnexos);
                          let link = $rootScope.iRepAnexos+'/'+data;
                          $window.open(link, '_blank');
                          processEngine.attachedDocument()
                             .then(function (data) {
                              if (data!=null){
                                $scope.listAnexos = data;
                                $scope.changeAnexos = true;
                                $scope.getDocument(vm.frmn);
                              }
                             });
                        }
                      //$window.open('/anexos/prueba.html', '_blank');
                    });
                });

              };
              $scope.impresionFormulario= function (){
                let gArch = {}
                gArch.pathArch = $rootScope.repAgentes+"\\";
                gArch.pNombreArch = vm.frmn+"F";
                gArch.pCampoInd = "";
                gArch.pDescripcion = "imprimir";
                gArch.pDelimitador = "";
                gArch.pAnexar = 0;
                gArch.pConsulta = "";
                gArch.pExtArch = ".xls";
                vm.gArch = gArch;
                processEngine.saveFormDocument(vm).then(function (data){
                    processEngine.postGenerarFile(vm).then(function(data){
                      if(data != '' && data != null){
                        let link = $rootScope.iRepAnexos+'/'+data;
                        $window.open(link, '_blank');
                      }
                    });
                });

              };
	            $scope.concatFieldList = function(list) {
	             	var keyVoid = false;
	             	for(var opt in list) {
	             		if (opt.codigo==""){
	             			keyVoid = true;
	             			break;
	             		}
	             	}
	             	if (keyVoid){
	             		 return list.map(function(elem){
	                          return elem.value;
	                      }).join("|");
	             	}else{
	             		 return list.map(function(elem){
	                          return elem.codigo;
	                      }).join("|");
	             	}
	            };

             $scope.valorSelectMultiple = function(campo){
               let opcion = campo.OPCIONES.OPCION;
               let r = [];
                  for(let opt in opcion){
                    if(opcion[opt].seleccionado == "true"){
                        r.push(opcion[opt]);
                        /*if(opcion[opt].codigo != "" && opcion[opt].codigo != null){
                          r.push(opcion[opt].codigo);
                        }else{
                          r.push(opcion[opt].value);
                        }*/
                      }
                  }
                campo.valueM = r;
              };

	            $scope.openLink = function(link) {
                 $window.open(link, '_blank');
	            };

	            $scope.openInstModal = function(link) {
	             	if (!$scope.docData.lectura){
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
	         	                   documentService.saveClose($scope.optsSend.sendComment)
	         	                   .then(function (data) {
	         	                	  $scope.backState();
	         	                	  //$state.go('root.main',{},{reload:'root.main'});
	         	                   });
	         	               }else{
	         	                   documentService.close()
	         	                   .then(function (data) {
	         	                	  $scope.backState();
	         	                	  //$state.go('root.main',{},{reload:'root.main'});
	         	                   });
	         	               }
	                       }, function() {
	                       });
	             	}else{
	             		documentService.close()
	                     .then(function (data) {
	                    	 $scope.backState();
	                    	 //$state.go('root.main',{},{reload:'root.main'});
	                     });
	             	}
	            };

	            $scope.openAgentModal = function() {

	                 var modalInstance = $modal.open({
	                     templateUrl: 'app/views/templates/modalAgentDocument.html',
	                     keyboard: false,
	                     backdrop: 'static',
	                     windowClass: 'modal-fit',
	                     controller: ModalAgentController,
	                     resolve: {
	                         items: function () {
	                             return $scope.eventResult;
	                           },
                          opcionesmultiples: function(){
                              return $scope.eventOpcionesM;
                          }
	                     }
	                   });

	                   modalInstance.result.then(function(selection) {
	                 	  //resolver lista de valores
                      if(typeof(selection) == "string"){
                        $scope.eventSelListM = selection;
                      }else{
                        $scope.eventSelListM = "";
                      }
                      if(typeof(selection) == "number"){
                          $scope.eventSelList = selection;
                      }else{
                        $scope.eventSelList = 0;
                      }


	                       processEngine.resolveListEventAgent(vm)
	                       .then(function (data) {
	                       	if (data!=null){
	                       		//alert(JSON.stringify(data, null, 2));
	                       		$scope.getDocument($scope.frmn);
	                       	}
	                       });
	                   }, function() {
	                   });
	            };

	            $scope.openAnexoModal = function() {
                console.log($rootScope);
	                 var modalInstance = $modal.open({
	                     templateUrl: 'app/views/templates/modalUploadDocument.html',
                       cache: false,
	                     keyboard: false,
	                     backdrop: 'static',
	                     controller: ModalUploadController,
	                     resolve: {
	                     	 anexar: function () {
	                             return $scope.anexar;
	                           },
	                         desAnexar: function () {
	                             return $scope.desAnexar;
	                           },
	                         listAnexos: function () {
	                             return $scope.listAnexos;
	                           },
                             tamanoAnexo: function(){
                               return $rootScope.tamanoAnexo;
                             }
	                     }
	                   });

	                   modalInstance.result.then(function() {
	                 	  //documentService.save($scope.optsSend.sendComment)
	                       //.then(function (data) {
                    processEngine.saveFormDocument(vm).then(function (data){
		                       	processEngine.attachedDocument()
		                        .then(function (data) {
		                        	if (data!=null){
		                        		$scope.listAnexos = data;
                                processEngine.saveDocument($scope.optsSend.sendComment)
                                .then(function (data) {
                                  	$scope.getDocument($scope.frmn);//para actualizar luego de anexar
                                });
		                        	}
		                        });
	                       });
	                   }, function(listAnexos) {
	                	   $scope.listAnexos = listAnexos;
	                   });
	            };

              $scope.openAnexoConsultoriaModal = function(matriz, sec, sufijo, dirvir, dirfis,colruta, colver){
                var modalInstance = $modal.open({
                    templateUrl: 'app/views/templates/modalUploadConsultoria.html',
                    keyboard: false,
                    backdrop: 'static',
                    cache: false,
                    controller: ModalUploadAnexoConsultoria,
                    resolve: {
                      nudoc: function () {
                            return $scope.docData.nu_doc;
                          },
                      sufijo: function () {
                            return sufijo;
                          },
                      dirvir: function () {
                            return dirvir;
                          },
                      dirfis: function () {
                            return dirfis;
                          },
                      sec: function () {
                            return sec;
                          },
                      colruta: function(){
                          return colruta;
                      },
                      matriz: function(){
                        return matriz;
                      },
                      colver: function(){
                        return colver;
                      },
                      tamanoAnexo: function(){
                        return $rootScope.tamanoAnexo;
                      }
                    }
                  });

                  modalInstance.result.then( function() {
                      console.log('exit')
                 });
              }

	            $scope.openSendModal = function() {
	                 var modalInstance = $modal.open({
	                     templateUrl: 'app/views/templates/modalSendDocument.html',
	                     keyboard: false,
	                     backdrop: 'static',
	                     //windowClass: 'modal-fit',
	                     controller: ModalSendController,
	                     resolve: {
	                     	 sendObj: function () {
	                             return $scope.sendObj;
	                           },
	                         sendAcc: function () {
	                             return $scope.sendAcc;
	                           },
	                         sendChkPriority: function () {
	                             return $scope.optsSend.sendChkPriority;
	                           },
	                         sendComment: function () {
	                             return $scope.optsSend.sendComment;
	                           },
	                         sendCcMail: function () {
	                             return $scope.optsSend.sendCcMail;
	                           }
	                     }
	                   });

	                   modalInstance.result.then(function(selection) {
	                   }, function() {
//		                   //TODO si es adquirir leer el doc nuevamente.
//	                	   vm.wfa = 0;
//	                	   if ($scope.sendAcc=='V'){
//         	                   documentService.close()
//         	                   .then(function (data) {
//         	                	  $scope.initDocument();
//         	                   });
//	                	   }
	                   });
	            };
              $scope.ocultarGrupoAng = function(nGrupo){
                let grupos = $scope.docData.FORMA.GRUPO_CAMPOS;

                for(var i in grupos){
                    if(grupos[i].nombre == nGrupo){
                        grupos[i].visible=false;
                    }
                }
                $timeout(function () {
                  $scope.$apply();
                }, 10);
                //$scope.$apply(); //metodo para actualizar angular context
              };

              $scope.mostrarGrupoAng = function(nGrupo){
                let grupos = $scope.docData.FORMA.GRUPO_CAMPOS;

                for(var i in grupos){
                    if(grupos[i].nombre == nGrupo){
                        grupos[i].visible=true;
                    }
                }
                $timeout(function () {
                  $scope.$apply();
                }, 10);
                //$scope.$apply(); //metodo para actualizar angular context
              };

              $scope.ocultarCampoAng = function(campo,op,col){
                let cantGrupos = $scope.docData.FORMA.GRUPO_CAMPOS;
                var campoO = null;
                switch(op){
                  case 0://campo de process, se oculta toda la linea.
                    for(var x in cantGrupos){
                      for(var y in cantGrupos[x].CAMPO){
                          if(cantGrupos[x].CAMPO[y].nombre == campo){
                                cantGrupos[x].CAMPO[y].ocultarCliente = true;
                                campoO = true;
                              break;
                          }
                      }
                      if(campoO){
                        break;
                      }
                    }
                  break;
                  case 3: ////oculta una columna de una matriz
                    for(var x in cantGrupos){
                      for(var y in cantGrupos[x].CAMPO){
                          if(cantGrupos[x].CAMPO[y].nombre == campo){
                              //console.log(cantGrupos[x].CAMPO[y]);
                              if(col == 0){
                                cantGrupos[x].CAMPO[y].escritura = false;
                                campoO = true;
                                break;
                              }
                              for(var z in cantGrupos[x].CAMPO[y].CAMPO){
                                if(cantGrupos[x].CAMPO[y].CAMPO[z].nombre == campo+col){
                                    cantGrupos[x].CAMPO[y].CAMPO[z].ocultarCliente = true;
                                    campoO = true;
                                    break;
                                }
                              }
                          }
                          if(campoO){
                            break;
                          }
                      }
                      if(campoO){
                        break;
                      }
                    }
                    break;
                }
                $timeout(function () {
                  $scope.$apply();
                }, 10);
              };

              $scope.mostrarCampoAng = function(campo,op,col){
                let cantGrupos = $scope.docData.FORMA.GRUPO_CAMPOS;
                var campoO = null;
                switch(op){
                  case 0://campo de process, se muestra toda la linea.
                    for(var x in cantGrupos){
                      for(var y in cantGrupos[x].CAMPO){
                          if(cantGrupos[x].CAMPO[y].nombre == campo){
                                cantGrupos[x].CAMPO[y].ocultarCliente = false;
                                campoO = true;
                              break;
                          }
                      }
                      if(campoO){
                        break;
                      }
                    }
                  break;
                  case 3: ////MostrarCampo una columna de una matriz
                    for(var x in cantGrupos){
                      for(var y in cantGrupos[x].CAMPO){
                          if(cantGrupos[x].CAMPO[y].nombre == campo){
                            if(col == 0){
                              cantGrupos[x].CAMPO[y].escritura = true;
                              campoO = true;
                              break;
                            }
                              for(var z in cantGrupos[x].CAMPO[y].CAMPO){
                                if(cantGrupos[x].CAMPO[y].CAMPO[z].nombre == campo+col){
                                    cantGrupos[x].CAMPO[y].CAMPO[z].ocultarCliente = false;
                                    campoO = true;
                                    break;
                                }
                              }
                          }
                          if(campoO){
                            break;
                          }
                      }
                      if(campoO){
                        break
                      }
                    }

                    break;
                }
                $timeout(function () {
                  $scope.$apply();
                }, 10);
              };


             $scope.validarRangoNumero = function(campo){
                let minimo = parseFloat(campo.minimo);
                let maximo = parseFloat(campo.maximo);
                //let minimo = parseFloat($scope.depurar(campo.minimo,$locale.NUMBER_FORMATS.DECIMAL_SEP, 0));
                //let maximo = parseFloat($scope.depurar(campo.maximo,$locale.NUMBER_FORMATS.DECIMAL_SEP, 0));
                let f = $scope.esNumero(campo);

                /*Validar Rango colocado en el diseñador*/
                if(f ==true){
                  let valor = parseFloat($scope.depurar(campo.value,$locale.NUMBER_FORMATS.DECIMAL_SEP, 1));
                  if (minimo<=maximo){
        					     if (valor<minimo||valor>maximo){
                       alertmb("El valor ingresado no se encuentra dentro del rango, minimo ("+campo.minimo+") maximo ("+campo.maximo+")",1,1,"Aceptar");
                       campo.value = 0;
                      }
          			  }else{
                   alertmb("error en rango",1,1,"Aceptar");
                 }
               }else{
                 alertmb("Ingrese un numero valido",1,1,"Aceptar");
                 campo.value = 0;
               }
             }

             $scope.esNumero = function(campo){
               if(isNaN($scope.depurar(campo.value,$locale.NUMBER_FORMATS.DECIMAL_SEP, 1))) return 0;
               if(campo.value != null){
                  campo.value = $scope.formatoNumero(campo.value,campo.decimales);
               }
               return true;
             }
             $scope.depurar = function(pe_valor, pe_sepdec, ope){
                let valor = pe_valor;
                if (valor!="")
                {
                 if (pe_sepdec == ",")
               { while (valor.indexOf(".")>=0)
                  { valor = valor.replace(".","");
                  }
                if(ope == 1){ valor = valor.replace(",",".")};
                }
                 else if (pe_sepdec== ".")
                {
                 while (valor.indexOf(",")>=0)
                 {
                  valor = valor.replace(",","");
                 }
                }
                }
                else
                 valor = "0";

                return(valor)
             }

             $scope.formatoNumero = function(valor, cant_decimal){
               let pe_sepdec = $locale.NUMBER_FORMATS.DECIMAL_SEP;
               let pe_valor = $scope.depurar(valor,pe_sepdec,0);
               pe_valor = pe_valor.toString();
               //Separo primero el numero dado el separador decimal
               let posDec = pe_valor.indexOf(pe_sepdec);
               if (posDec>=0)
                {
                  var longiDecimales = pe_valor.length - posDec - 1;
                  pe_valor = "" + (Math.round(parseFloat($scope.depurar(pe_valor,pe_sepdec,1)) * Math.pow(10, parseInt(cant_decimal)))/Math.pow(10, parseInt(cant_decimal)));
                  posDec = pe_valor.indexOf(".");
                  if (posDec>=0){
                    var parteMiles = pe_valor.substring(0,posDec);
                    longiDecimales = pe_valor.length - posDec - 1;
                    if (cant_decimal!=0){
                      if (longiDecimales<cant_decimal){
                    var parteDecimal = pe_sepdec + pe_valor.substring(posDec+1,posDec+1+longiDecimales);
                    for(let j=1;j<=cant_decimal-longiDecimales;j++){
                        parteDecimal = parteDecimal + "0";
                    }
                      }else{
                    var parteDecimal = pe_sepdec + pe_valor.substring(posDec+1,posDec+1+cant_decimal);
                      }
                    }else{
                  var parteDecimal = "";
                    }
                  }else{
                var parteMiles = pe_valor;
                var parteDecimal = "";
                if (cant_decimal!=0)  parteDecimal = pe_sepdec;
                for(let i=1;i<=cant_decimal;i++){
                  parteDecimal = parteDecimal + "0";
                }
                  }
                }
                else
                { var parteMiles = pe_valor;
                  var parteDecimal = "";
                  if (cant_decimal!=0)  parteDecimal = pe_sepdec;
                  for(let i=1;i<=cant_decimal;i++){
                parteDecimal = parteDecimal + "0";
                  }
                }
                let pe_sepmil;
                if (pe_sepdec==".")
                   pe_sepmil =",";
                else
                  pe_sepmil = ".";
                let lon = parteMiles.length;
                while (lon>3)
                { parteMiles = parteMiles.substring(0,lon-3)+pe_sepmil+parteMiles.substring(lon-3);
                  lon = lon-3;
                }
                pe_valor = parteMiles+parteDecimal;
                return(pe_valor);
             }

            $scope.cambioInpu = function(campo,tipo,col){
              /*
              function para cambiar tipo de campo en angular

              Private Const cTIPO_TEXTO = "T"
              Private Const cTIPO_NUMERO = "N"
              Private Const cTIPO_LISTA = "L"
              Private Const cTIPO_FORMATEADO = "P"
              Private Const cTIPO_FECHA = "F"
              Private Const cTIPO_GRAFICO = "G"
              Private Const cTIPO_MULTILINEA = "Q"
              Private Const cTIPO_CANTIDAD = "C"
              Private Const cTIPO_PADRE_ALT = "S"
              Private Const cTIPO_PADRE_ALT_EXC = "E"
              Private Const cTIPO_PADRE_ALT_INC = "I"
              Private Const cTIPO_HIJO_ALT = "A"
              Private Const cTIPO_CALCULADO = "O"
              Private Const cTIPO_HORA = "H"
              Private Const cTIPO_MATRIZ = "M"
              Private Const cTIPO_COLUMNA_LISTA = "A"
              */

                let cantGrupos = $scope.docData.FORMA.GRUPO_CAMPOS;
                var campoO = null;
                if(!col){
                  for(var x in cantGrupos){
                    for(var y in cantGrupos[x].CAMPO){
                        if(cantGrupos[x].CAMPO[y].nombre == campo){
                              cantGrupos[x].CAMPO[y].tipo = tipo;
                              campoO = true;
                            break;
                        }
                    }
                    if(campoO){
                      break;
                    }
                  }
                }else{
                  for(var x in cantGrupos){
                    for(var y in cantGrupos[x].CAMPO){
                        if(cantGrupos[x].CAMPO[y].nombre == campo){
                            for(var z in cantGrupos[x].CAMPO[y].CAMPO){
                              if(cantGrupos[x].CAMPO[y].CAMPO[z].nombre == campo+col){
                                  if(tipo == 'A'){
                                      cantGrupos[x].CAMPO[y].CAMPO[z].OPCIONES = []
                                      cantGrupos[x].CAMPO[y].CAMPO[z].OPCIONES.OPCION = [];
                                  }
                                  cantGrupos[x].CAMPO[y].CAMPO[z].tipo = tipo;
                                  campoO = true;
                                  break;
                              }
                            }
                        }
                        if(campoO){
                          break;
                        }
                    }
                    if(campoO){
                      break
                    }
                  }
                }
                $timeout(function () {
                  $scope.$apply();
                }, 10);
              }

              $scope.autoGuardar = function(){
              //  blockUI.start();
                $interval(function(){
                      if($scope.changeForm){
                      //  console.log(blockUIConfig)
                        blockUIConfig.autoBlock  = false;//deshabilita el bloquedo de la pantalla.
                        processEngine.saveFormDocument(vm)
                         .then(function (data, status) {
                           console.log("saveForm", status)
                             processEngine.saveDocument($scope.optsSend.sendComment)
                             .then(function (data) {
                               $scope.changeForm = false;
                               blockUIConfig.autoBlock  = true;
                               inform.add("AutoGuardado",{ttl:5000, type:'primary'});
                             });
                         })
                      }
                    },parseFloat($rootScope.timeSave));
              }
              if($rootScope.timeSave){
                $scope.autoGuardar()
              }

              /*funcion para obtener valor desde contexto de angular campos*/
            $scope.obtenerValorAng = function(campo, index){
                let cantGrupos = $scope.docData.FORMA.GRUPO_CAMPOS;
                let valor;
                for(let x in cantGrupos){
                    for(let y in cantGrupos[x].CAMPO){
                        if(cantGrupos[x].CAMPO[y].tipo != 'M' && cantGrupos[x].CAMPO[y].nombre == campo && index == undefined){
                          if(cantGrupos[x].CAMPO[y].tipo == 'L' && cantGrupos[x].CAMPO[y].OPCIONES.multiple == "false"){//Tipo SELECT
                             valor = cantGrupos[x].CAMPO[y].value;
                             break;
                          }else if(cantGrupos[x].CAMPO[y].tipo == 'L' && cantGrupos[x].CAMPO[y].OPCIONES.multiple == "true"){//Tipo SELECT  multiple
                             valor = cantGrupos[x].CAMPO[y].valueM;
                             break;
                          }else if(cantGrupos[x].CAMPO[y].tipo == 'S'){//Tipo SELECT
                            valor = [];
                              for(let z in cantGrupos[x].CAMPO[y].CAMPO){
                                  valor.push(cantGrupos[x].CAMPO[y].CAMPO[z].value);
                              }
                             break;
                          }else{
                            valor = cantGrupos[x].CAMPO[y].value;
                            break;
                          }
                        }else if(cantGrupos[x].CAMPO[y].tipo == 'S' && cantGrupos[x].CAMPO[y].nombre == campo && index != undefined){ //para campos con hijos
                          if(cantGrupos[x].CAMPO[y].CAMPO[index].exclusivo == "false"){
                              valor = cantGrupos[x].CAMPO[y].CAMPO[index].value;
                          }else{
                                if(cantGrupos[x].CAMPO[y].CAMPO[index].nombre == cantGrupos[x].CAMPO[y].value){
                                  valor ="T"
                                }else{
                                  valor ="F"
                                }
                          }

                          break;
                        }else if(cantGrupos[x].CAMPO[y].tipo == 'L' && cantGrupos[x].CAMPO[y].nombre == campo && index != undefined){
                          let valorTemp;
                          if(cantGrupos[x].CAMPO[y].OPCIONES.multiple == "true"){
                            valorTemp = cantGrupos[x].CAMPO[y].valueM;
                          }else{
                            valorTemp = cantGrupos[x].CAMPO[y].value;
                          }
                          let lista = cantGrupos[x].CAMPO[y].OPCIONES.OPCION;

                          if(typeof valorTemp == "object"){
                            valor = "";
                            for(let a in valorTemp){
                                  valor += ", "+valorTemp[a].value;
                              }
                            valor = valor.substr(2)
                            break
                          }else{
                            for(let i in lista){
                                if(lista[i].codigo == valorTemp ){
                                  valor = lista[i].value;
                                  break;
                                }
                              }
                          }
                          break;
                        }
                    }
                }
                return valor;
            }

            $scope.asignarValorAng = function(campo, valor, index){
              let cantGrupos = $scope.docData.FORMA.GRUPO_CAMPOS;
              for(let x in cantGrupos){
                  for(let y in cantGrupos[x].CAMPO){
                      if(cantGrupos[x].CAMPO[y].nombre == campo){
                        if(cantGrupos[x].CAMPO[y].tipo == 'L'&& cantGrupos[x].CAMPO[y].OPCIONES.multiple == "false"){
                            cantGrupos[x].CAMPO[y].value=valor;
                        }else if(cantGrupos[x].CAMPO[y].tipo == 'L'&& cantGrupos[x].CAMPO[y].OPCIONES.multiple == "true"){
                            cantGrupos[x].CAMPO[y].valueM=valor;
                        }if(cantGrupos[x].CAMPO[y].tipo == 'S'){
                            if(index!= -1 && cantGrupos[x].CAMPO[y].CAMPO[index].exclusivo == "true"){
                              cantGrupos[x].CAMPO[y].value = cantGrupos[x].CAMPO[y].CAMPO[index].nombre;
                            }else{
                              if(!angular.isArray(valor)){
                                if(valor == "T"){
                                      cantGrupos[x].CAMPO[y].CAMPO[index].checked = true;
                                      cantGrupos[x].CAMPO[y].CAMPO[index].value = valor;
                                }else if(valor == "F"){
                                    cantGrupos[x].CAMPO[y].CAMPO[index].checked = false;
                                    cantGrupos[x].CAMPO[y].CAMPO[index].value = valor;
                                }
                              }else{ //valor = ["T","F","T"]
                                  for(let i in valor){
                                    if(valor[i] == "T"){
                                          cantGrupos[x].CAMPO[y].CAMPO[i].checked = true;
                                          cantGrupos[x].CAMPO[y].CAMPO[i].value = valor[i];
                                    }else if(valor[i] == "F"){
                                        cantGrupos[x].CAMPO[y].CAMPO[i].checked = false;
                                        cantGrupos[x].CAMPO[y].CAMPO[i].value = valor[i];
                                    }
                                  }
                              }
                            }
                        }else{
                          cantGrupos[x].CAMPO[y].value=valor;
                        }
                      }
                  }
                }
              $scope.$apply();
            }
              /*funcion para obtener valor desde contexto de angular*/
              $scope.obtenerValorMAng = function(campo, fila, columna){
                  let cantGrupos = $scope.docData.FORMA.GRUPO_CAMPOS;
                  let fil = fila-1;
                  let col = columna -1;
                  let valor;
                  for(let x in cantGrupos){
                      for(let y in cantGrupos[x].CAMPO){
                          if(cantGrupos[x].CAMPO[y].nombre == campo && fil >= 0 && col >= 0){
                            if(cantGrupos[x].CAMPO[y].CAMPO[col].tipo == 'N'){
                                valor = cantGrupos[x].CAMPO[y].FILAS.FILA[fil].CAMPO[col].value
                                if (valor % 1 == 0 && valor != "") {
                                  valor = valor+$locale.NUMBER_FORMATS.DECIMAL_SEP+"00"
                                }else if(valor != ""){
                                  valor = valor+"";
                                }else{
                                  valor = "0";
                                }
                            }else if(cantGrupos[x].CAMPO[y].CAMPO[col].tipo == 'A' && cantGrupos[x].CAMPO[y].CAMPO[col].OPCIONES.multiple == 'true'){
                              valor = cantGrupos[x].CAMPO[y].FILAS.FILA[fil].CAMPO[col].valueM
                            }else{
                                valor = cantGrupos[x].CAMPO[y].FILAS.FILA[fil].CAMPO[col].value;
                            }
                          }else if(cantGrupos[x].CAMPO[y].nombre == campo && fil == -1){
                            //ObtenerValor completo de columna.
                            valor = [];
                            for(let s in cantGrupos[x].CAMPO[y].FILAS.FILA){
                              if(cantGrupos[x].CAMPO[y].FILAS.FILA[s].CAMPO[col].value != undefined && cantGrupos[x].CAMPO[y].FILAS.FILA[s].CAMPO[col].value != ""){
                                valor.push({seleccionado: null, codigo:cantGrupos[x].CAMPO[y].FILAS.FILA[s].CAMPO[col].value , value:cantGrupos[x].CAMPO[y].FILAS.FILA[s].CAMPO[col].value });
                              }
                            }
                          }else if(cantGrupos[x].CAMPO[y].nombre == campo && col == -1 && fil >= 0){
                            //obtener valor completo de
                              valor = [];
                              valor= cantGrupos[x].CAMPO[y].FILAS.FILA[fil].CAMPO;
                          }

                      }
                  }
                  return valor;
              }


              $scope.registrarCampodependienteLista = function(campoOrigen, campoDestino){
                //$scope.listCamDepList
                let flag = true;
                if($scope.listCamDepList.length == 0){
                  $scope.listCamDepList.push({dataOrigen:campoOrigen, dataDestino:campoDestino})
                }else{
                  for(let a in $scope.listCamDepList){
                     if($scope.listCamDepList[a].dataOrigen == campoOrigen && $scope.listCamDepList[a].dataDestino == campoDestino){
                         flag = false;
                         return false;
                     }
                  }
                  if(flag == true){
                    $scope.listCamDepList.push({dataOrigen:campoOrigen, dataDestino:campoDestino});
                  }
                }

                console.log($scope.listCamDepList);
              }

              $scope.valorSelect = function(campo){
                let opcion = campo.OPCIONES.OPCION;
                let r = '';
                   for(let opt in opcion){
                     if(opcion[opt].seleccionado == "true"){
                         if(opcion[opt].codigo != "" && opcion[opt].codigo != null){
                           r = opcion[opt].codigo;
                         }else{
                           r = opcion[opt].value;
                         }
                       }
                   }
                 campo.value = r;

                 if(campo.OPCIONES.origen != undefined && campo.OPCIONES.origen != ''){
                   //listValue.indexOf('[[') == 0 && listValue.indexOf(']]') > 0 &&
                     let valor = campo.OPCIONES.origen;//listValue.replace('[[','').replace(']]','');
                     valor =  valor.split(',');
                     campo.OPCIONES.OPCION = $scope.obtenerValorMAng(valor[0], 0, valor[1]);
                       $scope.registrarCampodependienteLista(campo.OPCIONES.origen, campo.nombre);
                 }
               };



               $scope.refrescarListasDepend = function(matrizOrigen, columnaOrigen, campoDestino, columnaDestino){
                  let opt = $scope.obtenerValorMAng(matrizOrigen, 0, columnaOrigen);
                  let cantGrupos = $scope.docData.FORMA.GRUPO_CAMPOS;
                  let col = parseInt(columnaDestino) - 1;

                    for(let x in cantGrupos){
                      for(let y in cantGrupos[x].CAMPO){
                          if(cantGrupos[x].CAMPO[y].nombre == campoDestino && cantGrupos[x].CAMPO[y].FILAS != undefined){
                              cantGrupos[x].CAMPO[y].CAMPO[col].OPCIONES.OPCION = opt;
                          }else if(cantGrupos[x].CAMPO[y].nombre == campoDestino){
                            cantGrupos[x].CAMPO[y].OPCIONES.OPCION = opt;
                          }
                        }
                      }

               }

               $scope.refrescarListaManejoCliente = function(campoDestino, columnaDestino, opciones){
                 /*Las opciones se deben enviar de la siguiente ModalUploadAnexoConsultoria
                 "OPCION": [{            "seleccionado": null,
                                         "codigo": "01",
                                         "value": "AMAZONAS"
                                     }, {
                                         "seleccionado": null,
                                         "codigo": "02",
                                         "value": "ANCASH"
                                     }
                            ]
                 */
                 let col = parseInt(columnaDestino) - 1;
                 let cantGrupos = $scope.docData.FORMA.GRUPO_CAMPOS;

                 for(let x in cantGrupos){
                   for(let y in cantGrupos[x].CAMPO){
                       if(cantGrupos[x].CAMPO[y].nombre == campoDestino && cantGrupos[x].CAMPO[y].FILAS != undefined){
                           cantGrupos[x].CAMPO[y].CAMPO[col].OPCIONES.OPCION = opciones;
                       }else if(cantGrupos[x].CAMPO[y].nombre == campoDestino){
                         cantGrupos[x].CAMPO[y].OPCIONES.OPCION = opciones;
                       }
                     }
                   }
               }

               $scope.obligatorioRadio = function(field,fieldChild){
                 if(fieldChild.obligatorio == "true"){
                   field.obligatorio="true";
                 }
               }

               $scope.validarEventDocument = function(evento){
                 //console.log('$event',evento)
                 //console.log('event',event)
                 if(evento == undefined && event !=  undefined && event.type == 'input'){ //esta validacion solo aplica para los eventos change
                   evaluar_event( 'change', event.target.id);
                 }else if(evento == undefined && event !=  undefined ){
                   evaluar_event( event.type, event.target.id);
                 }

                 if(evento != undefined){ //captura evento click y blur
                     evaluar_event( evento.type, evento.target.id);
                 }
               }

               $scope.ajaxDataServices = function(idquery, param){
                 let ambiente = $scope.nbAmbiente;
                 if(param == undefined || param == ''){
                   param = [];
                 }
                 /*
                 let param = [];
                 param.push(["parametro1","valor1"])
                 param.push(["parametro2","valor2"])*/
                 return processEngine.getDataServices(ambiente, idquery, param);
                   /*.then(function (data) {
                     console.log(data);
                     if(data.codError =="200"){
                       return data.arrayResult;
                     }else{
                       console.log(data.msgError);
                       return null;
                     }
                   })*/
                   //return resultado;
               }

               $scope.initDocument = function() {

                  $scope.docData = {};
                     if ($scope.lectura=='N'){
                     processEngine.getProfile()
                      .then(function (data) {
                      	if (data!=null){
                          //alert(JSON.stringify(data, null, 2));
                            $scope.nuDocUser = data.activoD;
                             //$scope.nuDocUser = 0;
                             /*agregar configuracion local de angular*/
                             /*$scope.perfilUser = data;
                             console.log('DECIMAL_SEP ',$locale.NUMBER_FORMATS.DECIMAL_SEP);
                             console.log('GROUP_SEP ', $locale.NUMBER_FORMATS.GROUP_SEP);
                             if($locale.NUMBER_FORMATS.DECIMAL_SEP != $scope.perfilUser.formatoDecimal){
                                 $locale.NUMBER_FORMATS.DECIMAL_SEP = $scope.perfilUser.formatoDecimal;
                                 console.log('asignado decimal', $scope.perfilUser.formatoDecimal)
                             }
                             if($locale.NUMBER_FORMATS.GROUP_SEP != $scope.perfilUser.formatoMiles){
                               $locale.NUMBER_FORMATS.GROUP_SEP = $scope.perfilUser.formatoMiles;
                               console.log('asignado miles', $scope.perfilUser.formatoMiles)
                             }*/
                             //$locale.NUMBER_FORMATS.DECIMAL_SEP = $scope.perfilUser.formatoDecimal;
                             //$locale.NUMBER_FORMATS.GROUP_SEP = $scope.perfilUser.formatoMiles;
                             $scope.anular = data.anular;
                             $scope.anexar = data.anexar;
                             $scope.desAnexar = data.desanexar;
                             $scope.imprimir = data.imprimir;

                            if ($scope.nuDocUser==0){
                              if ($scope.nuDoc == 0){
                                //create document
                                $scope.createDocument();
                              }else{
                                //open document
                                $scope.openDocument();
                              }
                            }else{
                              //buscar anexos
                                processEngine.attachedDocument()
                                .then(function (data) {
                                  if (data!=null){
                                    $scope.listAnexos = data;
                                  }
                                });
                              //$scope.getDocument(0);
                               $scope.openDocument();
                            }
                        }
                      });
                     }else{
                  //open document in mode read
                      $scope.openDocumentRead();
                     }
              };

              $scope.initDocument();


            }//fin controller
/**-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------**/
          };//fin return
    };

    function UpdateFieldProcess() {
	   return {
	        restrict: 'AE', //attribute or element
	        scope: {},
	        replace: true,
	        require: 'ngModel',
	        link: function ($scope, elem, attr, ngModel) {
	            $scope.$watch(ngModel, function (nv) {
	                elem.val(nv);
	            });
	            elem.change(function () { //bind the change event to hidden input
	                $scope.$apply(function () {
	                    ngModel.$setViewValue(  elem.val());
	                });
	            });
	        }
	    };
    }

    function MatrizForm($sce) {
        return {
            restrict: 'E',
            scope: {
              srcData: '=',
              descriptionMatriz: '=',
              nameMatriz: '=',
              listCamDepList: '=',
              ejecEventAgent: '&',
              eventAjaxChanged: '&',
              selectedAjax: '&',
              searchEventAjax: '&',
              generarArchivo: '&',
              formatoNumero:'&',
              setChangeForm:'&',
              depurar:'&',
              obtenerValorMang:'&',
              registrarCampodependienteLista: '&',
              refrescarListasDepend:'&'
            },
            templateUrl: 'app/views/templates/matrizform.html',
            //link: function(scope, element, attr) {
            controller: function ($scope,$timeout,$locale) {

              $scope.display = $scope.srcData.FILAS.FILA;
              $scope.itemsM = 10;
              $scope.tableState;

            $scope.getHtml = function(html) {
	            	return $sce.trustAsHtml(html);
	          };

            $scope.setChangeValue = function(field) {
                	field.change =true;
                  $scope.setChangeForm({f:true})
              };

              $scope.initList = function(list,field) {
                //let listValue = list.OPCIONES.origen;

                if(list.OPCIONES.origen != undefined && list.OPCIONES.origen != ''){
                  //listValue.indexOf('[[') == 0 && listValue.indexOf(']]') > 0 &&
                    let valor = list.OPCIONES.origen;//listValue.replace('[[','').replace(']]','');
                    valor =  valor.split(',');
                    list.OPCIONES.OPCION = $scope.obtenerValorMang({campo: valor[0], fila:0, columna: valor[1]});

                    $scope.registrarCampodependienteLista({campoOrigen:list.OPCIONES.origen, campoDestino:list.nombre})

                }

            	  for(var i in list.OPCIONES.OPCION) {
              		var item =  list.OPCIONES.OPCION[i];
              		var seleted = false;
              		if ((item.codigo==field.value) || (item.value==field.value)){
                    		seleted = true;
                    }
                  	if (seleted && (item.codigo!=field.value)){
                  		field.value = item.codigo;
                  		break;
                  	}
              	  }
              }

              /*$scope.initListMultiple = function(list,field) {
                  field.valueM = field.value.split("|");
                };*/
                $scope.initListMultiple = function(list,field) {
                   let selec = field.value.split("|");
                   let opcion = list.OPCIONES.OPCION;
                   let r = [];
                      for(let opt in opcion){
                        for (let sel in selec){
                          if(opcion[opt].value == selec[sel]){
                            r.push(opcion[opt]);
                            break;
                          }
                        }
                      }
                    field.valueM = r;
                };

                $scope.recorrerListCamDepend= function(campo,opt){
                  //opt 1 = evento desde columna, 2 = evento desde boton de borrar de matriz
                  //replace(/[0-9]/g, ''); obtener caracteres
                  //replace(/[^0-9]/g, ''); obtener numeros

                   if($scope.listCamDepList.length != 0){
                     for(let a in $scope.listCamDepList){
                       let val = $scope.listCamDepList[a].dataOrigen.split(',')
                        if( val[0]+val[1]== campo.nombre && opt == 1){
                             $scope.refrescarListasDepend({matrizOrigen :val[0], columnaOrigen:val[1], campoDestino:$scope.listCamDepList[a].dataDestino.replace(/[0-9]/g, ''), columnaDestino:$scope.listCamDepList[a].dataDestino.replace(/[^0-9]/g, '')});
                        }

                        if(val[0] == campo.nombre && opt == 2){
                          $scope.refrescarListasDepend({matrizOrigen :val[0], columnaOrigen:val[1], campoDestino:$scope.listCamDepList[a].dataDestino.replace(/[0-9]/g, ''), columnaDestino:$scope.listCamDepList[a].dataDestino.replace(/[^0-9]/g, '')});
                        }
                     }
                   }
                };

                $scope.paginationTable = function(tableState) {
                   $scope.tableState = tableState;
                	 $scope.display = $scope.srcData.FILAS.FILA.slice(tableState.pagination.start, tableState.pagination.start + $scope.itemsM);
              		 tableState.pagination.numberOfPages = Math.ceil($scope.srcData.FILAS.FILA.length / $scope.itemsM);
               		 tableState.pagination.totalItemCount = $scope.srcData.FILAS.FILA.length;
                   $scope.formulaMatriz = {matriz : $scope.srcData.nombre, fila : $scope.srcData.FILAS.FILA.length}
                   $timeout(function () {
                     /*funciones que se deben ejecutar cuando se agrega una fila se coloca dentro del timeout porque se
                       debe ejecutar la contruccion en el html para la asignacion de eventos en el DOM desde JavaScript*/
                     //DynMatrices($scope.formulaMatriz.matriz,$scope.formulaMatriz.fila);
                     //DynFormulas($scope.formulaMatriz.matriz,$scope.formulaMatriz.fila);
                     if(typeof ReconstruirFormulas === 'function') {
                       ReconstruirFormulas($scope.formulaMatriz.matriz,$scope.formulaMatriz.fila);
                     }
                     if(typeof reconstruir_matriz_event === 'function') {
                       reconstruir_matriz_event($scope.formulaMatriz.matriz);
                     }
                     $scope.formulaMatriz = {};
                   }, 1);
                }

              $scope.addRow = function($event) {
                let flag = evaluar_event( event.type, event.target.id);
                if(!flag){
                  return false;
                }
            	 var newRow = angular.copy($scope.srcData.FILAS.FILA[0]);
            	  //limpiar data del obj
            	  for(var i in newRow.CAMPO) {
            		  newRow.selChk = false;
            		  var val =  newRow.CAMPO[i];
            		  for(var j in val){
                		  if (j=="value"){
                			  val[j] = "";
                		  }
            		  }
            	  }
            	  $scope.srcData.FILAS.FILA.push(newRow);
            	  $scope.tableState.pagination.start = (Math.ceil($scope.srcData.FILAS.FILA.length / $scope.itemsM) -1) * $scope.itemsM;
            	  $scope.paginationTable($scope.tableState);
                //$scope.formulaMatriz = {matriz : event.target.id.replace('MATNV',''), fila : $scope.srcData.FILAS.FILA.length}
                /*$timeout(function () {*/
                  /*funciones que se deben ejecutar cuando se agrega una fila se coloca dentro del timeout porque se
                    debe ejecutar la contruccion en el html para la asignacion de eventos en el DOM desde JavaScript*/
                  /*DynMatrices($scope.formulaMatriz.matriz,$scope.formulaMatriz.fila);
                  DynFormulas($scope.formulaMatriz.matriz,$scope.formulaMatriz.fila);
                  ReconstruirFormulas($scope.formulaMatriz.matriz,$scope.formulaMatriz.fila);
        					reconstruir_matriz_event($scope.formulaMatriz.matriz);
                  $scope.formulaMatriz = {};
                }, 1);*/
              };

            $scope.removeRows = function($event) {
                console.log($scope.srcData.nombre)
              	var i;
              	for(i = $scope.display.length; i--;){
              		var item = $scope.display[i];
              		if (item.selChk){
                  		var itemDelete = $scope.srcData.FILAS.FILA.indexOf(item);
                  		if (itemDelete>=0){
                  	    	if ($scope.srcData.FILAS.FILA.length==1){
  	   	           	    		 var newRow = angular.copy($scope.srcData.FILAS.FILA[0]);
  	   	           	    		 newRow.selChk = false;
  	   		                   	  //limpiar data del obj
  	   		                   	  for(var j in newRow.CAMPO) {
  	   		                   		  var val =  newRow.CAMPO[j];
  	   		                   		  for(var k in val){
  	   		                       		  if (k=="value"){
  	   		                       			  val[k] = "";
  	   		                       		  }
  	   		                   		  }
  	   		                   	  }
  	   		                   	$scope.srcData.FILAS.FILA.splice(itemDelete,1);
  	   		                   	$scope.srcData.FILAS.FILA.push(newRow);
  	               	    	}else{
  	               	    		$scope.srcData.FILAS.FILA.splice(itemDelete,1);
  	               	    	}
                  		}
                      if($scope.srcData.filasEliminadas != "" && $scope.srcData.filasEliminadas != null){
                          itemDelete = itemDelete +1;
                          $scope.srcData.filasEliminadas = $scope.srcData.filasEliminadas+";"+itemDelete;
                      }else{
                        itemDelete = itemDelete +1;
                        $scope.srcData.filasEliminadas = ""+itemDelete;
                      }
              		}
              	}
              	if ($scope.tableState.pagination.start<=$scope.srcData.FILAS.FILA.length){
              		$scope.tableState.pagination.start = (Math.ceil($scope.srcData.FILAS.FILA.length / $scope.itemsM) -1) * $scope.itemsM;
              	}
              	$scope.paginationTable($scope.tableState);

                $scope.recorrerListCamDepend($scope.srcData,2)
              //  $scope.formulaMatriz = {matriz : event.target.id.replace('MATBO','')}
                /*$timeout(function () {
                	DynMatrices($scope.formulaMatriz.matriz,-1);
                  ReconstruirFormulas($scope.formulaMatriz.matriz,1);
        					reconstruir_matriz_event($scope.formulaMatriz.matriz);
        					activar_onchange_matriz($scope.formulaMatriz.matriz);
                  $scope.formulaMatriz = {};
                },10);*/
            };

              $scope.markAlleRows = function() {
              	for(var i in $scope.display) {
            	    var item = $scope.display[i];
            	    if (!item.selChk){
            	    	item.selChk = true;
            	    }
            	}
              };

              $scope.eventAjaxChangedM = function (idM) {
            	  var idFieldObj = this.$parent.$$childHead.id;
            	  $scope.eventAjaxChanged({id : idM, identField: idFieldObj.substring(idFieldObj.indexOf("_")+1), fila: idFieldObj.substring(1,idFieldObj.indexOf("_")) });
    	      };

    	      $scope.selectedAjaxM = function(selectedM) {
    	    	  $scope.selectedAjax({selected : selectedM});
	    	  };

	    	  $scope.searchEventAjaxM = function(userInputStringM, timeoutPromiseM) {
	        	  var idFieldObj = this.$parent.$$childHead.id;
	        	  return $scope.searchEventAjax({userInputString : userInputStringM, timeoutPromise: timeoutPromiseM, identField: idFieldObj.substring(idFieldObj.indexOf("_")+1), fila: idFieldObj.substring(1,idFieldObj.indexOf("_")) });
	          };

          $scope.generarArchivoM = function(field, fil){
            return  $scope.generarArchivo({field: field});
          }

          $scope.getEscritura = function(){
            let campo = $scope.srcData.CAMPO;
            let visible = false;
            let escritura = false;
              for(let opt in campo){
                if(campo[opt].escritura == 'true'){
                    escritura = true;
                }
                if(campo[opt].lectura == 'true'){
                    visible = true
                }
                if(visible && escritura){
                  break;
                }
              }
              $scope.srcData.escritura = escritura;
              $scope.srcData.visible = visible;
          }
          $scope.getEscritura();

          $scope.stringToBooleanM = function(string){
            let boolean = false;
            boolean = (string=="true")
            return boolean;
          }

          $scope.valueCheck= function(col){
              if(col.value == "T"){
                col.checked = true;
              }else{
                col.checked = false;
              }
          }
          $scope.setCheckValuesM = function(field) {
            if(field.checked == true){
                field.value = 'T';
            }else if(field.checked == false){
                field.value = 'F';
            }
          };

          $scope.validarRangoNumeroM = function(campo, fil){
            let minimo = parseFloat(campo.minimo);
            let maximo = parseFloat(campo.maximo);
            //let minimo = parseFloat($scope.depurar({pe_valor:campo.minimo,pe_sepdec:$locale.NUMBER_FORMATS.DECIMAL_SEP, cant_decimal:0}));
            //let maximo = parseFloat($scope.depurar({pe_valor:campo.maximo,pe_sepdec:$locale.NUMBER_FORMATS.DECIMAL_SEP, cant_decimal:0}));
            // let valor = parseFloat(fil.value);
            fil.decimales = campo.decimales;

             let f = $scope.esNumeroM(fil);

             /*Validar Rango colocado en el diseñador*/
             if(f ==true){
               let valor =parseFloat($scope.depurar(fil.value,$locale.NUMBER_FORMATS.DECIMAL_SEP, 1));
               if (minimo<=maximo){
                    if (valor<minimo||valor>maximo){
                    alertmb("El valor ingresado no se encuentra dentro del rango, minimo ("+campo.minimo+") maximo ("+campo.maximo+")",1,1,"Aceptar");
                    fil.value = 0;
                   }
               }else{
                alertmb("error en rango",1,1,"Aceptar");
              }
            }else{
              alertmb("Ingrese un numero valido",1,1,"Aceptar");
              fil.value = 0;
            }
          }

          $scope.esNumeroM = function(campo){
            if(isNaN($scope.depurar({ pe_valor:campo.value, pe_sepdec:$locale.NUMBER_FORMATS.DECIMAL_SEP, ope: 1 }))) return 0;
            //pe_valor, pe_sepdec, ope
            if(campo.value != null){
               campo.value = $scope.formatoNumero({valor:campo.value,cant_decimal:campo.decimales});
            }
            return true;
          }

          $scope.eventFormula= function(evento){
            let id;

            if(evento != undefined){
              id = evento.target.id;
            }else{
              id = event.target.id;
            }

            ActualizarCamposDependientes(id)//funcion que ejecuta los eventos asociados que tiene una matriz en registrar formula
          }

          $scope.validarEventMatrizAng = function(evento){
            //console.log('$event',evento)
            //console.log('event',event)
            if(evento == undefined && event !=  undefined && event.type == 'input'){ //esta validacion solo aplica para los eventos change
              evaluar_event( 'change', event.target.id);
            }else if(evento == undefined && event !=  undefined ){
              evaluar_event( event.type, event.target.id);
            }

            if(evento != undefined){ //captura evento click y blur
                evaluar_event( evento.type, evento.target.id);
            }
          }

        }
        }
    }

    //Service document
    function documentService($window,processEngine,$rootScope) {
    	var self = this;

    	self.saveCtxOpenDoc = saveCtxOpenDoc;
    	self.getCtxOpenDoc = getCtxOpenDoc;
    	self.delCtxOpenDoc = delCtxOpenDoc;
    	self.isOpenDoc = isOpenDoc;
    	self.saveClose = saveClose;
    	self.close = close;
    	self.save = save;
    	self.closeRead = closeRead;
    	//helper ambiente
    	self.saveCtxAmb = saveCtxAmb;
    	self.getCtxAmb = getCtxAmb;
    	self.delCtxAmb = delCtxAmb;
      self.putNewDocument = putNewDocument;

        function saveCtxAmb(formaDate,formatMiles,formatDecimal,idioma) {
        	var arrayDoc = [];
        	arrayDoc.push(formaDate);
        	arrayDoc.push(formatMiles);
        	arrayDoc.push(formatDecimal);
        	arrayDoc.push(idioma);
            $window.localStorage['ctxAmb'] = JSON.stringify(arrayDoc);
        }

        function getCtxAmb() {
        	var arrayDoc = JSON.parse($window.localStorage['ctxAmb']);
            return arrayDoc;
        }

        function delCtxAmb() {
        	 $window.localStorage.removeItem('ctxAmb');
        }

        function saveCtxOpenDoc(nuDoc,nuInst,wfa,read,name) {
        	var arrayDoc = [];
        	arrayDoc.push(nuDoc);
        	arrayDoc.push(nuInst);
        	arrayDoc.push(wfa);
        	arrayDoc.push(read);
        	arrayDoc.push(name);
            $window.localStorage['ctxDoc'] = JSON.stringify(arrayDoc);
        }

        function putNewDocument(){
          var arrayDoc = getCtxOpenDoc();
          if(arrayDoc[1]==0){
            arrayDoc[1]=1
          }
          $window.localStorage['ctxDoc'] = JSON.stringify(arrayDoc);
        }

        function getCtxOpenDoc() {
        	var arrayDoc = JSON.parse($window.localStorage['ctxDoc']);
            return arrayDoc;
        }

        function delCtxOpenDoc() {
        	 $window.localStorage.removeItem('ctxDoc');
        }

        function isOpenDoc() {
            var ctx = $window.localStorage['ctxDoc'];
            if (ctx) {
                return true;
            } else {
                return false;
            }
        }

        function saveClose(observation) {
        	return processEngine.saveDocument(observation)
            .then(function (data) {
            	delCtxOpenDoc();
            	processEngine.closeDocument();
            });
        }

        function save(observation) {
        	return processEngine.saveDocument(observation)
            .then(function (data) {
            });
        }

        function close() {
            return processEngine.closeDocument()
            .then(function (data) {
            	delCtxOpenDoc();
            });
        }

        function closeRead() {
            return processEngine.closeDocumentRead()
            .then(function (data) {

            });
        }
    }

})();

var ModalUploadController = function($scope, $modalInstance, FileUploader, anexar, desAnexar, listAnexos,tamanoAnexo, processEngine) {

  $scope.anexar = anexar;
  $scope.desAnexar = desAnexar;
  $scope.listAnexos = listAnexos;
	$scope.descriptionAnx = '';
	$scope.requiredDescriptionAnx = false;
	$scope.changeAnexos = false;
  $scope.tamanoAnexo = parseFloat(tamanoAnexo); //representacion en MB
  $scope.msgTamanoAnexo = false;
  $scope.errorTamanoAnexoServidor = false;

    var uploader = $scope.uploader = new FileUploader({
    });

    $scope.save = function () {
        //save form
    	$modalInstance.close();
    };

    uploader.removeItem = function(fileItem) {
    	fileItem.remove();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss($scope.listAnexos);
    };

    $scope.markAllFiles = function() {
      	for(var i in $scope.listAnexos) {
    	    var item = $scope.listAnexos[i];
    	    if (!item.selected){
    	    	item.selected = true;
    	    }
    	}
    };

    $scope.openLink = function(link) {
   	 $window.open(link, '_blank');
    };

    $scope.deleteFiles = function() {
    	processEngine.marckAttachedDocument($scope.listAnexos,true)
        .then(function (data) {
        	processEngine.attachedDocument()
             .then(function (data) {
             	if (data!=null){
             		$scope.listAnexos = data;
             		$scope.changeAnexos = true;
             	}
             });
        });
    };

    $scope.recoverFiles = function() {
    	processEngine.marckAttachedDocument($scope.listAnexos,false)
        .then(function (data) {
        	processEngine.attachedDocument()
             .then(function (data) {
             	if (data!=null){
             		$scope.listAnexos = data;
             		$scope.changeAnexos = true;
             	}
             });
        });
   };

    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };

    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
    	if ($scope.descriptionAnx!=''){
    		$scope.requiredDescriptionAnx = false;
        	var ticket = 'Bearer ' + $scope.ticketService.getTicket();
          console.log(config)
        	var urlService = config.ServicesUpload + $scope.nbAmbiente + '&descripcion=' + $scope.descriptionAnx;
        	item.url = urlService;
        	item.headers = {
        			Authorization: ticket
        	};
    	}else{
    		$scope.requiredDescriptionAnx = true;
    	}
        //item.withCredentials = true;
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
    	if (status == 200){
        if(!response.error){
          processEngine.attachedDocument()
            .then(function (data) {
              if (data!=null){
                $scope.listAnexos = data;
                 uploader.removeItem(fileItem);
                 $scope.descriptionAnx = '';
                 $scope.changeAnexos = true;
              }
            });
        }else{
          uploader.removeItem(fileItem);
          $scope.descriptionAnx = '';
          let msj = "El archivo excede el tamaño aceptado por el servidor ("+response.tamanoAnexo+" MB)";
          $scope.errorTamanoAnexoServidor = true;
          $scope.msgTamanoAnexoServidor = msj;
        }
    	}
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    uploader.onAfterAddingFile  = function(item){
      let cal = item.file.size/1024/1024
      let tamanoAnexo = $scope.tamanoAnexo;
      if(cal > tamanoAnexo){
        uploader.clearQueue();
        $scope.msgTamanoAnexo = true;
        $scope.errorTamanoAnexoServidor = false;
      }else{
        item.file.tamano = cal.toFixed(2);
        $scope.msgTamanoAnexo = false;
        $scope.errorTamanoAnexoServidor = false;
      }

    }
};
var ModalAgentController = function($scope, $modalInstance, items, opcionesmultiples) {

	$scope.items = items;
  $scope.eventOpcionesM = opcionesmultiples;
    $scope.ejecEvent = function (selList) {
       //TODO llamar servicio para rsolver lista de valores
    	$modalInstance.close(selList);
    };


    $scope.ejecEventM= function(item){
      console.log(item)
        let listSeleccion = "";
        for(let opt in item.filas){
          if(item.filas[opt].selChk == true){
            //selList.push(item.filas[opt].numero);
            listSeleccion +=","+item.filas[opt].numero;
          }
        }
        $modalInstance.close(listSeleccion.replace(",","",1));
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};
var ModalInstController = function($scope, $modalInstance, documentService) {

	$scope.nbConversacionOpen = '';
	$scope.nuDocOpen = '';

    activate();

    function activate() {
    	if (documentService.isOpenDoc()){
			var arrayDoc = documentService.getCtxOpenDoc();
			$scope.nbConversacionOpen = arrayDoc[4];
			$scope.nuDocOpen = arrayDoc[0];
    	}
    }

    $scope.ok = function () {
      $modalInstance.close('1');
    };

    $scope.noOk = function () {
	    $modalInstance.close('2');
	  };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};
var ModalSendController = function($scope, $modalInstance, processEngine, sendObj, sendAcc, sendChkPriority, sendComment, sendCcMail, $state, documentService) {

	//send form
	$scope.sign = '';
	$scope.question = '';
	$scope.answer = '';
	$scope.sendComment = sendComment;
	$scope.comment = '';
	$scope.sendChkPriority = sendChkPriority;
	$scope.opinion = 0;
	$scope.sendCcMail = sendCcMail;
	$scope.sendObj = sendObj;
	$scope.sendBoolPriority = false;
	$scope.sendMsg = {};
	$scope.sendBoolMsg = false;
	$scope.sendAcc = sendAcc;
	$scope.nbAcc = '';
  $scope.input = {};

	activate();

	function activate() {

		if (sendAcc=='A'){//avanzar
			$scope.nbAcc = 'AccEnviar';
			if (!$scope.sendObj.firma && !$scope.sendObj.evalua && $scope.sendObj.allSelected){
	          	if ($scope.comment!=''){
	          		$scope.sendComment = $scope.comment;
	          	}
	          	if ($scope.sendChkPriority=='1'){
	          		$scope.sendBoolPriority = true;
	          	}else{
	          		$scope.sendBoolPriority = false;
	          	}
	            processEngine.sendDocument($scope.sign,$scope.question,$scope.answer,$scope.sendComment,$scope.sendBoolPriority,true,$scope.opinion,$scope.sendCcMail,0,$scope.sendObj.destinos)
	            .then(function (data) {
	          	  if (data!=null){
	          		//alert(JSON.stringify(data, null, 2));
	          		$scope.sendMsg = data;
	          		$scope.sendBoolMsg = true;
	          	  }
	           });
			}else if ($scope.sendObj.firma){
	            processEngine.getProfile()
	            .then(function (data) {
	            	if (data!=null){
                  $scope.perfilUser = data;
                  /*$locale.NUMBER_FORMATS.DECIMAL_SEP = $scope.perfilUser.formatoDecimal;
                  $locale.NUMBER_FORMATS.GROUP_SEP = $scope.perfilUser.formatoMiles;*/
	            		$scope.question = data.pregunta;
	            	}
	            });
			}
		}else if (sendAcc=='R'){//rechazar
			$scope.nbAcc = 'AccObjetar';
			$scope.sendMsg = $scope.sendObj;
			$scope.sendBoolMsg = true;
		}else if (sendAcc=='C'){//anular
			$scope.nbAcc = 'AccAnular';
			$scope.sendMsg = $scope.sendObj;
			$scope.sendBoolMsg = true;
		}else if (sendAcc=='V'){//adquirir
			$scope.nbAcc = 'AccAdquirir';
			$scope.sendMsg = $scope.sendObj;
			$scope.sendBoolMsg = true;
		}else if (sendAcc=='O'){//recuperar
			$scope.nbAcc = 'AccRecuperar';
			$scope.sendMsg = $scope.sendObj;
			$scope.sendBoolMsg = true;
		}

	}

    $scope.selPlace = function (dest, place) {
    	dest.valueSelected = place;
    };

	$scope.send = function () {
	  $scope.sendMsg = {};
    console.log($scope.sendObj);

  	  //if ($scope.sendObj.allSelected){
      	  if ($scope.comment!=''){
        		$scope.sendComment = $scope.comment;
        	  }
        	  if ($scope.sendChkPriority=='1'){
        		$scope.sendBoolPriority = true;
        	  }else{
        		$scope.sendBoolPriority = false;
        	  }
            processEngine.sendDocument($scope.input.sign,$scope.question,$scope.input.answer,$scope.sendComment,$scope.sendBoolPriority,true,$scope.opinion,$scope.sendCcMail,0,$scope.sendObj.destinos)
            .then(function (data) {
            	if (data!=null){
            		//alert(JSON.stringify(data, null, 2));
            		$scope.sendMsg = data;
            		$scope.sendBoolMsg = true;
            	}
            });
  	  //}
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.goTask = function () {
        $modalInstance.dismiss('cancel');
    	if ($scope.sendAcc!='V'){//si no es Adquirir
    		documentService.delCtxOpenDoc();
    		$state.go('root.main',{},{reload:'root.main'});
    	}

    };
};
var ModalUploadAnexoConsultoria = function($scope, $modalInstance, FileUploader, nudoc, sufijo, dirvir, dirfis, sec, colruta, matriz, colver,tamanoAnexo, processEngine) {

  var uploader = $scope.uploader = new FileUploader({});

  $scope.tamanoAnexo = parseFloat(tamanoAnexo); //representacion en MB
  $scope.msgTamanoAnexo = false;

  uploader.onBeforeUploadItem = function(item) {
    	var ticket = 'Bearer ' + $scope.ticketService.getTicket();
      console.log(config)
    	var urlService = config.ServicesUploadConsultoria + $scope.nbAmbiente;
    	item.url = urlService;
    	item.headers = {
    			Authorization: ticket
    	};

      item.formData.push({
        nuDoc : nudoc,
        sufijo : sufijo,
        directorioVir : dirvir,
        directorioFis : dirfis,
        secuencia : sec
      });
        //item.withCredentials = true;
        console.info('onBeforeUploadItem', item);
    };

    uploader.onAfterAddingFile  = function(item){
    //  let cal = item.file.size/1024/1024
    //  item.file.tamano = cal.toFixed(2);

      let cal = item.file.size/1024/1024
      let tamanoAnexo = $scope.tamanoAnexo;
      if(cal > tamanoAnexo){
        uploader.clearQueue();
        $scope.msgTamanoAnexo = true;
        $scope.errorTamanoAnexoServidor = true;
      }else{
        item.file.tamano = cal.toFixed(2);
        $scope.msgTamanoAnexo = false;
        $scope.errorTamanoAnexoServidor = true;
      }

    };

    uploader.onCompleteItem = function(fileItem, response, status, headers) {
     if (status == 200){
         if(!response.error){
           $('#M'+sec+matriz+colruta).val(response.rutaVirtual);
           $('#M'+sec+matriz+colruta).trigger('input');
           $('#M'+sec+matriz+colver).val("<a href=javascript:abrir_archivo(" + sec + ",'"+ matriz +"'," +  colruta +  ") ><i class='fa fa-file' style='color:black'></i>");
           $('#M'+sec+matriz+colver).trigger('input');
            uploader.removeItem(fileItem);
            $scope.descriptionAnx = '';
            $scope.changeAnexos = true;
         }else{
           uploader.removeItem(fileItem);
           $scope.descriptionAnx = '';
           let msj = "El archivo excede el tamaño aceptado por el servidor ("+response.tamanoAnexo+" MB)";
           $scope.errorTamanoAnexoServidor = true;
           $scope.msgTamanoAnexoServidor = msj;
         }
       }


       console.info('onCompleteItem', fileItem, response, status, headers);
   };
   $scope.save = function () {
        //save form
    	$modalInstance.close();
    };
  uploader.removeItem = function(fileItem) {
    fileItem.remove();
  };

  $scope.cancel = function () {
      $modalInstance.dismiss();
  };
}

function timeConvert() {
  return {
    priority: 1,
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {



      function toModel(value) {
        let val;
        if(typeof value == "object"){
          let hours = value.getHours();
          let minutes = value.getMinutes();
            minutes = parseInt(minutes) < 10 ? '0'+parseInt(minutes) : minutes;
           val = hours+':'+minutes
        }else{
          let  hours = value.substr(0,2);
          let minutes =value.substr(3,4);
          let ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = parseInt(minutes) < 10 ? '0'+parseInt(minutes) : minutes;
          val = hours + ':' + minutes + ' ' + ampm;
        }
        return val;
      }

      function toView(value) {
        val = new Date(1970,0,1,value.substr(0,2), value.substr(3,4),0);
        return val;
      }

      ngModel.$formatters.push(toView);
      ngModel.$parsers.push(toModel);
    }
  };
}
