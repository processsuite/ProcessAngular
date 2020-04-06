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

asignar_event_matriz( "blur" , "verProd()" , "MTZAPROD" , 1 );
asignar_event("onclick", "ocultarEvento()" , "MATNVMTZAPROD");

if (obtener_valor("INEXISTE")>0)
 {
	alertmb("La MARCA seleccionada ya tiene su catálogo creado" ,0,1,"Aceptar");
	OcultarCampo("wl_bsolicitar");
 }

CamposObligatorios(["M0MTZAPROD1","M0MTZAPROD2","M0MTZAPROD3","M0MTZAPROD4","M0MTZAPROD5"]);

asignar_valor( 'wl_bsolicitar' , 'Crear catálogo' );
asignar_valor( 'MATNVMTZAPROD' , 'Agregar producto');
asignar_valor( 'MATBOMTZAPROD' , 'Eliminar producto');

function ValidarEnvio()
{
	var fila1 = $('#filMTZAPROD').val();

	for(var m = 1; m<=fila1; m++){
		if( $('#M'+m+'MTZAPROD1').val() == '' || $('#M'+m+'MTZAPROD2').val() == '' || $('#M'+m+'MTZAPROD3').val() == '' || $('#M'+m+'MTZAPROD4').val() == '' )  
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

    return true;
}


asignar_event( "onclick" , "ValidarEnvio()" , "wl_bsolicitar");
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
