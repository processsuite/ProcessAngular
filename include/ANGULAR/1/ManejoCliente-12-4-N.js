asignar_valor( 'wl_baprobar' , 'Actualizar perfil');
asignar_valor( 'wl_banular' , 'Eliminar perfil');

asignar_valor( 'MATNVMT_A_PP' , 'Agregar actividad');
asignar_valor( 'MATBOMT_A_PP' , 'Eliminar actividad');

OcultarCampo( 'wl_bobjetar', 2 );

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Se elimina el evento onclick del botón de Anular (Eliminar Perfil) y se asigna un nuevo evento
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validaAnular()
{
	var cant_puestos = obtener_valor('NUMPUESTOS');
	var Mensaje = "";
	if (cant_puestos != '' && cant_puestos != 0)
	{	
		Mensaje = "No se puede eliminar el perfil " + obtener_valor('NB_PERFIL') + " porque está asignado a " + cant_puestos + " puestos";
		if (cant_puestos > 1)
		{
			Mensaje += "s";
		}
		alertmb(Mensaje, 2, 1, "Aceptar");
		return false;			
	}

	alertmb("Al ejecutar esta acción se eliminará el Perfil ¿Está seguro que desea continuar?", 1, 2, "Si", "No");
	$('.ui-button').on("click",function(){
		var opcion = this.id;	
		if ((opcion == 2)||(opcion == -1))
		{	
			return false;
		}
		else 
		{	
			Conectarlink1('Envio.asp?wl_anular=1');
		}
	});
	return true;
}

if (document.getElementById('wl_banular') != null)
{
	document.getElementById('wl_banular').onclick = "";
	asignar_event("onclick" , "validaAnular()","wl_banular");
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Validaciones previas al envío
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validar()
{	var filas = obtener_valor('filMT_A_PP');
	for (var i = 1; i <= filas; i++)
	{	
		//Se valida que se haya seleccionado el Proceso Padre
		if (obtener_valorM('MT_A_PP', i, 1) == '') 
		{	
			alertmb("Debe hacer click en el enlace Seleccionar actividad en la fila " + i, 2, 1, "Aceptar");
			return false;				
		}

		//Se valida que se haya seleccionado el Proceso
		if (obtener_valorM('MT_A_PP',  i, 3) == '') 
		{	
			alertmb("Debe hacer click en el enlace Seleccionar actividad en la fila " + i, 2, 1, "Aceptar");
			return false;				
		}

		//Se valida que se haya selecciando el Rol
		if (obtener_valorM('MT_A_PP',  i, 5) == '') 
		{	
			alertmb("Debe hacer click en el enlace Seleccionar actividad en la fila " + i, 2, 1, "Aceptar");
			return false;				
		}	

		//Se valida que no existan definicianes repetidas
		for (var j = i + 1; j <= filas; j++) 
		{	
			if ((obtener_valorM('MT_A_PP', i, 1) == obtener_valorM('MT_A_PP', j, 1)) && 
			    (obtener_valorM('MT_A_PP', i, 3) == obtener_valorM('MT_A_PP', j, 3)) &&
			    (obtener_valorM('MT_A_PP', i, 5) == obtener_valorM('MT_A_PP', j, 5))) 
			{	
				alertmb("La actividad de la fila " + i + " se repite en la fila " + j, 2, 1, "Aceptar");
				return false;
			}
		}
	}
	return true;
}
asignar_event( "onclick" , "validar()" , "wl_baprobar" );

/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
