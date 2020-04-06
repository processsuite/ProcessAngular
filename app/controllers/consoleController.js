(function () {
    'use strict';
    angular
    .module('myApp')
    .controller('ConsoleController', ConsoleController);

    //goAdm
    ConsoleController.$inject = ['processEngine', '$scope', '$rootScope','$filter'];
    function ConsoleController(processEngine, $scope, $rootScope, $filter){
      var vm = this;
      vm.ambiente = $rootScope.nbAmbiente;
      vm.administrador = {};
      vm.configuracion = {};
      vm.correo = {};
      vm.dirInternet = {};
      vm.fuenteDatos = {};
      vm.inspeccion = {};
      vm.repFisico = {};
      vm.seguridad = {};
      vm.consultoria = {};
      vm.stringToBoolean = stringToBoolean;
      vm.varAmbiente = {};
      /*agregar variable de ambiente*/
      vm.addRowVar = {}
      vm.addRowAmbiente = addRowAmbiente;
      /*Evento guardar*/
      vm.modificarDatos = modificarDatos;
      /*transformar valor en true o false*/
      vm.getValue = getValue;
      vm.setValor = setValor;

      function getConsole(){
        return processEngine.getConsole()
        .then(function (data) {
             console.log(data)
           vm.administrador = data.administrador;
           vm.configuracion = data.configuracion;
           vm.correo = data.email;
           vm.dirInternet = data.direcInternet;
           vm.fuenteDatos = data.fuenteDatos;
           vm.inspeccion = data.inspeccion;
           vm.repFisico = data.repFisico;
           vm.seguridad = data.seguridad;
           vm.varAmbiente = data.varAmbiente
        });
      }
      getConsole();

      function stringToBoolean(string){
        let boolean = false;
        boolean = (string=="true")
        return boolean;
      }

      function addRowAmbiente(){
        console.log(vm.addRowVar);
        vm.addRowVar.lectura = "false";
        vm.addRowVar.type = "T";
        vm.addRowVar.valorDef = "";
        if(vm.addRowVar.id != undefined && vm.addRowVar.descrip != undefined && vm.addRowVar.value != undefined){
          if(vm.varAmbiente === undefined){
            vm.varAmbiente = {}
            vm.varAmbiente.item = [];
          }
          vm.varAmbiente.item.push(vm.addRowVar)
          vm.addRowVar = {};
        }else{
          alertmb("<p class='text-danger'>Debe llenar todos los atributos para agregar Variable</p>",1,1,"Aceptar")
        }
      }

      function modificarDatos(obj, nameObj){
        let registro = {};


        switch (nameObj) {
    			case "Administrador":
            registro.administrador = obj;
    				break;
    			case "Configuracion":
            registro.configuracion = obj;
    				break;
    			case "DirecInternet":
            registro.direcInternet = obj;
    				break;
    			case "Email":
            registro.email = obj;
    				break;
    			case "FuenteDatos":
            registro.fuenteDatos = obj;
    				break;
    			case "Inspeccion":
            registro.inspeccion = obj;
            console.log(obj)
    				break;
    			case "RepFisico":
            registro.repFisico = obj;
    				break;
    			case "Seguridad":
            registro.seguridad = obj;
    				break;
    			case "VarAmbiente":
            registro.varAmbiente = obj;
    				break;
    			default:
    				break;
			}

        return processEngine.putConsoleObj(registro, nameObj)
              .then(function (data) {
                console.log(data)
                if(data == true){
                    alertmb("<p class='text-success'>Actualización realizada con exito</p>",1,1,"Aceptar")
                    $state.go('root.main',{},{reload:'root.main'});
                }else{
                    alertmb("<p class='text-danger'>Error en realizar actualización, notifique al administrador</p>",1,1,"Aceptar")
                }

            });
      }

      function getValue(field){
          for(let i in field.opciones.opcion){
            if(field.opciones.opcion[i].valor == "1"){
              field.opciones.opcion[i].checked = true;
            }else{
              field.opciones.opcion[i].checked = false;
            }
          }
          return field;
      }

      function setValor(opcion){
        if(opcion.checked == true){
          opcion.valor = "1";
        }else{
          opcion.valor = "0";
        }
        return opcion;
      }
    } /*fin de console controller*/
})();
