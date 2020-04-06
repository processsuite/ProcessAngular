MatrizEstatica('MT_PARAM');
OcultarCampo("wl_bguardar",2);
OcultarCampo("anexar_link",2);

asignar_valor("wl_bsolicitar","Registrar lista");
asignar_valor( 'MATNVMT_PARA' , 'Agregar opción');
asignar_valor( 'MATBOMT_PARA' , 'Eliminar opción');

asignar_valor( 'MATNVMT_PARMA' , 'Agregar opción');
asignar_valor( 'MATBOMT_PARMA' , 'Eliminar opción');

CamposObligatorios(["DESNB_CLASE1","DESCLASE2","DESTIPO","M0MT_PARA2","M0MT_PARA3","M0MT_PARA4","M0MT_PARAM2","M0MT_PARAM3","M0MT_PARAM4","M0MT_PARMA2","M0MT_PARMA3","M0MT_PARMA4"]);

$("#CLASE1").change(function(){ 
	asignar_valor('ID_CLASE1',obtener_valor("CLASE1"));
	asignar_valor('NB_CLASE1',obtener_valor("CLASE1",1));

	if (obtener_valor("CLASE1")!="0" && obtener_valor("CLASE1")!="Seleccione")
		$('#evento_CLASE1').click();             

	ocultar();
	return true;
} );

function ocultar(){
	OcultarGrupo('AGREGAR LISTA DE OPCIONES');
	OcultarGrupo('MODIFICAR LISTA DE OPCIONES');
	$('#evento_CLASE1').hide();

	if(obtener_valor("CLASE1")=="0"){
  	   MostrarGrupo('AGREGAR LISTA DE OPCIONES');	   
	}
	else if (obtener_valor("CLASE1")!="0" && obtener_valor("CLASE1")!="Seleccione"){
	   MostrarGrupo('MODIFICAR LISTA DE OPCIONES');	   
	}
	return true;
}
ocultar();

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function enumerar(matriz,sec){
	var i;
	var filas = parseInt(obtener_valor("fil"+matriz)) + parseInt(sec);
	for(i = sec; i < filas;i++){
		asignar_valorM(matriz,i,(i-sec)+1,1);
	}
	return true;
}
enumerar("MT_PARA",1);
enumerar("MT_PARMA",obtener_valor("NEW_ID"));

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
asignar_event("onclick","enumerar('MT_PARA',1)","MATNVMT_PARA");
asignar_event("onclick","enumerar('MT_PARA',1)","MATBOMT_PARA");
asignar_event("onclick","enumerar('MT_PARMA',obtener_valor('NEW_ID'))","MATNVMT_PARMA");
asignar_event("onclick","enumerar('MT_PARMA',obtener_valor('NEW_ID'))","MATBOMT_PARMA");

function habAcciones()
{
	if (obtener_valor("AGREGAR")=="T")
		MostrarCampo("MT_PARMA");
	else	
	    OcultarCampo("MT_PARMA");
	
	if (obtener_valor("MODIFICAR")=="T")
		MostrarCampo("MT_PARAM");
	else	
		OcultarCampo("MT_PARAM");
	
  return true;	
}
habAcciones();
asignar_event("onclick" , "habAcciones()","AGREGAR");
asignar_event("onclick" , "habAcciones()","MODIFICAR");

