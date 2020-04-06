//Se cambian los nombres de los botones de acción
asignar_valor( 'wl_bsolicitar' , 'Migrar Usuarios');

//Se cambian los nombres de los botones de la matriz
asignar_valor( 'MATNVMT_PERSO' , 'Agregar Usuario');
asignar_valor( 'MATBOMT_PERSO' , 'Eliminar Usuario');

//Se oculta el botón de guardar
OcultarCampo( 'wl_bguardar', 2);

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Validaciones previas al envío
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validar()
{	
	var MostrarAdvertencia = false;
	var filas = obtener_valor('filMT_PERSO');
	for (var i = 1; i <= filas; i++)
	{	
		//Se valida que se haya seleccionado el Puesto
		if (obtener_valorM('MT_PERSO', i, 1) == '') 
		{	
			alertmb("Debe ejecutar el evento para buscar el Puesto en la fila " + i, 2, 1, "Aceptar");
			return false;				
		}

		//Se valida que se haya seleccionado el Usuario
		if (obtener_valorM('MT_PERSO',  i, 3) == '') 
		{	
			alertmb("Debe ejecutar el evento para buscar el Usuario en la fila " + i, 2, 1, "Aceptar");
			return false;
		}

		//Si se indicó perfil se debe indicar grupo
		if (obtener_valorM('MT_PERSO',  i, 5) != '' && obtener_valorM('MT_PERSO',  i, 7) == '') 
		{
			alertmb("Debe ejecutar el evento para buscar el Grupo en la fila " + i, 2, 1, "Aceptar");
			return false;
		}
		
		//Si se indicó grupo se debe indicar perfil
		if (obtener_valorM('MT_PERSO',  i, 5) == '' && obtener_valorM('MT_PERSO',  i, 7) != '') 
		{
			alertmb("Debe ejecutar el evento para buscar el Perfil en la fila " + i, 2, 1, "Aceptar");
			return false;
		}

		//Se verifica si hay filas sin perfil asignado para mostrar mensaje de advertencia
		if (obtener_valorM('MT_PERSO',  i, 5) == '' && obtener_valorM('MT_PERSO',  i, 7) == '') 
		{
			MostrarAdvertencia = true;
		}

		//Se valida que no existan definiciones repetidas
		for (var j = i + 1; j <= filas; j++) 
		{
			if (obtener_valorM('MT_PERSO', i, 1) == obtener_valorM('MT_PERSO', j, 1)) 
			{	
				alertmb("El usuario de la fila " + i + " se repite en la fila " + j, 2, 1, "Aceptar");
				return false;
			}
		}
	}
	if (MostrarAdvertencia)
	{
		alertmb("Se creará un Perfil para cada usuario sin Perfil asignado, ¿Desea Continuar?",1,2,"Aceptar","Cancelar");
		$('.ui-button').on("click",function(){
			var opcion =this.id;
			if ( (opcion == 2) || (opcion == -1) )
			{
				return false;
			}
		});
	}
	return true;
}
asignar_event( "onclick" , "validar()" , "wl_bavanzar" );
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
