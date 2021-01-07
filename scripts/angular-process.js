﻿(function(){
    'use strict';
    var ip =

    angular
    .module('ngProcess', []);

    angular
        .module('ngProcess')
        //.constant('API', 'http://localhost:9092/process/api')
        .constant('API', config.ServicesEngine)
        .factory('ticketInterceptor', ticketInterceptor)
        .service('ticketService', ticketService)
        .factory('processEngine', processEngine)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('ticketInterceptor');
        });


    ticketInterceptor.$inject = ['API','ticketService','$injector'];
    //Interceptor to retrieve and add tickets.
    function ticketInterceptor(API, ticketService, $injector) {
        return {
            request: function (config) {
            	if (config.url.indexOf('/admin/') < 0){
                    var ticket = ticketService.getTicket();
                    if (config.url.indexOf(API) == 0 && ticket && !config.headers.Authorization) {
                   		config.headers.Authorization = 'Bearer ' + ticket;
                        var numR = ticketService.getNumReq();
                        //console.log("numR: "+numR);
                        if (numR==0){
                        	//console.log("numR:---->RES "+numR);
                        	ticketService.resetListError();
                        }
                        numR++;
                        ticketService.numReq(numR);
                    }
            	}
                return config;
            },

            response: function (res) {
            	if (res.config.url.indexOf('/admin/') < 0){
    				var ticket = res.headers('Ticket');
                    if (res.config.url.indexOf(API) == 0 && ticket) {
                        ticketService.saveTicket(ticket);
                    }
                    if (res.config.url.indexOf(API) == 0){
                        //ticketService.delStatusCode();
                        var numR = ticketService.getNumReq();
                        numR--;
                        ticketService.numReq(numR);
                    }
            	}
                return res;
            },

            responseError: function (rejection) {
            	ticketService.statusCode(rejection.status);
            	if (rejection.config.url.indexOf('/admin/') < 0){
                    if (rejection.config.url.indexOf(API) == 0){
                        var numR = ticketService.getNumReq();
                        numR--;
                        ticketService.numReq(numR);
                    }
                	if (rejection.status == '401'){
                		ticketService.delTicket();
                		ticketService.resetListError();
                		$injector.get('$state').transitionTo('root.login', { msg: ticketService.getDescriptionError(rejection.status) });
                	}else{
                    var ticket = rejection.headers('Ticket');
                    if (rejection.config.url.indexOf(API) == 0 && ticket) {
                        ticketService.saveTicket(ticket);
                    }
                  }
            	}
                return rejection;
            }

        }
    }

    //Ticket Handling
    function ticketService($window) {
        var self = this;

        //manejo del ticket
        self.saveTicket = saveTicket;
        self.getTicket = getTicket;
        self.delTicket = delTicket;
        self.isAuthed = isAuthed;
        //manejo del codigo de error
        self.listStatusCode = listStatusCode;
        self.statusCode = statusCode;
        self.getStatusCode = getStatusCode;
        self.getMessageError = getMessageError;
        self.setMessageError = setMessageError;
        self.delStatusCode = delStatusCode;
        self.isShowError = isShowError;
        self.numReq = numReq;
        self.getNumReq = getNumReq;
        self.resetListError = resetListError;
        self.getDescriptionError = getDescriptionError;
        self.messageWarning = messageWarning;
        self.getMessageWarning = getMessageWarning;
        self.delWarning = delWarning;
        self.getCodeWarning = getCodeWarning;
        self.codeWarning = codeWarning;

        activate();

        function activate() {
            $window.sessionStorage.removeItem('statusCode');
            $window.sessionStorage.removeItem('messageError');
        }

        function saveTicket(ticket) {
            $window.sessionStorage['ticket'] = ticket;
        }

        function getTicket() {
            return $window.sessionStorage['ticket'];
        }

        function delTicket() {
            $window.sessionStorage.removeItem('ticket');
        }

        function isAuthed() {
            var ticket = self.getTicket();
            if (ticket) {
                return true;
            } else {
                return false;
            }
        }

        function numReq(numReq) {
            $window.sessionStorage['numReq'] = numReq;
        }

        function getNumReq() {
        	var num = $window.sessionStorage['numReq'];
        	if (num){
        		return num;
        	}else{
        		return 0;
        	}
        }

        function resetListError() {
        	$window.sessionStorage.removeItem('listMessageError');
        	$window.sessionStorage.removeItem('listStatusCode');//forzar el reseteo de los mensajes
        	numReq(0);
        }

        function listStatusCode(code) {
        	if ($window.sessionStorage['listStatusCode']){
        		var listStatus = JSON.parse($window.sessionStorage['listStatusCode']);
        		var listMessage = JSON.parse($window.sessionStorage['listMessageError']);
        		var inList = false;
        		 for(var i in listStatus) {
        			 var item = listStatus[i];
        			 if (item==code){
        				 inList = true;
        				 break;
        			 }
        		 }
        		 if (!inList){
             		listStatus.push(code);
            		listMessage.push(getDescriptionError(code));
                    $window.sessionStorage['listStatusCode'] = JSON.stringify(listStatus);
                    $window.sessionStorage['listMessageError'] = JSON.stringify(listMessage);
        		 }
        	}else{
        		var listStatus = [];
        		var listMessage = [];
        		listStatus.push(code);
        		listMessage.push(getDescriptionError(code));
                $window.sessionStorage['listStatusCode'] = JSON.stringify(listStatus);
                $window.sessionStorage['listMessageError'] = JSON.stringify(listMessage);
        	}
        }

        function statusCode(code) {
            $window.sessionStorage['statusCode'] = code;
            listStatusCode(code);
        }

        function codeWarning(warning){
          $window.sessionStorage['codeWarning'] = warning;
        }

        function getCodeWarning(){
          return $window.sessionStorage['codeWarning'];
        }

        function delWarning() {
            $window.sessionStorage.removeItem('codeWarning');
            $window.sessionStorage.removeItem('messageWarning');
        }

        function messageWarning(message){
          $window.sessionStorage['messageWarning'] = message;
        }

        function getMessageWarning(){
          return $window.sessionStorage['messageWarning'];
        }

        function getStatusCode() {
            return $window.sessionStorage['statusCode'];
        }

        function getMessageError() {
        	var listMessage = JSON.parse($window.sessionStorage['listMessageError']);
            return listMessage;
        }

        function setMessageError(listMessage) {
        	$window.sessionStorage['listMessageError'] = JSON.stringify(listMessage);
        }

        function delStatusCode() {
            $window.sessionStorage.removeItem('statusCode');
        }

        function isShowError() {
            var error = $window.sessionStorage['listStatusCode'];
            if (error) {
                return true;
            } else {
                return false;
            }
        }

        function getDescriptionError(key) {
        	var obj = {
        		"-1":"An error has ocurred and the Web Master has been notified. Try again later.",
        		"1":"An error has ocurred and the Web Master has been notified. Try again later.",
        		"2":"Please enter your user id.",
        		"3":"Please enter your password.",
        		"4":"Please enter your space.",
        		"5":"User Id must have four (4) or more characters.",
        		"6":"Password must have four (4) or more characters.",
        		"7":"User id cannot start with a number or blank space, have special characters or quotation marks.",
        		"8":"Password cannot start with a number or blank space, have special characters or quotation marks.",
        		"9":"User id cannot start with a number or blank space, have special characters or quotation marks.",
        		"10":"Password cannot start with a number or blank space, have special characters or quotation marks.",
        		"11":"Please enter your first and last name.",
        		"12":"New password and its confirmation do not match.",
        		"13":"Answer and its confirmation do not match.",
        		"14":"Approval and its confirmation do not match.",
        		"401":"ActivedSession",
        		"10030":"Database transaction could not be initiated during security verification. Notify the solution master.",
        		"10060":"Session information could not be accessed during security verification. Notify the solution master.",
        		"10080":"Session information could not be updated during security verification. Notify the solution master.",
        		"10100":"License information could not be accessed during security verification. Notify the solution master.",
        		"10110":"License information could not be updated during security verification. Notify the solution master.",
        		"10120":"Licensed space definition does not match registry entry. Notify the solution master.",
        		"10130":"Maximum number of named users allowed has been exceeded. Notify the solution master.",
        		"10140":"Current licensing type is not supported. Notify the solution master.",
        		"10200":"Maximum number of concurrent users allowed has been exceeded. Try again later. If the problem persists, notify the solution master.",
        		"10300":"Your license has expired",
        		"11000":"Necessary information to store the document in the current process context has not been found. Check the design or the workflow database.",
        		"11010":"Workflow instance has not been stored in database. Check workflow data base.",
        		"11015":"Process instance has not been updated in data base. Check workflow data base.",
        		"11030":"Invalid logic expression has been detected during action processing. Check process design.",
        		"11040":"No recipients where found for role, work load or group connection.",
        		"11050":"No recipients where found for hierchachy or boss connection.",
        		"11060":"No subordinated recipients.",
        		"11070":"No recipients where found for pre-selection connection.",
        		"11080":"Final role for the collector does not match the result of the connection method.",
        		"11090":"Action cannot be performed due to a business rule validation defined for this process. Check data.",
        		"11100":"An specific field in partial dependence does not exist in current document. Check process design.",
        		"11101":"Dependency processing registry could not be executed. Check workflow data base.",
        		"11120":"Recipients needed to complete coordination action have not been assigned.",
        		"11130":"An error has ocurred during agents definition load. Check log file for more details.",
        		"11140":"Question validation, answer determines wrong key.",
            "11141":"The email does not correspond to that associated with the user",
            "11142" :"In the email template to reset the password, the variable IGPASSWORD does not exist",
            "11143":"Error sending mail with new password",
        		"11145":"Approval key does not match register. Try again.",
        		"11150":"Read only document. No action can be performed.",
        		"11160":"Action to perform cannot be done without a selected instance.",
        		"11170":"Current instance is not recommended to perform requested coordination action. Check design.",
        		"11200":"Database transaction could not be initiated during coordination action processing. Try again later or notify solution master if the problem persists.",
        		"11210":"Coordination action could not be completed. Check log file for more details.",
        		"11220":"Business rule or tool execution has failed. Check log file for more details.",
        		"11225":"Tool path not defined. Ask your solution master to check for centralized information or designed tool definition.",
        		"11230":"Waiting status for the current document could not be released in a collector near the process",
        		"11240":"SQL query has failed or it has a wrong definition. Check log file for more detail and/or review design.",
        		"11250":"Agent type or call context not supported.",
        		"11260":"Recipient not found for reject action.",
        		"11270":"Reject action could not be performed from the collector.",
        		"11280":"The document cannot be acquired while being opened by another user",
        		"11290":"A commitment cannot be reassigned if there is an open one.",
        		"11430":"An error has ocurred during business rule processing while saving. Check log file for more details.",
        		"11440":"You have no available processes to initiate workflow.",
        		"11450":"Business rule implemented as COM service could not be executed. Check log file for more details.",
        		"11460":"You have accessed a -view- not granted for your profile. Check your registration with the solution master.",
        		"11500":"Document instance can only be acquired if the document is in transit and pending, not waiting for others, and only if it was opened from a view.",
        		"11420":"Internal process generation problem. It's easy to solve, talk to your solution master to fix it..",
        		"12000":"Problems sending email.",
        		"15011":"Number of concurrent users has been exceeded. This session has been enabled to continue.",
        		"15020":"There is a problem connecting to the database. Notify the solution master.",
        		"15021":"The user code cannot start with numbers.",
        		"15022":"There is no space to access. Notify the solution master",
        		"15023":"Invalid user id and/or password. Please try again.",
        		"15030":"You are not assigned to a role. Notify solution master.",
        		"15050":"Question and answer are not correctly registered. Notify the solution master.",
        		"15060":"Invalid approval key to change question and answer. Try again.",
        		"15070":"Invalid answer to question for approval key change. Try again.",
        		"15090":"Corrupted question and answer register. Specify a new question and answer in customize settings or notify solution master.",
        		"15140":"You already have an established connection. What do you want to do with your previous session?",
        		"15150":"This user has a transaction in progress. Try later",
        		"15160":"Non available information in order to execute pool conection. Notify solution master.",
        		"15200":"Your session has been canceled.",
        		"15220":"Session role has been replaced by another one.",
        		"15300":"The password has expired. You must change it to continue.",
        		"15305":"The password is going to expire soon. To change it, click on profile, and then in the option Change Password",
        		"15310":"The password has a smaller length that the allowed one.",
        		"15320":"The question and answer have expired. You must change it to be able to continue.",
        		"15321":"Please enter your security information and then click Submit",
        		"15325":"This account has been blocked. Contact the solution master.",
        		"15330":"Your password has been assigned by email. You must specify email and answer again.",
        		"15335":"The password must contain at least one number.",
        		"15340":"The password must contain at least one special character.",
        		"15345":"The password must contain at least one lowercase letter.",
        		"15350":"The password must contain at least one uppercase letter.",
        		"15355":"The password has already been used.",
        		"15360":"Is not yet the minimum time to change the password.",
        		"15365":"The user account is locked by maximum number of failed login attempts.",
        		"15400":"Security specification changed, requirements not fulfilled.",
        		"17000":"Process Server could not take work block.",
        		"17060":"Necessary component to load work not found.",
        		"17070":"An operation over a work has been intended while its not opened or created.",
        		"17080":"Instance number could not be generated.",
        		"17100":"Workhas been canceled.",
        		"17110":"No physical directories for attachments are defined. Notify solution master.",
        		"17140":"Attachment requires a description.",
        		"17170":"Resultant file of attaching a binary data could not be saved.",
        		"17180":"Referenced field in business rule is not defined in current context. Check design.",
        		"17200":"Could not open document. Check log file for more details.",
        		"17350":"Document or base instance number could not be generated.",
        		"17360":"You must fulfill listed fields in order to perform action.",
        		"17400":"Document Data XML could not be processed.",
        		"17500":"Document status could not be changed to ended status.",
            "17600":"Error opening the template",
            "17610":"Error saving file",
        		"18010":"Sintax Matrix bad constructed.",
        		"18050":"There is an assigned value in an application in a format that is not supported . Notify the solution master to solve the situation",
        		"19600":"Database error. Check log file for more details.",
        		"19700":"Format error in a solution file (XML). Notify the solution master to check log file for more details.",
        		"19800":"You have no permission to perform this action.",
        		"20000":"Unexpected internal exception. Check log file for more details.",
        		"70010":"We have sent you an e-mail message with your password.",
        		"70020":"Problems on agent execution.",
        		"70030":"Error could not be found.",
        		"70040":"You have no active session.",
        		"70050":"Problems during advance.",
        		"70060":"Operation has ended successfully.",
        		"70070":"Empty value list.",
        		"70080":"Your license will expire in "
        	};
        	return obj[key];
        }
    }

    //Api request handler.
    function processEngine($http, API, $rootScope){
        var isPrimed = false;
        var primePromise;

        //Requests
        var engine = {
            //$environments
            getEnvironments: getEnvironments,
            loadEnvironment:loadEnvironment,
            verifyEnvironment: verifyEnvironment,
            //$sessions
            getSession: getSession,
            postSession: postSession,
            putSession: putSession,
            deleteSession: deleteSession,
            postSessionRc: postSessionRc,
            //services
            getServices: getServices,
            //$tasks
            getTasks: getTasks,
            postGenerarFile:postGenerarFile,
            postGenerarFilePDF:postGenerarFilePDF,
            getTasksVencidos: getTasksVencidos,
            getTasksRiesgo: getTasksRiesgo,
            getTasksVigente: getTasksVigente,
            getTasksBorrador: getTasksBorrador,
            getTasksClasificacion: getTasksClasificacion,
            //seguimiento
            getSegTask: getSegTask,
            getSegGanttTask: getSegGanttTask,
            getSegEmails: getSegEmails,
            getSegContentEmail: getSegContentEmail,
            getSegAnexos: getSegAnexos,
            getSegRelacionados: getSegRelacionados,
            //report/files/colaborar
            getParamReport: getParamReport,
            exeReport: exeReport,
            //profile
            getProfile: getProfile,
            changePassProfile:changePassProfile,
            changePassApprovalProfile:changePassApprovalProfile,
            changeSecurityQuestionProfile:changeSecurityQuestionProfile,
            changeSecurityQuestionInicio:changeSecurityQuestionInicio,
            changeInfoProfile:changeInfoProfile,
            recoverPass: recoverPass,
            validateQuestionEmail:validateQuestionEmail,
            //context
            getMenuFile:getMenuFile,
            getMenuColaborar:getMenuColaborar,
            getMenuReport:getMenuReport,
            getEmails:getEmails,
            //document
            createDocument: createDocument,
            openDocument: openDocument,
            getDocument: getDocument,
            saveFormDocument: saveFormDocument,
            saveDocument: saveDocument,
            closeDocument: closeDocument,
            ejecEventAgent: ejecEventAgent,
            ejecAgent:ejecAgent,
            resolveListEventAgent:resolveListEventAgent,
            destinationsDocument:destinationsDocument,
            appendDestinationDocument:appendDestinationDocument,
            sendDocument:sendDocument,
            objectDocument:objectDocument,
            cancelDocument:cancelDocument,
            acquireDocument:acquireDocument,
            recoverDocument:recoverDocument,
            openDocumentRead: openDocumentRead,
            closeDocumentRead: closeDocumentRead,
            getDocumentRead: getDocumentRead,
            attachedDocument:attachedDocument,
            marckAttachedDocument:marckAttachedDocument,
            getAgentsGenerals:getAgentsGenerals,
            postGenerarFileReporte:postGenerarFileReporte,
            postGenerarFileReporteIreport:postGenerarFileReporteIreport,
            getDataServices:getDataServices,
            getLogsDatos:getLogsDatos,
        		getLogsTraza:getLogsTraza,
        		getLogsTrazaSql:getLogsTrazaSql,
            getLogsTrazaEmail:getLogsTrazaEmail,
            getLogsTrazaRobot:getLogsTrazaRobot,
            getConsole:getConsole,
            putConsoleObj:putConsoleObj
        };

        return engine;

        //$environments
        function getEnvironments() {
        	return $http.get(API + '/admin/environments').then(getEnvironmentsComplete);
            	//.catch(getEnvironmentsFailed);

            function getEnvironmentsComplete(response) {
                return response.data;
            }

            function getEnvironmentsFailed(error) {
                console.log('Get Environments Failed.' + error.data)
            }
        }

        function loadEnvironment(name) {
            return $http.get(API + '/admin/environments/load?name=' + name)
            .then(loadEnvironmentComplete);
            //.catch(loadEnvironmentFailed);

	         function loadEnvironmentComplete(response) {
	             return response.data;
	         }

	         function loadEnvironmentFailed(error) {
	        	 return error.data;
	         }
        }

        function verifyEnvironment(serverName) {
        	return $http.get(API + '/environments/' + serverName).then(verifyEnvironmentComplete);
                //.catch(verifyEnvironmentFailed);

            function verifyEnvironmentComplete(response) {
                if (response.data === true) {
                    return true;
                } else {
                    return false;
                }
            }

            function verifyEnvironmentFailed(error) {
                console.log('Nof Found');
                return error;
            }
        }

        //$sessions
        function getSession(user) {
            return $http.get(API + '/sessions/'+user.envi+'/sc/'+user.sc,
            {
                headers: {
                    'Authorization': 'Basic ' + btoa(user.name + ':' + user.pass)
                }
            })
                .then(getSessionComplete);
                //.catch(getSessionFailed);

            function getSessionComplete(response){
                return response.data;
            }

            function getSessionFailed(error) {
                return error.data;
            }
        }

        function postSession(vm) {
            return $http.post(API + '/sessions/'+vm.selectedOption.name,
                '', {
                    headers: {
                        'Authorization': 'Basic ' + btoa(vm.user.name + ':' + vm.user.pass)
                    }
                })
                .then(postSessionComplete);
            //.catch(postSessionFailed);

            function postSessionComplete(response) {
                return response.data;
            }

            function postSessionFailed(error) {
                return error.data;
            }

        }

        function putSession(user) {
            return $http.put(API + '/sessions/'+user.envi+'/sc/'+user.sc,'',
            {
                headers: {
                    'Authorization': 'Basic ' + btoa(user.name + ':' + user.pass)
                }
            })
                .then(putSessionComplete);
                //.catch(putSessionFailed);

            function putSessionComplete(response) {
                return response.data;
            }

            function putSessionFailed(error) {
                return error.data
            }
        }

        function deleteSession() {
        	return $http.delete(API + '/sessions')
            .then(deleteSessionComplete);
            //.catch(deleteSessionFailed);

            function deleteSessionComplete(response) {
                return response.data;
            }

            function deleteSessionFailed(error) {
                console.log('Failed to delete session.' + error.data);
            }

        }

        function postSessionRc(vm) {
            return $http.post(API + '/sessions/rc/'+vm.selectedOption.name,
                '', {
                    headers: {
                        'Authorization': 'Basic ' + btoa(vm.user.name + ':' + vm.user.pass)
                    }
                })
                .then(postSessionComplete);
            //.catch(postSessionFailed);

            function postSessionComplete(response) {
                return response.data;
            }

            function postSessionFailed(error) {
                return error.data;
            }

        }

        //$tasks
        function getTasks(vm) {
            return $http.get(API + '/cesta?tipo=' + vm.typeTask + '&desde=' + vm.desdeTask + '&nudoc=' + vm.nuDocSearch + '&detalle=' + vm.detailSearch + '&feini=' + vm.dateIniSearch + '&fefin=' + vm.dateFinSearch + '&wfp=' + vm.wfpSearch + '&wfa=' + vm.wfaSearch)
             .then(getTasksComplete);
             //.catch(getTasksFailed);

	         function getTasksComplete(response) {
	             return response.data;
	         }

	         function getTasksFailed(error) {
	             console.log("Failed to get tasks" + error.data);
	         }
        }

        function postGenerarFile(vm) {
            return $http.post(API + '/generarReporte',vm.gArch)
             .then(postGenerarFileComplete);
             //.catch(getTasksFailed);

           function postGenerarFileComplete(response) {
               return response.data;
           }

           function postGenerarFailed(error) {
               console.log("Generate file error:" + error.data);
           }
        }

        function postGenerarFilePDF(vm){
          return $http.post(API + '/generarReporte/ireport?nombreForm='+vm.docData.nb_conversacion+'&wfa='+vm.docData.wfa+"&ambiente="+$rootScope.nbAmbiente,vm.gArch)
           .then(postGenerarFilePDFComplete);
           //.catch(getTasksFailed);
           function postGenerarFilePDFComplete(response) {
               return response.data;
           }
        }

        function postGenerarFileReporte(vm) {
            return $http.post(API + '/generarReporte/consulta?wfp='+ vm.wfp +'&wfh=' + vm.wfh + '&tipo=' + vm.tipo + '&desde=' + vm.from + '&order=' + vm.order,vm.paramsData)
            //return $http.post(API + '/generarReporte/ireportConsulta?wfp='+ vm.wfp +'&wfh=' + vm.wfh + '&tipo=' + vm.tipo + '&desde=' + vm.from + '&order=' + vm.order+ '&ext='+vm.ext+"&ambiente="+$rootScope.nbAmbiente,vm.paramsData)
	        	.then(postGenerarFileReporteComplete);
	        	//.catch(getParamReportFailed);

		        function postGenerarFileReporteComplete(response){
		            return response.data;
		        }

		        function postGenerarFileReporteFailed(error) {
		            return error.data;
		        };

        }

        function postGenerarFileReporteIreport(vm) {
            //return $http.post(API + '/generarReporte/consulta?wfp='+ vm.wfp +'&wfh=' + vm.wfh + '&tipo=' + vm.tipo + '&desde=' + vm.from + '&order=' + vm.order,vm.paramsData)
            return $http.post(API + '/generarReporte/ireportConsulta?wfp='+ vm.wfp +'&wfh=' + vm.wfh + '&tipo=' + vm.tipo + '&desde=' + vm.from + '&order=' + vm.order+ '&ext='+vm.ext+"&ambiente="+$rootScope.nbAmbiente,vm.paramsData)
	        	.then(postGenerarFileReporteIreportComplete);
	        	//.catch(getParamReportFailed);

		        function postGenerarFileReporteIreportComplete(response){
		            return response.data;
		        }

		        function postGenerarFileReporteIreportFailed(error) {
		            return error.data;
		        };

        }

        function getTasksVencidos(vm) {
            return $http.get(API + '/cesta/vencidos?tipo=' + vm.typeTask)
             .then(getTasksVencidosComplete);
             //.catch(getTasksVencidosFailed);

	         function getTasksVencidosComplete(response) {
	             return response.data;
	         }

	         function getTasksVencidosFailed(error) {
	             console.log("Failed to get tasks vencidos" + error.data);
	         }
        }

        function getTasksRiesgo(vm) {
            return $http.get(API + '/cesta/riesgo?tipo=' + vm.typeTask)
             .then(getTasksRiesgoComplete);
             //.catch(getTasksRiesgoFailed);

	         function getTasksRiesgoComplete(response) {
	             return response.data;
	         }

	         function getTasksRiesgoFailed(error) {
	             console.log("Failed to get tasks en riesgo" + error.data);
	         }
        }

        function getTasksVigente(vm) {
            return $http.get(API + '/cesta/vigente?tipo=' + vm.typeTask)
             .then(getTasksVigenteComplete);
             //.catch(getTasksVigenteFailed);

	         function getTasksVigenteComplete(response) {
	             return response.data;
	         }

	         function getTasksVigenteFailed(error) {
	             console.log("Failed to get tasks vigente" + error.data);
	         }
        }

        function getTasksBorrador(vm) {
            return $http.get(API + '/cesta/borrador?tipo=' + vm.typeTask)
             .then(getTasksBorradorComplete);
             //.catch(getTasksBorradorFailed);

	         function getTasksBorradorComplete(response) {
	             return response.data;
	         }

	         function getTasksBorradorFailed(error) {
	             console.log("Failed to get tasks borrador" + error.data);
	         }
        }

        function getTasksClasificacion(vm) {
            return $http.get(API + '/cesta/clasificacion?numcla=' + vm.numCla)
             .then(getTasksClasificacionComplete);
             //.catch(getTasksClasificacionFailed);

	         function getTasksClasificacionComplete(response) {
	             return response.data;
	         }

	         function getTasksClasificacionFailed(error) {
	             console.log("Failed to get tasks borrador" + error.data);
	         }
        }

        //seguimiento
        function getSegTask(vm){
            return $http.get(API + '/cesta/seguimiento?tipo='+ vm.tipoSeg +'&nudoc=' + vm.taskId)
            	.then(getSegTaskComplete);
            	//.catch(getSegTaskFailed);

		        function getSegTaskComplete(response){
		            return response.data;
		        }

		        function getSegTaskFailed(error) {
		            return error.data;
		        };
        }

        function getSegGanttTask(vm){
            return $http.get(API + '/cesta/seguimientogantt?tipo='+ vm.tipoSeg +'&nudoc=' + vm.taskId)
            	.then(getSegGanttTaskComplete);
            	//.catch(getSegGanttTaskFailed);

		        function getSegGanttTaskComplete(response){
		            return response.data;
		        }

		        function getSegGanttTaskFailed(error) {
		            return error.data;
		        };
        }

        function getSegEmails(vm){
            return $http.get(API + '/email/seg?nudoc='+ vm.taskId +'&desde=0&opc=0')
            	.then(getSegEmailsComplete);
            	//.catch(getSegEmailsFailed);

		        function getSegEmailsComplete(response){
		            return response.data;
		        }

		        function getSegEmailsFailed(error) {
		            return error.data;
		        };
        }

        function getSegContentEmail(vm){
            return $http.get(API + '/email/' + vm.nuMens + '/content')
            	.then(getSegContentEmailComplete);
            	//.catch(getSegContentEmailFailed);

		        function getSegContentEmailComplete(response){
		            return response.data;
		        }

		        function getSegContentEmailFailed(error) {
		            return error.data;
		        };
        }

        function getSegAnexos(vm){
            return $http.get(API + '/cesta/seguimiento/anexos?nudoc=' + vm.taskId)
            	.then(getSegAnexosComplete);
            	//.catch(getSegAnexosFailed);

		        function getSegAnexosComplete(response){
		            return response.data;
		        }

		        function getSegAnexosFailed(error) {
		            return error.data;
		        };
        }

        function getSegRelacionados(vm){
            return $http.get(API + '/cesta/seguimiento/relacionados?nudoc=' + vm.taskId)
            	.then(getSegRelacionadosComplete);
            	//.catch(getSegRelacionadosFailed);

		        function getSegRelacionadosComplete(response){
		            return response.data;
		        }

		        function getSegRelacionadosFailed(error) {
		            return error.data;
		        };
        }

        //Report/Files/Colaborar
        function getParamReport(vm){
            return $http.get(API + '/report/param?wfp='+ vm.wfp +'&wfh=' + vm.wfh)
            	.then(getParamReportComplete);
            	//.catch(getParamReportFailed);

		        function getParamReportComplete(response){
		            return response.data;
		        }

		        function getParamReportFailed(error) {
		            return error.data;
		        };
        }

        function exeReport(vm){
            return $http.post(API + '/report/exe?wfp='+ vm.wfp +'&wfh=' + vm.wfh + '&tipo=' + vm.tipo + '&desde=' + vm.from + '&order=' + vm.order+'&ambiente='+$rootScope.nbAmbiente,vm.paramsData)
	        	.then(getParamReportComplete);
	        	//.catch(getParamReportFailed);

		        function getParamReportComplete(response){
		            return response.data;
		        }

		        function getParamReportFailed(error) {
		            return error.data;
		        };
        }

        //$profile
        function getProfile() {
            return $http.get(API + '/user')
                        .then(getProfileComplete);
                        //.catch(getProfileFailed);

                    function getProfileComplete(response){
                        $rootScope.admUsr = response.data.admusr;
                        return response.data;
                    }

                    function getProfileFailed(error) {
                        return error.data;
                    };
        }

        function changePassProfile(vm) {
            return $http.put(API + '/user/updatesecurity?ctx=2&clave1=' + vm.user.oldpass +'&clave2=' + vm.user.pass)
                        .then(changePassProfileComplete);
                        //.catch(changePassProfileFailed);

                    function changePassProfileComplete(response){
                        return response.data;
                    }

                    function changePassProfileFailed(error) {
                        return error.data;
                    }
        }

        function changeInfoProfile(vm) {
            return $http.put(API + '/user/updatedata?name=' + vm.profile.nombre +'&email=' + vm.profile.email+'&apellido='+vm.profile.apellido)
                        .then(changeInfoProfileComplete);
                        //.catch(changeInfoProfileFailed);

                    function changeInfoProfileComplete(response){
                        return response.data;
                    }

                    function changeInfoProfileFailed(error) {
                        return error.data;
                    }
        }

        function changePassApprovalProfile(vm) {
            return $http.put(API + '/user/updatesecurity?ctx=0&clave1=' + vm.profile.pregunta + '&clave2=' +  vm.user.answer  + '&clave3=' + vm.user.approval )
                        .then(changePassApprovalProfileComplete);
                        //.catch(changePassApprovalProfileFailed);

                    function changePassApprovalProfileComplete(response){
                        return response.data;
                    }

                    function changePassApprovalProfileFailed(error) {
                        return error.data;
                    }
        }

        function changeSecurityQuestionProfile(vm) {
            return $http.put(API + '/user/updatesecurity?ctx=1&clave1=' + vm.user.approval + '&clave2=' + vm.user.question + '&clave3=' + vm.user.answer )
                        .then(changeSecurityQuestionProfileComplete);
                        //.catch(changeSecurityQuestionProfileFailed);

                    function changeSecurityQuestionProfileComplete(response){
                        return response.data;
                    }

                    function changeSecurityQuestionProfileFailed(error) {
                        return error.data;
                    }
        }

        function changeSecurityQuestionInicio(vm) {
            return $http.put(API + '/user/updatesecurity?ctx=1&clave1=' + vm.user.approval + '&clave2=' + vm.user.question + '&clave3=' + vm.user.answer)
                        .then(changeSecurityQuestionProfileComplete);
                        //.catch(changeSecurityQuestionProfileFailed);

                    function changeSecurityQuestionProfileComplete(response){
                        return response.data;
                    }

                    function changeSecurityQuestionProfileFailed(error) {
                        return error.data;
                    }
        }
        function recoverPass(vm) {
            return $http.post(API + '/user/rc?email=' + vm.user.email + '&prg=' + vm.user.question + '&resp=' + vm.user.answer)
                        .then(recoverPassComplete);
                        //.catch(recoverPassFailed);

                    function recoverPassComplete(response){
                        return response.data;
                    }

                    function recoverPassFailed(error) {
                        return error.data;
                    }
        }
        function validateQuestionEmail(vm) {
            return $http.post(API + '/user/vpe?email=' + vm.user.email + '&prg=' + vm.user.question + '&resp=' + vm.user.answer)
                        .then(validateQuestionEmailComplete);
                        //.catch(recoverPassFailed);

                    function validateQuestionEmailComplete(response){
                        return response.data;
                    }

                    function validateQuestionEmailFailed(error) {
                        return error.data;
                    }
        }

        //services
        function getServices() {
            return $http.get(API + '/service')
             .then(getServicesComplete);
             //.catch(getServicesFailed);

	         function getServicesComplete(response) {
	             return response.data;
	         }

	         function getServicesFailed(error) {
	             console.log("Failed to get services" + error.data);
	             return error.data;
	         }
        }

        function getMenuColaborar(){
            return $http.get(API + '/colaborar')
                        .then(getMenuColaborarComplete);
                        //.catch(getMenuColaborarFailed);

                    function getMenuColaborarComplete(response){
                        return response.data;
                    }

                    function getMenuColaborarFailed(error) {
                        return error.data;
                    }
        }

        function getMenuFile(){
            return $http.get(API + '/file')
                        .then(getMenuFileComplete);
                        //.catch(getMenuFileFailed);

                    function getMenuFileComplete(response){
                        return response.data;
                    }

                    function getMenuFileFailed(error) {
                        return error.data;
                    }
        }

        function getMenuReport(){
            return $http.get(API + '/report')
                        .then(getMenuReportComplete);
                        //.catch(getMenuReportFailed);

                    function getMenuReportComplete(response){
                        return response.data;
                    }

                    function getMenuReportFailed(error) {
                        return error.data;
                    }
        }

        function getEmails(){
            return $http.get(API + '/email')
                        .then(getEmailsComplete);
                        //.catch(getEmailsFailed);

                    function getEmailsComplete(response){
                        return response.data;
                    }

                    function getEmailsFailed(error) {
                        return error.data;
                    }
        }

        //document
        function createDocument(vm){
            return $http.post(API + '/document/crearDocumento?wfp=' + vm.wfp + '&frmn=' + vm.frmn + '&env=' + $rootScope.nbAmbiente)
            .then(createDocumentComplete);
            //.catch(createDocumentFailed);

	        function createDocumentComplete(response){
	            return response.data;
	        }

	        function createDocumentFailed(error) {
	            return error.data;
	        }
        }

        function openDocument(vm){
            return $http.get(API + '/document/abrir1?nudoc=' + vm.nuDoc + '&nuinst=' + vm.nuInst+ '&wfa=' + vm.wfa + '&env=' + $rootScope.nbAmbiente)
            .then(openDocumentComplete);
            //.catch(openDocumentFailed);

	        function openDocumentComplete(response){
	            return response.data;
	        }

	        function openDocumentFailed(error) {
	            return error.data;
	        }
        }

        function getDocument(vm){
            return $http.get(API + '/document/obtenerDocumento1?frmn=' + vm.frmn)
            .then(getDocumentComplete);
            //.catch(getDocumentFailed);

	        function getDocumentComplete(response){
	            return response.data;
	        }

	        function getDocumentFailed(error) {
	            return error.data;
	        }
        }

        function saveFormDocument(vm) {
            return $http.put(API + '/document/saveform2?frmn='+vm.docData.FORMA.frmn,angular.toJson(vm.docData.FORMA, false))
                .then(saveFormDocumentComplete);
            //.catch(saveFormDocumentFailed);

            function saveFormDocumentComplete(response) {
                return response.data;
            }

            function saveFormDocumentFailed(error) {
                return error.data;
            }

        }

        function saveDocument(observation) {
            return $http.put(API + '/document?observacion='+observation)
                .then(saveDocumentComplete);
            //.catch(saveDocumentFailed);

            function saveDocumentComplete(response) {
                return response.data;
            }

            function saveDocumentFailed(error) {
                return error.data;
            }
        }

        function closeDocument() {
            return $http.delete(API + '/document')
                .then(closeDocumentComplete);
            //.catch(closeDocumentFailed);

            function closeDocumentComplete(response) {
                return response.data;
            }

            function closeDocumentFailed(error) {
                return error.data;
            }
        }

        function ejecEventAgent(vm) {
            return $http.post(API + '/document/ejecutarevento?campo=' + vm.eventCampo + '&fila=' + vm.eventFila)
                .then(ejecEventAgentComplete);
            //.catch(ejecEventAgentFailed);

            function ejecEventAgentComplete(response) {
//            	if (vm.Ajax){
//				    var camposBuscar = {
//							"data" : []
//						};
//                	for(var i in response.data.filas) {
//                	    var item = response.data.filas[i];
//						camposBuscar.data.push({
//							"valor" : item.valores[1],
//							"titulo"  : item.valores[2],
//							"descripcion"       : item.valores[3]
//						});
//                	}
//					return camposBuscar;
//            	}else{
//            		return response.data;
//            	}
            	return response.data;
            }

            function ejecEventAgentFailed(error) {
                return error.data;
            }
        }

        function ejecAgent(vm) {
            return $http.post(API + '/document/ejecutaragente?codigo=' + vm.agentCodigo + '&ctx=' + vm.agentCtx)
                .then(ejecAgentComplete);
            //.catch(ejecAgentFailed);

            function ejecAgentComplete(response) {
                return response.data;
            }

            function ejecAgentFailed(error) {
                return error.data;
            }
        }

        function resolveListEventAgent(vm) {
            return $http.post(API + '/document/resolverlista?campo=' + vm.eventCampo + '&fila=' + vm.eventFila + '&sel=' + vm.eventSelList + '&ctx=' + vm.eventCtx+ '&listSeleccion=' + vm.eventSelListM, vm.eventXml)
                .then(resolveListEventAgentComplete);
            //.catch(resolveListEventAgentFailed);

            function resolveListEventAgentComplete(response) {
                return response.data;
            }

            function resolveListEventAgentFailed(error) {
                return error.data;
            }
        }

        function destinationsDocument(){
            return $http.get(API + '/document/destinos')
            .then(destinationsDocumentComplete);
            //.catch(destinationsDocumentFailed);

	        function destinationsDocumentComplete(response){
	            return response.data;
	        }

	        function destinationsDocumentFailed(error) {
	            return error.data;
	        }
        }

        function appendDestinationDocument(wfa,e,puesto) {
            return $http.post(API + '/document/agregadestino?wfa=' + wfa + '&e=' + e + '&puesto=' + puesto)
                .then(appendDestinationDocumentComplete);
            //.catch(appendDestinationDocumentFailed);

            function appendDestinationDocumentComplete(response) {
                return response.data;
            }

            function appendDestinationDocumentFailed(error) {
                return error.data;
            }
        }

        function sendDocument(firma,pregunta,respuesta,observacion,urgente,email,satisfaccion,copiaemail,frmncopia,destinos) {
            return $http.put(API + '/document/avanzar?firma=' + firma + '&pregunta=' + pregunta + '&respuesta=' + respuesta + '&observacion=' + observacion + '&urgente=' + urgente + '&email=' + email + '&satisfaccion=' + satisfaccion + '&copiaemail=' + copiaemail + '&frmncopia=' + frmncopia, angular.toJson(destinos, false))
                .then(sendDocumentComplete);
            //.catch(sendDocumentFailed);

            function sendDocumentComplete(response) {
                return response.data;
            }

            function sendDocumentDocumentFailed(error) {
                return error.data;
            }
        }

        function objectDocument(observacion,urgente,email,copiaemail,frmncopia) {
            return $http.put(API + '/document/objetar?observacion=' + observacion + '&urgente=' + urgente + '&email=' + email + '&copiaemail=' + copiaemail + '&frmncopia=' + frmncopia)
                .then(objectDocumentComplete);
            //.catch(objectDocumentFailed);

            function objectDocumentComplete(response) {
                return response.data;
            }

            function objectDocumentFailed(error) {
                return error.data;
            }
        }

        function cancelDocument(observacion,email) {
            return $http.put(API + '/document/anular?observacion=' + observacion + '&email=' + email)
                .then(cancelDocumentComplete);
            //.catch(cancelDocumentFailed);

            function cancelDocumentComplete(response) {
                return response.data;
            }

            function cancelDocumentFailed(error) {
                return error.data;
            }
        }

        function acquireDocument(observacion,email) {
            return $http.get(API + '/document/adquirir?observacion=' + observacion + '&email=' + email)
                .then(acquireDocumentComplete);
            //.catch(acquireDocumentFailed);

            function acquireDocumentComplete(response) {
                return response.data;
            }

            function acquireDocumentFailed(error) {
                return error.data;
            }
        }

        function recoverDocument() {
            return $http.get(API + '/document/recuperar')
                .then(recoverDocumentComplete);
            //.catch(recoverDocumentFailed);

            function recoverDocumentComplete(response) {
                return response.data;
            }

            function recoverDocumentFailed(error) {
                return error.data;
            }
        }

        function openDocumentRead(vm){
            return $http.get(API + '/document/abrirlectura1?nudoc=' + vm.nuDoc + '&nuinst=' + vm.nuInst + '&env=' + $rootScope.nbAmbiente)
            .then(openDocumentReadComplete);
            //.catch(openDocumentReadFailed);

	        function openDocumentReadComplete(response){
	            return response.data;
	        }

	        function openDocumentReadFailed(error) {
	            return error.data;
	        }
        }

        function getDocumentRead(vm){
            return $http.get(API + '/document/lectura?frmn=' + vm.frmn)
            .then(getDocumentReadComplete);
            //.catch(getDocumentReadFailed);

	        function getDocumentReadComplete(response){
	            return response.data;
	        }

	        function getDocumentReadFailed(error) {
	            return error.data;
	        }
        }

        function closeDocumentRead() {
            return $http.delete(API + '/document/lectura')
                .then(closeDocumentReadComplete);
            //.catch(closeDocumentReadFailed);

            function closeDocumentReadComplete(response) {
                return response.data;
            }

            function closeDocumentReadFailed(error) {
                return error.data;
            }
        }

        function attachedDocument() {
            return $http.get(API + '/document/anexos')
                .then(attachedDocumentComplete);
            //.catch(attachedDocumentFailed);

            function attachedDocumentComplete(response) {
                return response.data;
            }

            function attachedDocumentFailed(error) {
                return error.data;
            }
        }

        function marckAttachedDocument(anexos,borrado) {
            return $http.put(API + '/document/marcaranexo?borrado=' + borrado, angular.toJson(anexos, false))
                .then(marckAttachedDocumentComplete);
            //.catch(marckAttachedDocumentFailed);

            function marckAttachedDocumentComplete(response) {
                return response.data;
            }

            function marckAttachedDocumentFailed(error) {
                return error.data;
            }
        }

        function getAgentsGenerals() {
            return $http.get(API + '/document/agentesgenerales')
                .then(getAgentsGeneralsComplete);
            //.catch(getAgentsGeneralsFailed);

            function getAgentsGeneralsComplete(response) {
                return response.data;
            }

            function getAgentsGeneralsFailed(error) {
                return error.data;
            }
        }

        function getDataServices(ambiente, idQuery, param) {

            return $http.post(API + '/admin/dataServices?ambiente='+ambiente+'&idQuery='+idQuery,param)
                .then(getDataServicesComplete);

            function getDataServicesComplete(response) {
                return response.data;
            }
        }

        /*Servicios para consulta de logs y Admnitracion de console.*/
       /*Logs*/
       function getLogsDatos(ambiente) {

           return $http.get(API + '/logs?ambiente='+ $rootScope.nbAmbiente)
               .then(getLogsDatosComplete);

           function getLogsDatosComplete(response) {
               return response.data;
           }
       }
       function getLogsTraza(fecha, usuario ) {

           return $http.get(API + '/logs/getTraza?ambiente='+ $rootScope.nbAmbiente+'&fecha='+fecha+'&usuario='+usuario)
               .then(getLogsTrazaComplete);

           function getLogsTrazaComplete(response) {
               return response.data;
           }
       }

       function getLogsTrazaSql( fecha, usuario ) {

           return $http.get(API + '/logs/getTrazasql?ambiente='+ $rootScope.nbAmbiente+'&fecha='+fecha+'&usuario='+usuario)
               .then(getLogsTrazaSqlComplete);

           function getLogsTrazaSqlComplete(response) {
               return response.data;
           }
       }

       function getLogsTrazaEmail( fecha, usuario ) {

           return $http.get(API + '/logs/getTrazaEmail?ambiente='+ $rootScope.nbAmbiente+'&fecha='+fecha+'&usuario='+usuario)
               .then(getLogsTrazaEmailComplete);

           function getLogsTrazaEmailComplete(response) {
               return response.data;
           }
       }

       function getLogsTrazaRobot( fecha, usuario ) {

           return $http.get(API + '/logs/getTrazaRobot?ambiente='+ $rootScope.nbAmbiente+'&fecha='+fecha+'&usuario='+usuario)
               .then(getLogsTrazaRobotlComplete);

           function getLogsTrazaRobotlComplete(response) {
               return response.data;
           }
       }


       /*Console*/
       function getConsole(){
         return $http.get(API + '/console?ambiente='+$rootScope.nbAmbiente)
          .then(getConsoleComplete);
            function getConsoleComplete(response){
              return response.data;
            }
       }

       function putConsoleObj(registro, nameObj){
         return $http.put(API + '/console/update?ambiente=' + $rootScope.nbAmbiente +'&nameObj=' + nameObj,registro )
                     .then(putConsoleComplete);
           function putConsoleComplete(response){
               return response.data;
           }
       }

    }


})();
