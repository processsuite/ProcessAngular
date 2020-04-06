//Se cambian los nombres de los botones de acción
asignar_valor( 'wl_bavanzar_comentario' , 'Registrar cambios');
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Al cargar el formulario
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
CamposObligatorios(["CAGETOAN[*,1]","CAGETOAN[*,2]","CAGETOAN[*,3]","CAGEFEES[*,1]","CAGEFEES[*,2]"])

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Validaciones previas al envío
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validar()
{	//Se valida que se haya indicado al menos un día habil
	if (obtener_valor('CGLUN') != 'T' && obtener_valor('CGMAR') != 'T' && obtener_valor('CGMIE') != 'T' && obtener_valor('CGJUE') != 'T' && obtener_valor('CGVIE') != 'T' && obtener_valor('CGSAB') != 'T' && obtener_valor('CGDOM') != 'T')
	{	alertmb("Debe indicar al menos un día hábil", 2, 1, "Aceptar");
		return false;	
	}

	//Se valida la matriz de Fechas para todos los años
	var filas = obtener_valor('filCAGETOAN');
	if (!(filas == 1 && obtener_valorM('CAGETOAN', 1, 1) == '' && obtener_valorM('CAGETOAN', 1, 2) == '' && obtener_valorM('CAGETOAN', 1, 3) == ''))
	{	for (var i = 1; i <= filas; i++)
		{	if (obtener_valorM('CAGETOAN', i, 1) == '' || obtener_valorM('CAGETOAN', i, 2) == '' || obtener_valorM('CAGETOAN', i, 3) == '')
			{	alertmb("Debe completar los datos en la fila " + i + " de la matriz 'Fechas para todos los años'", 2, 1, "Aceptar");
				return false;				
			}
		}
	}

	//Se valida la matriz de Fechas específicas
	var filas = obtener_valor('filCAGEFEES');
	if (!(filas == 1 && obtener_valorM('CAGEFEES', 1, 1) == '' && obtener_valorM('CAGEFEES', 1, 2) == ''))
	{	for (var i = 1; i <= filas; i++)
		{	if (obtener_valorM('CAGEFEES', i, 1) == '' || obtener_valorM('CAGEFEES', i, 2) == '')
			{	alertmb("Debe completar los datos en la fila " + i + " de la matriz 'Fechas específicas'", 2, 1, "Aceptar");
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
