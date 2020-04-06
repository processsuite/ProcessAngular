(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['processEngine', 'user','$state', '$location','$scope', '$stateParams', '$rootScope', '$timeout'];

    function SidebarController(processEngine, user, $state, $location, $scope, $stateParams,$rootScope, $timeout) {
        var vm = this;
        vm.user = { name: "", pass: "", envi: "", email: "", question:"" };
        vm.isShowMenuFile = false;
        vm.isShowMenuReport = false;
        vm.isShowMenuColaborar = false;
        vm.goReport = goReport;
        vm.goTask = goTask;
        vm.goFiles = goFiles;
        vm.goColaboration = goColaboration;
        vm.menuFile = [];
        vm.menuColaboration = [];
        vm.response = {};
        vm.showInfo = false;
        vm.msg = $stateParams.msg;
        vm.goServices = goServices;
        vm.nuDocLect = 'N';
        /*admin*/
        //  vm.admUsr = true;
        //vm.admUsr = $rootScope.admUsr;
        vm.goLogs = goLogs;
        vm.goAdm = goAdm;

        activate();

        function goServices(){
          if($scope.documentService.isOpenDoc()){
              var arrayDoc = $scope.documentService.getCtxOpenDoc();
                if (!arrayDoc[3]){//no read
                      $scope.documentService.save('')
                      .then(function (data) {
                        $scope.documentService.putNewDocument();
                         $state.go('root.main.service',{},{reload:'root.main.service'});
                      });
                }else{
                    $scope.documentService.close();
                    $state.go('root.main.service',{},{reload:'root.main.service'});
                }
          }else{
              $state.go('root.main.service',{},{reload:'root.main.service'});
          }
        }

        function goReport(wfp,wfh,name){
        	if($scope.documentService.isOpenDoc()){
              var arrayDoc = $scope.documentService.getCtxOpenDoc();
                if (!arrayDoc[3]){//no read
                      $scope.documentService.save('')
                      .then(function (data) {
                         $scope.documentService.putNewDocument();
                         $state.go('root.main.report', { 'wfp': wfp, 'wfh': wfh, 'name': name },{reload:'root.main.report'});
                      });
                }else{
                    $scope.documentService.close();
                    $state.go('root.main.report', { 'wfp': wfp, 'wfh': wfh, 'name': name },{reload:'root.main.report'});
                }
          }else{
              $state.go('root.main.report', { 'wfp': wfp, 'wfh': wfh, 'name': name },{reload:'root.main.report'});
          }
        }

        function goTask(filter, serverSide){
          if($scope.documentService.isOpenDoc()){
              var arrayDoc = $scope.documentService.getCtxOpenDoc();
                if (!arrayDoc[3]){//no read
                      $scope.documentService.save('')
                      .then(function (data) {
                        $scope.documentService.putNewDocument();
                        $state.go('root.main.task', { 'filter': filter, 'serverSide': serverSide},{reload:'root.main.task'});
                      });
                }else{
                    $scope.documentService.close();
                    $state.go('root.main.task', { 'filter': filter, 'serverSide': serverSide},{reload:'root.main.task'});
                }
          }else{
              $state.go('root.main.task', { 'filter': filter, 'serverSide': serverSide},{reload:'root.main.task'});
          }
        }

        function goFiles(wfp,wfh,name){
          if($scope.documentService.isOpenDoc()){
              var arrayDoc = $scope.documentService.getCtxOpenDoc();
                if (!arrayDoc[3]){//no read
                      $scope.documentService.save('')
                      .then(function (data) {
                         $scope.documentService.putNewDocument();
                         $state.go('root.main.files', { 'wfp': wfp, 'wfh': wfh, 'name': name },{reload:'root.main.files'});
                      });
                }else{
                    $scope.documentService.close();
                    $state.go('root.main.files', { 'wfp': wfp, 'wfh': wfh, 'name': name },{reload:'root.main.files'});
                }
          }else{
              $state.go('root.main.files', { 'wfp': wfp, 'wfh': wfh, 'name': name },{reload:'root.main.files'});
          }
        }

        function goColaboration(wfp,wfh,name){
          if($scope.documentService.isOpenDoc()){
              var arrayDoc = $scope.documentService.getCtxOpenDoc();
                if (!arrayDoc[3]){//no read
                      $scope.documentService.save('')
                      .then(function (data) {
                         $scope.documentService.putNewDocument();
                         $state.go('root.main.colaboration', { 'wfp': wfp, 'wfh': wfh, 'name': name },{reload:'root.main.colaboration'});
                      });
                }else{
                    $scope.documentService.close();
                    $state.go('root.main.colaboration', { 'wfp': wfp, 'wfh': wfh, 'name': name },{reload:'root.main.colaboration'});
                }
          }else{
              $state.go('root.main.colaboration', { 'wfp': wfp, 'wfh': wfh, 'name': name },{reload:'root.main.colaboration'});
          }
        }

        function activate() {
        	$scope.ticketService.resetListError();
			if ($scope.ticketService.isAuthed()){
				loadContext();
			}
        }

        function loadContext() {
        	getMenuColaborar();
        	getMenuFile();
        	getMenuReport();

        }

        function getMenuColaborar() {
            return processEngine.getMenuColaborar()
            .then(function (respuesta) {
            	if (respuesta!=null){
            		if(respuesta==''){
            			vm.isShowMenuColaborar = false;
            		}else{
                		vm.isShowMenuColaborar = true;
                		vm.menuColaboration = respuesta;
            		}
            	}
            });
        }

        function getMenuFile() {
            return processEngine.getMenuFile()
            .then(function (respuesta) {
            	if (respuesta!=null){
            		if(respuesta==''){
            			vm.isShowMenuFile = false;
            		}else{
                		vm.isShowMenuFile = true;
                		vm.menuFile = respuesta;
            		}
            	}
            });
        }

        function getMenuReport() {
            return processEngine.getMenuReport()
            .then(function (respuesta) {
            	if (respuesta!=null){
                   	if(respuesta==''){
            			vm.isShowMenuReport = false;
            		}else{
                		vm.isShowMenuReport = true;
                		vm.menuReport = respuesta;
            		}
            	}
            });
        }

        function goLogs(main){
          $rootScope.viewLogs = '';
          switch (main) {
            case 'usuario':
                $rootScope.viewLogs = 'usuario';
                $state.go('root.main.logs',{},{reload:true});
              break;
            case 'email':
              $rootScope.viewLogs = 'email';
              $state.go('root.main.email',{},{reload:true});
              break;
              case 'evento':
                $rootScope.viewLogs = 'evento';
                $state.go('root.main.event',{},{reload:true});
                break;
            default:

          }


        }

        function goAdm(uri){
          $state.go('root.main.'+uri,{},{reload:true});
        }
    }
})();
