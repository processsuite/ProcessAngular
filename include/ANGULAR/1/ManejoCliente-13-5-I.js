asignar_valor( 'wl_bsolicitar' , 'Registrar Usuario');

asignar_valor( 'MATNVMT_PROCE' , 'Agregar perfil');
asignar_valor( 'MATBOMT_PROCE' , 'Eliminar perfil');

function cargar()
{
	//Sólo el Administrador principal puede crear usuarios Administradores
	if (obtener_valor('PRIADMCON')=='T')
		MostrarCampo('ADMIN');
	else
		OcultarCampo('ADMIN');
	return true;
}
cargar();

convertir_password("CLAVE");
convertir_password("VALCLAVE");

asignar_event("onblur" , "mayuscula_campo('CD_USUARIO')", "CD_USUARIO" );
asignar_event("onblur" , "mayuscula_campo('CD_PUESTO')", "CD_PUESTO" );
asignar_event("onblur" , "mayuscula_campo('P_JEFE')", "P_JEFE" );

$("#EMAIL").focusout(function() { mailtest('EMAIL') });

function validarCheckAdmin()
{
	if (obtener_valor("ADMIN") == 'T')
	{
		MostrarCampo('CLAVE');
		MostrarCampo('VALCLAVE');
	}
	else
	{
		OcultarCampo('CLAVE');
		OcultarCampo('VALCLAVE');
	}
	return true;
}
asignar_event( "onclick" , "validarCheckAdmin()", "ADMIN" );
validarCheckAdmin();

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Validaciones previas al envío
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validar()
{
	//Validación de contraseñas
	var claveGen = obtener_valor("CLAVEGEN");
	if (claveGen == '')
	{
		alertmb("No ha sido definida la clave genérica en la cónsola de la suite de Kimetic", 2, 1, "Aceptar");
		return false;					
	}

	//Validación de contraseña del administrador
	var clave = obtener_valor("CLAVE");
	if (obtener_valor("ADMIN") == 'T')
	{
		if (clave == '')
		{
			alertmb("Debe indicar la contraseña del Administrador", 2, 1, "Aceptar");
			return false;					
		}
		if (clave != obtener_valor("VALCLAVE"))
		{
			alertmb("La contraseña y la validación de la contraseña no coinciden", 2, 1, "Aceptar");
			return false;					
		}		
	}
	
	//Se valida la matriz de procesos
	var filas = obtener_valor("filMT_PROCE");
	var columnas = obtener_valor("colMT_PROCE");
	
	//Se verifica si la matriz está vacía (tiene una sóla línea y todas las columnas en blanco)
	MatrizVacia = true;
	if (filas == 1)
	{
		for (var i = 1; i <= columnas; i++)
		{
			if (obtener_valorM("MT_PROCE", 1, i) != '')
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
			//Se valida que se haya seleccionado el Perfil
			if (obtener_valorM("MT_PROCE", i, 1) == '') 
			{	
				alertmb("Debe ejecutar el evento para buscar el Perfil en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}

			//Se valida que se haya seleccionado el Grupo
			if (obtener_valorM('MT_PROCE',  i, 4) == '') 
			{	
				alertmb("Debe ejecutar el evento para buscar el Grupo en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}

			//Se valida que se haya seleccionado la fecha desde
			if (obtener_valorM('MT_PROCE',  i, 5) == '') 
			{	
				alertmb("Debe indicar la fecha desde en la fila " + i, 2, 1, "Aceptar");
				return false;				
			}
			
			//Se valida que se haya seleccionado el estatus de activo
			if (obtener_valorM('MT_PROCE',  i, 7) == '') 
			{	
				alertmb("Debe indicar el estatus de activo en la fila " + i, 2, 1, "Aceptar");
				return false;
			}				
			
			//Se valida que no existan definiciones repetidas		
			for (var j = i + 1;j <= filas; j++)
			{	
				if ((obtener_valorM('MT_PROCE', i, 1) == obtener_valorM('MT_PROCE', j, 1)) &&
				    (obtener_valorM('MT_PROCE', i, 4) == obtener_valorM('MT_PROCE', j, 4)))	
				{	
					alertmb("La definición de la fila " + i + " se repite en la fila " + j, 2, 1, "Aceptar");
					return false;
				}
			}
		}
	}


	//Si se está trabajando con bases de datos Oracle y se está creando un administrador
	if (obtener_valor("BD") == "Oracle7" && obtener_valor("ADMIN") == "T")
	{
		alertmb("Al crear usuarios administradores en Oracle se ejecutan scripts de base de datos que su antivirus puede detectar como actividad peligrosa. Por favor permita la ejecución de los mismos", 2, 1, "Aceptar");
	}

	//Se construye la conversión de las fechas
	conversionFecha('FE_INICIO');
	conversionFecha('FECHAACT');

	return true;
}
asignar_event( "onclick" , "validar()" , "wl_bavanzar");



AnexoArchivo('MTZIMG', 'DIRVIR','DIRFIS',2,3,4,'{CD_USUARIO}');
MatrizEstatica('MTZIMG')
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
