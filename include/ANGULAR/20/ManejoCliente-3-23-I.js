//Se cambian los nombres de los botones de acción
asignar_valor( "wl_bsolicitar" , "Eliminar Elementos");
asignar_valor( "wl_bsolicitar1", "Eliminar Elementos");

//Se ocultan objetos
OcultarCampo( "wl_bguardar", 2);
 
//Se cambian los nombres de los botones de las matrices
asignar_valor( "MATNVMT_PROCS", "Agregar proceso a la lista");
asignar_valor( "MATBOMT_PROCS", "Eliminar proceso de la lista");
 
asignar_valor( "MATNVMT_ROL", "Agregar rol a la lista");
asignar_valor( "MATBOMT_ROL", "Eliminar rol de la lista");
 
asignar_valor( "MATNVMT_FORM", "Agregar formulario a la lista");
asignar_valor( "MATBOMT_FORM", "Eliminar formulario de la lista");
 
asignar_valor( "MATNVMT_PDOC", "Agregar documento a la lista");
asignar_valor( "MATBOMT_PDOC", "Eliminar documentode la lista");
 
asignar_valor( "MATNVMT_PPROC", "Agregar documento a la lista");
asignar_valor( "MATBOMT_PPROC", "Eliminar documento de la lista");
 
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 
function MostrarControles(){
	if (obtener_valor('CHKPROCESO') == 'T'){
      		MostrarGrupo("Procesos");
    	}
  	else{
      		OcultarGrupo("Procesos");
    	}

	if (obtener_valor('CHKROLES') == 'T'){
      		MostrarGrupo("Roles no asignados");
    	}
  	else{
      		OcultarGrupo("Roles no asignados");
    	}
 
 	if (obtener_valor('CHKFORM') == 'T'){
		MostrarGrupo("Formularios no asignados");
	}
	else{
		OcultarGrupo("Formularios no asignados");
	}
 
	if (obtener_valor('CHKDOCUM') == 'T'){
		MostrarGrupo("Documentos Activos");
	}
	else{
		OcultarGrupo("Documentos Activos");
	}    
	return true;
}
asignar_event( "onclick", "MostrarControles()", "CHKPROCESO" );
asignar_event( "onclick", "MostrarControles()", "CHKROLES" );
asignar_event( "onclick", "MostrarControles()", "CHKFORM" );
asignar_event( "onclick", "MostrarControles()", "CHKDOCUM" );
MostrarControles();

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Validaciones previas al envío
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validar(id_event)
{	var i;
	var j;
	var MostrarMensaje = false;

	//--- Se valida la matriz de procesos a borrar
	var filas = obtener_valor('filMT_PROCS');
	for (i = 1; i <= filas; i++)
	{	for (j = i + 1; j <= filas; j++)
		{	
			if (obtener_valorM('MT_PROCS', i, 1) == obtener_valorM('MT_PROCS', j, 1))
			{	alertmb("La definición de la fila " + i + " se repite en la fila " + j + " en la matriz de Procesos a borrar", 2, 1, "Aceptar");
				return false;
			}
			if (obtener_valorM('MT_PROCS', i, 1) != "")
			{
				MostrarMensaje = true;
			}
		}
	}

	//--- Se valida la matriz de roles a borrar
	var filas = obtener_valor('filMT_ROL');
	for (i = 1; i <= filas; i++)
	{	for (j = i + 1; j <= filas; j++)
		{	if (obtener_valorM('MT_ROL', i, 1) == obtener_valorM('MT_ROL', j, 1))
			{	alertmb("La definición de la fila " + i + " se repite en la fila " + j + " en la matriz de Roles a borrar", 2, 1, "Aceptar");
				return false;
			}
		}
	}

	//--- Se valida la matriz de formularios a borrar
	var filas = obtener_valor('filMT_FORM');
	for (i = 1; i <= filas; i++)
	{	for (j = i + 1; j <= filas; j++)
		{	if (obtener_valorM('MT_FORM', i, 1) == obtener_valorM('MT_FORM', j, 1))
			{	alertmb("La definición de la fila " + i + " se repite en la fila " + j + " en la matriz de Formularios a borrar", 2, 1, "Aceptar");
				return false;
			}
		}
	}

	//--- Se valida la matriz de borrar por documento
	var filas = obtener_valor('filMT_PDOC');
	for (i = 1; i <= filas; i++)
	{	for (j = i + 1; j <= filas; j++)
		{	if (obtener_valorM('MT_PDOC', i, 2) == obtener_valorM('MT_PDOC', j, 2))
			{	alertmb("La definición de la fila " + i + " se repite en la fila " + j + " en la matriz de Borrar por documento", 2, 1, "Aceptar");
				return false;
			}
		}
	}

	//---Se valida la matriz de borrar por proceso
	var filas = obtener_valor('filMT_PPROC');
	var columnas = obtener_valor('colMT_PPROC');
	MatrizVacia = true;

	//Se verifica si la matriz está vacía (tiene una sóla línea y todas las columnas en blanco)
	if (filas == 1)
	{
		for (var i = 1; i <= columnas; i++)
		{
			if (obtener_valorM("MT_PPROC", 1, i) != '')
			{
				MatrizVacia = false;
				break;
			}
		}
	}
	else
	{
		MatrizVacia = false;
	}

	if (! MatrizVacia)
	{
		for (var i = 1; i <= filas; i++)
		{
			//Se valida que se haya seleccionado el Proceso Padre
			if (obtener_valorM("MT_PPROC", i, 1) == '') 
			{	
				alertmb("Debe ejecutar el evento para buscar el Proceso Padre en la fila " + i + " de la matriz de Borrar por proceso", 2, 1, "Aceptar");
				return false;				
			}
			//Se valida que se haya seleccionado el Proceso
			if (obtener_valorM("MT_PPROC", i, 3) == '') 
			{	
				alertmb("Debe ejecutar el evento para buscar el Proceso en la fila " + i + " de la matriz de Borrar por proceso", 2, 1, "Aceptar");
				return false;				
			}

			//Se valida que no existan definiciones repetidas
			for (var j = i + 1; j <= filas; j++)
			{				
				if (obtener_valorM('MT_PPROC', i, 8) != '' && obtener_valorM('MT_PPROC', j, 8) != '' && obtener_valorM('MT_PPROC', i, 8) == obtener_valorM('MT_PPROC', j, 8))
				{	alertmb("La definición de la fila " + i + " se repite en la fila " + j + " en la matriz de Borrar por proceso", 2, 1, "Aceptar");
					return false;
				}
			}

		}
	}

	//Se muestra el mensaje de advertencia al borrar procesos
	if (MostrarMensaje)
	{
		alertmb("Al eliminar Procesos se elimina de manera definitiva toda la información relacionada al Proceso, incluyendo la inscripción de los usuarios y las instancias de documentos ¿Está completamente seguro que desea continuar?", 1, 2, "Si", "No");	
		$('.accion_bot').on("click",function(){
			var opcion =event.target.attributes.valor.value;
			if ((opcion == 2)||(opcion == -1))
			{	
				return false;
			}else{
				ejecutar_event(id_event);
				return true;
			}
		});
	}else{
		ejecutar_event(id_event);
		return true;
	}
	
}

$('#wl_bavanzar_comentario').on("click", function(){
	evitar_evento('wl_bavanzar');
	$('#wl_bavanzar').on("click", function(){validar(this.id)});
});
//asignar_event( "onclick" , "validar()" , "wl_bavanzar" );

/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