function validar(){

	if(obtener_valor("CLASE1")=="Seleccione"){
 	   alertmb("Debe indicar una acción , si es una nueva lista o  modificar una lista existente ", 2, 1, "Aceptar");
	   return false;
                }
	//Nueva Clasificación de Parámetros
	if(obtener_valor("CLASE1")=="0"){
		if(obtener_valor("CLASE2")==""){
			alertmb("Debe ingresar un nombre para la lista de opciones que se dispone a crear ", 2, 1, "Aceptar");
			return false;
		}
		var filas = obtener_valor('filMT_PARA');
		for (var i = 1; i <= filas; i++){
			if (obtener_valorM('MT_PARA', i, 2) == ''){	
				alertmb("Debe ingresar un nombre para la opción de la fila " + i, 2, 1, "Aceptar");
				return false;				
			}
			if (obtener_valorM('MT_PARA', i, 3) == ''){	
				alertmb("Debe ingresar un valor para la opción de la fila " + i, 2, 1, "Aceptar");
				return false;				
			}
			if (obtener_valorM('MT_PARA', i, 4) == ''){	
				alertmb("Debe indicar si la opción estará 'Activo' ó 'Inactivo' en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}
			if ((obtener_valorM('MT_PARA', i, 8) == '') && (obtener_valorM('MT_PARA', i, 5) != '')){	
				alertmb("Debe dar click en Buscar para seleccionar la lista padre en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}
			if ((obtener_valorM('MT_PARA', i, 9) == '') && (obtener_valorM('MT_PARA', i, 6) != '')){	
				alertmb("Debe dar click en buscar para seleccionar la opción padre en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}
		}	
	}else{

		if(obtener_valor("NB_CLASE1")==""){
			alertmb("Debe ingresar un nombre para la lista", 2, 1, "Aceptar");
			return false;
		}else{
		  if (obtener_valor("MODIFICAR")=="T")
           {			  
			var filas = obtener_valor('filMT_PARAM');
			for (var i = 1; i <= filas; i++){
				if (obtener_valorM('MT_PARAM', i, 2) == ''){	
					alertmb("Debe ingresar un nombre para la opción de la fila " + i + ", en las opciones a modificar", 2, 1, "Aceptar");
					return false;				
				}
				if (obtener_valorM('MT_PARAM', i, 3) == ''){	
					alertmb("Debe ingresar un valor para la opción de la fila " + i+ ", en las opciones a modificar", 2, 1, "Aceptar");
					return false;				
				}
				if (obtener_valorM('MT_PARAM', i, 4) == ''){	
					alertmb("Debe indicar si la opción estará 'Activo' ó 'Inactivo' en la fila " + i+ ", en las opciones a modificar", 2, 1, "Aceptar");
					return false;				
				}
				if ((obtener_valorM('MT_PARAM', i, 8) == '') && (obtener_valorM('MT_PARAM', i, 5) != '')){	
					alertmb("Debe dar click en Buscar para seleccionar la lista padre en la fila " + i+ ", en las opciones a modificar", 2, 1, "Aceptar");
					return false;				
				}
				if ((obtener_valorM('MT_PARAM', i, 9) == '') && (obtener_valorM('MT_PARAM', i, 6) != '')){	
					alertmb("Debe dar click en buscar para seleccionar la opción padre en la fila " + i+ ", en las opciones a modificar", 2, 1, "Aceptar");
					return false;				
				}
			}
		  }	
		 if (obtener_valor("AGREGAR")=="T")
           {			  
		    var filas = obtener_valor('filMT_PARMA');
			for (var i = 1; i <= filas; i++){
				if (obtener_valorM('MT_PARMA', i, 2) == ''){	
					alertmb("Debe ingresar un nombre para la opción de la fila " + i+ ", en las opciones a agregar", 2, 1, "Aceptar");
					return false;				
				}
				if (obtener_valorM('MT_PARMA', i, 3) == ''){	
					alertmb("Debe ingresar un valor para la opción de la fila " + i+ ", en las opciones a agregar", 2, 1, "Aceptar");
					return false;				
				}
				if (obtener_valorM('MT_PARMA', i, 4) == ''){	
					alertmb("Debe indicar si la opción estará 'Activo' ó 'Inactivo' en la fila " + i+ ", en las opciones a agregar", 2, 1, "Aceptar");
					return false;				
				}
				if ((obtener_valorM('MT_PARMA', i, 8) == '') && (obtener_valorM('MT_PARMA', i, 5) != '')){	
					alertmb("Debe dar click en Buscar para seleccionar la lista padre en la fila " + i+ ", en las opciones a agregar", 2, 1, "Aceptar");
					return false;				
				}
				if ((obtener_valorM('MT_PARMA', i, 9) == '') && (obtener_valorM('MT_PARMA', i, 6) != '')){	
					alertmb("Debe dar click en buscar para seleccionar la opción padre en la fila " + i+ ", en las opciones a agregar", 2, 1, "Aceptar");
					return false;				
				}
			}				
		   }	
		}
	}
	return true;
}
asignar_event( "onclick" , "validar()" , "wl_bsolicitar" );

//FUNCION PARA EL MANEJO EN ESPERA DE RESULTADOS
function consulta(){

	alertmb("Está seguro de registrar un nueva opción a la lista seleccionada. ¿Está usted de acuerdo?",1,2,"Continuar","Cancelar");
	$('.ui-button').on("click",function(){
		var opcion =this.id;
		if ((opcion != 1)&&(opcion != -1)){
			window.event.returnValue = false;
	     		return false;
		}
	});
	return true;
}
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
