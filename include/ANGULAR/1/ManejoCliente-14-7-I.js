//Se cambian los nombres de los botones de acción
asignar_valor( 'wl_bsolicitar' , 'Actualizar Reemplazos');
asignar_valor( 'wl_bsolicitar1' , 'Actualizar Reemplazos');

//Se cambian los nombres de los botones de la matriz
asignar_valor( 'MATNVMT_REEMP' , 'Agregar Reemplazo');
asignar_valor( 'MATBOMT_REEMP' , 'Eliminar Reemplazo');

//Se oculta el botón de guardar
OcultarCampo( 'wl_bguardar', 2);

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Convertir a fecha
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function ConvertirAFecha(fecha)
{
	var proxfecha = fecha;
	var strFmtFecha = FORMATO_FECHA;
	
	var posDD = strFmtFecha.indexOf("DD");
	var posMM = strFmtFecha.indexOf("MM");
	var posYYYY = strFmtFecha.indexOf("YYYY");
	
	var myDD = parseInt(proxfecha.substring(posDD,posDD+2),10);		// extrae dia
	var myMM = parseInt(proxfecha.substring(posMM,posMM+2),10); 		// extrae mes
	var myYYYY = parseInt(proxfecha.substring(posYYYY,posYYYY+4),10);	// extrae año
	
	proxfecha = new Date(myYYYY,myMM-1,myDD);
    return(proxfecha);
}


//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Validaciones previas al envío
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validar()
{	var filas = obtener_valor('filMT_REEMP');
	var columnas = obtener_valor('colMT_REEMP');
	MatrizVacia = false;

	//Se verifica si la matriz está vacía (tiene una sóla línea y todas las columnas en blanco)
	MatrizVacia = true;
	if (filas == 1)
	{
		for (var i = 1; i <= columnas; i++)
		{
			if (obtener_valorM("MT_REEMP", 1, i) != '')
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

	//Se valida la matriz
	if (! MatrizVacia)
	{
		for (var i = 1; i <= filas; i++)
		{	
			//Se valida que se haya seleccionado la persona a reemplazar
			if (obtener_valorM('MT_REEMP', i, 1) == '') 
			{	alertmb("Debe ejecutar el evento para buscar al usuario a reemplazar en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}

			//Se valida que se haya seleccionado la persona reemplazante
			if (obtener_valorM('MT_REEMP',  i, 4) == '') 
			{	alertmb("Debe ejecutar el evento para buscar al usuario reemplazante en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}	

			//Se valida que no se haya seleccionado el mismo puesto
			if (obtener_valorM('MT_REEMP',  i, 1) == obtener_valorM('MT_REEMP',  i, 4)) 
			{	alertmb("Los puestos no pueden ser iguales, línea " + i, 2, 1, "Aceptar");
				return false;				
			}	
			for (j = i + 1; j <= filas; j++)
			{	if (obtener_valorM('MT_REEMP', i, 3) == obtener_valorM('MT_REEMP', j, 3))
				{	alertmb("La definición de la fila " + i + " se repite en la fila " + j, 2, 1, "Aceptar");
					return false;
				}
			}

			//Se valida que se haya ingresado la fecha desde
			if (obtener_valorM('MT_REEMP',  i, 7) == '')
			{	alertmb("Debe ingresar la fecha desde en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}

			//Se valida que se haya ingresado la fecha hasta
			if (obtener_valorM('MT_REEMP',  i, 8) == '')
			{	alertmb("Debe ingresar la fecha hasta en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}

			//Se valida que la fecha hasta sea mayor a la fecha desde
			if (ConvertirAFecha(obtener_valorM('MT_REEMP',  i, 7)) >= ConvertirAFecha(obtener_valorM('MT_REEMP',  i, 8)))
			{	alertmb("La fecha hasta debe ser mayor a la fecha desde en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}
		}
	}
	return true;
}
asignar_event( "onclick", "validar()", "wl_bavanzar");
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
