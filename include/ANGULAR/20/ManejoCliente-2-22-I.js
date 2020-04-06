//Se cambian los nombres de los botones de acción
asignar_valor( "wl_bavanzar_comentario" , "Reiniciar seguridad");

//Se ocultan objetos
OcultarCampo( 'wl_bguardar', 2);

//Se cambian los nombres de los botones de la matrices
asignar_valor( "MATNVMT_PSTO", "Agregar usuario");
asignar_valor( "MATBOMT_PSTO", "Eliminar usuario");

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function Init(){
  var aFlag;
  
  aFlag = obtener_valor("FLG_SEG");
  if (aFlag != "T"){
      asignar_valor("FLG_SEG" , "T");
      asignar_valor("OP_PADRE", "T");
      MostrarMatriz();
    }
  return true;
};
Init();

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MostrarMatriz(){
  if (obtener_valor("OP_PADRE")=='T'){
      OcultarCampo("MT_PSTO");
    }
  else{
      MostrarCampo("MT_PSTO");
    }  
  return true;
};
asignar_event( "onclick" , "MostrarMatriz()", "OP_PADRE" );

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Validaciones previas al envío
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validar()
{	var i;
	var j;

	//--- Se valida la matriz de usuarios específicos
	var filas = obtener_valor('filMT_PSTO');
	for (i = 1; i <= filas; i++)
	{	for (j = i + 1; j <= filas; j++)
		{	
			if (obtener_valorM('MT_PSTO', i, 1) == obtener_valorM('MT_PSTO', j, 1))
			{	alertmb("La definición de la fila " + i + " se repite en la fila " + j + " en la matriz de Usuarios específicos", 2, 1, "Aceptar");
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
