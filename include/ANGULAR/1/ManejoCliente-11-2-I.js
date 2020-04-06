//Se cambian los nombres de los botones de acción
asignar_valor( 'wl_bsolicitar' , 'Actualizar Grupos');
asignar_valor( 'wl_bsolicitar1' , 'Actualizar Grupos');

//Se cambian los nombres de los botones de la matriz
asignar_valor( 'MATNVMT_GRUPO' , 'Agregar Grupo');
asignar_valor( 'MATBOMT_GRUPO' , 'Eliminar Grupo');

//Se oculta la matriz de grupos eliminados, se hace por manejo cliente para poder utilizar los botones de agregar y eliminar filas
OcultarCampo( 'MT_E_G' );

//Se oculta el botón de guardar
OcultarCampo( 'wl_bguardar', 2);

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Pasa a mayúsculas el texto de la columna de la matriz indicada (Función definida en el manejo cliente general al modelo)
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
asignar_event_matriz( "onblur" , "mayuscula_columna('MT_GRUPO',2)" , "MT_GRUPO" , 2 );

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Pasa los grupos eliminados a la matriz de grupos eliminados
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function EliminarGrupos()
{
	var CantFilas = obtener_valor("filMT_GRUPO");
	var mat = document.getElementById("MT_GRUPO");
	var NroFila; 
	for(var t = 1; t <= CantFilas; t++)
	{	if (mat.rows[t].cells[0].childNodes[0].checked )
		{	if (obtener_valorM("MT_GRUPO", t, 3) != "")
			{	if (obtener_valorM("MT_GRUPO", t, 3) == 0)
				{	if (obtener_valorM("MT_E_G", 1, 1) != '')
					{	document.getElementById("MATNVMT_E_G").click();   
					}
					NroFila = obtener_valor("filMT_E_G" );
					asignar_valorM("MT_E_G", obtener_valorM("MT_GRUPO", t, 1), NroFila, 1);
					asignar_valorM("MT_E_G", obtener_valorM("MT_GRUPO", t, 2), NroFila, 2);
					asignar_valorM("MT_E_G", obtener_valorM("MT_GRUPO", t, 3), NroFila, 3);
				}
			}
		}
	}
	return true;
}
asignar_event( "onclick" , "EliminarGrupos()" , 'MATBOMT_GRUPO', 1);

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Si el grupo tiene usuarios asignados oculta el check de eliminación
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function ocultar_checks()
{	var CantFilas = obtener_valor("filMT_GRUPO");
	for(var i = 1; i <= CantFilas; i++)
	{	if ((obtener_valorM("MT_GRUPO", i, 3) != "") && (obtener_valorM("MT_GRUPO", i , 3) != 0))
		{	OcultarCampo("CHKBOXMATMT_GRUPO" + i, 4);
		}
		else
		{	MostrarCampo("CHKBOXMATMT_GRUPO" + i, 4);
		}
	}
	return true;
}
ocultar_checks();
asignar_event( "onclick" , "ocultar_checks()" , 'MATBOMT_GRUPO');
asignar_event( "onclick" , "ocultar_checks()" , 'MATNVMT_GRUPO');

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Validaciones previas al envío
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validar()
{	var i;
	var j;
	var filas = obtener_valor('filMT_GRUPO');
	for (i = 1; i <= filas; i++)
	{	for (j = i + 1; j <= filas; j++)
		{	if (obtener_valorM('MT_GRUPO', i, 2) == obtener_valorM('MT_GRUPO', j, 2))
			{	alertmb("La definición de la fila " + i + " se repite en la fila " + j, 2, 1, "Aceptar");
				return false;
			}
		}
	}
	return true;
}
asignar_event( "onclick" , "validar()" , "wl_bavanzar" );
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
