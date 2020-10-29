(function () {
    'use strict';

   var myApp = angular.module('myApp', [
        'ui.router',
        'ui.bootstrap',
        'smart-table',
        'ngProcess',
        'gettext',
        'blockUI',
        'gantt',
        'gantt.table',
        'chart.js',
        //'ui.utils.masks',
        'ui.mask',
        'angularFileUpload',
        'angucomplete-alt',
        'ngSanitize',
        'ui.multiselect',
        'inform',
        'ngAnimate',
        'ngTouch',
        'ngIdle'
    ]);

   myApp.run(function (gettextCatalog, $rootScope, ticketService, documentService, $state, $window) {
	    $rootScope.$state = $state;
	    gettextCatalog.currentLanguage = 'es';
	    $rootScope.ticketService = ticketService;
	    $rootScope.documentService = documentService;
	    $rootScope.nbAmbiente = '';
	    $window.formatDate = 'dd/mm/yyyy';

	    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
	        if ((toState.name === "root.main.documentopen")||(toState.name === "root.main.documentcreate")) {
  	    		$rootScope.fromStateToDoc = fromState.name;
  	    		$rootScope.fromParamFilter = fromParams.filter;//only case task
  	    		$rootScope.fromParamWfp = fromParams.wfp;//only case reports
  	    		$rootScope.fromParamWfh = fromParams.wfh;//only case reports
  	    		$rootScope.fromParamName = fromParams.name;//only case reports
	        }
	      });

   });

   myApp.config(function(blockUIConfig, KeepaliveProvider, IdleProvider) {
	   //blockUIConfig.autoInjectBodyBlock = false;
	   blockUIConfig.template = "<div class='block-ui-overlay'><img src='app/images/spinner2.gif' width='60px'></div>";
     IdleProvider.idle(600); //Intervalo de tiempo para detectar inactividad
     IdleProvider.timeout(60); // intervalo de tiempo de timeout para reactivar session
     KeepaliveProvider.interval(20); //Intervalo de tiempo despues de la reactivacion
   });


})();
