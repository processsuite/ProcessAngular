//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Pasa a mayúsculas el texto de la columna de la matriz indicada
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function mayuscula_columna(matriz, columna)
{	var i;
	var res_m;
	var filas = obtener_valor('fil' + matriz);
	for(i = 1; i <= filas; i++)
	{	res_m = document.getElementById('M' + i + matriz + columna).value.toUpperCase();
		asignar_valorM( matriz, res_m, i, columna);
	}
	return true;
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Pasa a mayúsculas el texto del campo indicado
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function mayuscula_campo(campo) 
{	var res;
	res = document.getElementById(campo).value.toUpperCase();
	asignar_valor( campo, res);
	return true;
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Valida que la dirección de correo electrónica ingresada en el campo sea correcta
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function mailtest(campo)
{	if (obtener_valor(campo) == "" )
	{	return true;
	}
	else
	{	if (!checkEmail(obtener_valor(campo)))
		{	alertmb("El correo electrónico ingresado tiene un formato erróneo",2,1,"Aceptar");
			document.getElementById(campo).focus();			
			asignar_valor(campo, "");
			return(false);
		}
		else
		{	return(true);
		}
	}
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Devuelve la fecha con las función de conversión correspondiente a la BD
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function conversionFecha(campo)
{	var strBD;

	strDB = obtener_valor('BD')
	if (strDB == 'SqlServer')
	{	asignar_valor('F'+campo, "convert(datetime,'" + obtener_valor(campo) + "'," + obtener_valor('NUMFMTFECH') + ")");
	}
	else if (strDB == 'Oracle7')
	{	asignar_valor('F'+campo, "to_date('" + obtener_valor(campo) + "','" + obtener_valor('FMTFECHA') + "')" );
	}
	else if (strDB == 'PostgreSQL')
	{	asignar_valor('F'+campo, "to_timestamp('" + obtener_valor(campo) + "','" + obtener_valor('FMTFECHA') + "')" );
	}
	return true
}