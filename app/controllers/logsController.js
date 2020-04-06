(function () {
    'use strict';
    angular
    .module('myApp')
    .controller('LogsController', LogsController);

    LogsController.$inject = ['processEngine', '$scope', '$rootScope','$filter'];
    function LogsController(processEngine, $scope, $rootScope, $filter){
        var vm = this;
        vm.datos = {};
        vm.ambiente = $rootScope.nbAmbiente;
        vm.format = "dd/MM/yyyy"
        vm.fecha = "";
        vm.getDatosLogs=getDatosLogs;
        vm.arrayFecha = [];
        vm.disabled = disabled;
        vm.altInputFormats = ['M!/d!/yyyy'];
        vm.obtenerUsuarioFecha = obtenerUsuarioFecha;
        vm.stringFecha = "";
        vm.listUsuario = '';
        vm.listEvent = "";
        vm.listEmail = "";
        vm.userSelect = '';
        vm.getTraza= getTraza;
        vm.resultTraza = {};
        vm.resultTrazaRobot = {};
        vm.resultTrazaEmail = {};
        vm.resultTrazaSql = {};
        vm.getTrazaSql = getTrazaSql;
        vm.itemsByPage=20;
        vm.getTrazaRobot = getTrazaRobot;
        vm.getTrazaEmail = getTrazaEmail;

        function getDatosLogs() {
          return processEngine.getLogsDatos()
          .then(function (data) {
             vm.datos = data;
             getFechasDisponibles(vm.datos);
          });
        }
        getDatosLogs();

        /*fecha*/
        $scope.open1 = function() {
          $scope.popup1.opened = true;
        };

        $scope.popup1 = {
          opened: false
        };

      function getFechasDisponibles(data){
         let dia, mes, anio;
          for(let i in data){
              anio = data[i].fecha.substring(0,4);
              mes = parseInt(data[i].fecha.substring(4,6))-1;
              dia = data[i].fecha.substring(6,8);

              //vm.arrayFecha[i] = dia+"/"+mes+"/"+anio;
              vm.arrayFecha[i] = {fecha :new Date(anio, mes+"", dia), usuario: data[i].usuarios.length, email: data[i].lisEmail.length,event: data[i].listEvent.length}
          }
       }

       function disabled(date, mode) {
         //console.log($rootScope.viewLogs)
         let flag = true;
         for(let i in vm.arrayFecha){
           if(date.getDate() === vm.arrayFecha[i].fecha.getDate() && date.getMonth() === vm.arrayFecha[i].fecha.getMonth() && date.getFullYear() === vm.arrayFecha[i].fecha.getFullYear()){
             switch ($rootScope.viewLogs) {
                case 'usuario':
                  if(vm.arrayFecha[i].usuario > 0){
                    flag =false;
                  }
                  break;
                case 'evento':
                  if(vm.arrayFecha[i].event > 0){
                    flag =false;
                  }
                  break;
                case 'email':
                    if(vm.arrayFecha[i].email > 0){
                      flag =false;
                    }
                  break;
                default:
              }
           }
         }

         return mode === 'day' && flag;
       }

       vm.dateOptions = {
        startingDay: 1,

      };

      function obtenerUsuarioFecha(){
      //  console.log(vm.fecha);
        let dia = vm.fecha.getDate()>9?vm.fecha.getDate().toString():'0'+vm.fecha.getDate().toString();
        let mes = vm.fecha.getMonth()+1;
        let sMes = mes>9?mes.toString():'0'+mes.toString();
        vm.stringFecha = vm.fecha.getFullYear().toString()+sMes+dia;
      //  console.log(vm.stringFecha)
        for(let i in vm.datos){
          if(vm.datos[i].fecha == vm.stringFecha){
        //    console.log(vm.datos[i].fecha)
        //    console.log(vm.datos[i].usuarios)
              vm.listEvent = vm.datos[i].listEvent;
              vm.listEmail = vm.datos[i].lisEmail;
              vm.listUsuario = vm.datos[i].usuarios;
          }
        }
      }
      /*fin de configuracion de fecha*/
      /*traza Logs*/
      function getTraza(){
        if(vm.stringFecha != '' && vm.userSelect != ''){
          alertmb('<p class = "text-warning">Cargando Logs en memoria, puede tardar varios minutos...<p>',1,0,'');
          return processEngine.getLogsTraza(vm.stringFecha, vm.userSelect )
          .then(function (data) {
             vm.resultTraza = data;
          //   console.log(vm.resultTraza);
             if(vm.resultTrazaSql.lenght != 0){
                $('.accion_bot').click()
             }

          });
        }
      }
      //getLogsTrazaSql
      function getTrazaSql(){
        if(vm.stringFecha != '' && vm.userSelect != ''){
          return processEngine.getLogsTrazaSql(vm.stringFecha, vm.userSelect )
          .then(function (data) {
             vm.resultTrazaSql= data;
            // console.log(vm.resultTrazaSql);
             if(vm.resultTraza.lenght != 0){
                $('.accion_bot').click()
             }
          });
        }
      }

      function getTrazaRobot(){

        if(vm.stringFecha != '' && vm.userSelect != ''){
          alertmb('<p class = "text-warning">Cargando Logs en memoria, puede tardar varios minutos...<p>',1,0,'');
          return processEngine.getLogsTrazaRobot(vm.stringFecha, vm.userSelect )
          .then(function (data) {
             vm.resultTrazaRobot= data;
             if(vm.resultTrazaRobot.lenght != 0){
                $('.accion_bot').click()
             }
          });
        }
      }

      function getTrazaEmail(){

        if(vm.stringFecha != '' && vm.userSelect != ''){
          alertmb('<p class = "text-warning">Cargando Logs en memoria, puede tardar varios minutos...<p>',1,0,'');
          return processEngine.getLogsTrazaEmail(vm.stringFecha, vm.userSelect )
          .then(function (data) {
            vm.resultTrazaEmail= data;
            if(vm.resultTrazaEmail.lenght != 0){
               $('.accion_bot').click()
            }
          });
        }
      }


  }
})();
