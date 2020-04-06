OcultarCampo("wl_bobjetar",2);
var filas = obtener_valor("filMTZAPROD");
for(var i =1;i<=filas;i++)
 $("#evento_M"+i+"MTZAPROD1").hide();

function ocultarEvento()
{ var fila = obtener_valor("filMTZAPROD");

  $("#evento_M"+fila+"MTZAPROD1").hide();
  return true;
}

function verProd()
{ var fila = get_fila("MTZAPROD");

  $("#evento_M"+fila+"MTZAPROD1").click(); 
}

asignar_event_matriz( "focusout" , "verProd()" , "MTZAPROD" , 1 );
asignar_event("onclick", "ocultarEvento()" , "MATNVMTZAPROD");
asignar_event("onclick", "ocultarEvento(); $('#M1MTZAPROD1').focusout(function() {  $('#evento_M1MTZAPROD1').click();} ); " , "MATBOMTZAPROD");

CamposObligatorios(["M0MTZMPROD1","M0MTZMPROD2","M0MTZMPROD3","M0MTZMPROD4","M0MTZMPROD5","M0MTZMPROD6"]);
CamposObligatorios(["M0MTZAPROD1","M0MTZAPROD2","M0MTZAPROD3","M0MTZAPROD4","M0MTZAPROD5"]);
MatrizEstatica( "MTZCRIT" );
OcultarCampo("MATNVMTZMPROD", 2);
asignar_valor( 'MATBOMTZMPROD' , 'Descartar producto de la lista obtenida');
asignar_valor( 'wl_baprobar' , 'Actualizar catálogo' );
asignar_valor( 'MATNVMTZAPROD' , 'Agregar producto');
asignar_valor( 'MATBOMTZAPROD' , 'Eliminar producto');


function manejadorAccion(){
  switch (obtener_valor("FUNCATA")) {
	case 'Agregar':
		MostrarGrupo('AGREGAR PRODUCTOS');
		OcultarGrupo( 'MODIFICAR PRODUCTOS' );
		break;
	case 'Modificar':
		OcultarGrupo( 'AGREGAR PRODUCTOS' );
		MostrarGrupo( 'MODIFICAR PRODUCTOS' );
		break;
	default:
		OcultarGrupo( 'AGREGAR PRODUCTOS' );
		OcultarGrupo( 'MODIFICAR PRODUCTOS' );
}
}

manejadorAccion();
asignar_event( "onchange" , "manejadorAccion()" , "FUNCATA" );

function ValidarEnvio()
{
   if (obtener_valor("FUNCATA")=='Agregar')
   {
	var fila1 = $('#filMTZAPROD').val();

	
	for(var m = 1; m<=fila1; m++){
	    if ($('#M'+m+'MTZAPROD7').val() != '' )
		{
			alertmb("El producto de la fila " + m + " con el código " + obtener_valorM('MTZAPROD',m,1) + " ya esta registrado en el catálogo, por favor borrar la fila" ,0,1,"Aceptar");
			return false;
		}	
	
		if( $('#M'+m+'MTZAPROD1').val() == '' || $('#M'+m+'MTZAPROD2').val() == '' || $('#M'+m+'MTZAPROD3').val() == '' || $('#M'+m+'MTZAPROD4').val() == '' || $('#M'+m+'MTZAPROD5').val() == '' )  
		{
			alertmb("Debe indicar todos los datos del producto de la fila " + m + " o borrar la fila" ,0,1,"Aceptar");
			return false;
		}	
	}
	
	var i = 0;
	var j = 0;
	for(i = 1; i <= fila1-1; i++){
		for(j = i+1; j <= fila1; j++){
			if( $('#M'+i+'MTZAPROD1').val().toUpperCase() == $('#M'+j+'MTZAPROD1').val().toUpperCase()  && $('#M'+i+'MTZAPROD3').val().toUpperCase() == $('#M'+j+'MTZAPROD3').val().toUpperCase() )
			{
				alertmb("No se deben repetir productos con el mismo codigo del proveedor y codigo comercial. Corregir fila " + i + " y/o fila " + j ,0,1,"Aceptar");
				return false;
			}
		}			
	}
   }
   
   if (obtener_valor("FUNCATA")=='Modificar') 
    {
	var fila1 = $('#filMTZMPROD').val();

	for(var m = 1; m<=fila1; m++){
		if( $('#M'+m+'MTZMPROD1').val() == '' || $('#M'+m+'MTZMPROD2').val() == '' || $('#M'+m+'MTZMPROD3').val() == '' || $('#M'+m+'MTZMPROD4').val() == '' || $('#M'+m+'MTZMPROD5').val() == '' )  
		{
			alertmb("Debe indicar todos los datos del producto de la fila " + m + " o borrar la fila" ,0,1,"Aceptar");
			return false;
		}	
	}
	
	var i = 0;
	var j = 0;
	for(i = 1; i <= fila1-1; i++){
		for(j = i+1; j <= fila1; j++){
			if( $('#M'+i+'MTZMPROD1').val().toUpperCase() == $('#M'+j+'MTZMPROD1').val().toUpperCase()  && $('#M'+i+'MTZMPROD3').val().toUpperCase() == $('#M'+j+'MTZMPROD3').val().toUpperCase() )
			{
				alertmb("No se deben repetir productos con el mismo codigo del proveedor y codigo comercial. Corregir fila " + i + " y/o fila " + j ,0,1,"Aceptar");
				return false;
			}
		}			
	}
   }
	
    return true;
}

asignar_event( "onclick" , "ValidarEnvio()" , "wl_baprobar" );
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
