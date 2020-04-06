//Se cambian los nombres de los botones de acción
asignar_valor( 'wl_bavanzar_comentario' , 'Registrar cambios');

MatrizEstatica( 'MTDIALAB' );

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Al cargar el formulario
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
CamposObligatorios(["CAESTOAN[*,1]","CAESTOAN[*,2]","CAESTOAN[*,3]","CAESFEES[*,1]","CAESFEES[*,2]"])
OcultarCampo("CELUN");
OcultarCampo("CEMAR");
OcultarCampo("CEMIE");
OcultarCampo("CEJUE");
OcultarCampo("CEVIE");
OcultarCampo("CESAB");
OcultarCampo("CEDOM");

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Ocultar y mostrar campos del formulario
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function OcultarMostrar()
{	//--- Crear
	if (obtener_valor('OPC_CAL', 0) == 'T')
	{	OcultarCampo("ID_CALEND");
		asignar_valor("ID_CALEND", "");
		MostrarCampo("DESCRIP");
		OcultarCampo("evento_DESCRIP", 4);
		OcultarCampo("USOCALEND");
		MostrarGrupo("Fechas no laborables (calendario general)");
		MostrarGrupo("Fechas no laborables (para este calendario)");	
	}
	//--- Modificar
	else if (obtener_valor('OPC_CAL', 1) == 'T')
	{	MostrarCampo("ID_CALEND");
		MostrarCampo("DESCRIP");
		MostrarCampo("evento_DESCRIP", 4);
		if (obtener_valor("ID_CALEND") != "")
		{	MostrarCampo("USOCALEND");
			MostrarGrupo("Fechas no laborables (calendario general)");
			MostrarGrupo("Fechas no laborables (para este calendario)");
		}
		else
		{	OcultarCampo("USOCALEND");
			OcultarGrupo("Fechas no laborables (calendario general)");
			OcultarGrupo("Fechas no laborables (para este calendario)");
		}
	}
	//--- Eliminar
	else if (obtener_valor('OPC_CAL', 2) == 'T')
	{	MostrarCampo("ID_CALEND");
		MostrarCampo("DESCRIP");
		MostrarCampo("evento_DESCRIP", 4);
		if (obtener_valor("ID_CALEND") != "")
		{	MostrarCampo("USOCALEND");
		}
		else
		{	OcultarCampo("USOCALEND");
		}
		OcultarGrupo("Fechas no laborables (calendario general)");
		OcultarGrupo("Fechas no laborables (para este calendario)");
	}
	else
	{	OcultarCampo("ID_CALEND");
		OcultarCampo("DESCRIP");
		OcultarCampo("USOCALEND");
		OcultarGrupo("Fechas no laborables (calendario general)");
		OcultarGrupo("Fechas no laborables (para este calendario)");
	}
	return true;
}
OcultarMostrar();
asignar_event("onclick", "OcultarMostrar()", "OPC_CAL");

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Habilita y deshabilita campos al seleccionar los checks de la matriz de días laborables
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function asignarCheckDiasSemana()
{	var n = obtener_valor('filMTDIALAB');

	for(var i=1; i<=n; i++)
	{	if( obtener_valorM('MTDIALAB', i, 1) == 'T' )
		{	$("#M"+i+"MTDIALAB3").removeAttr('disabled');
			$("#M"+i+"MTDIALAB4").removeAttr('disabled');
			$("#M"+i+"MTDIALAB5").removeAttr('disabled');
			$("#M"+i+"MTDIALAB6").removeAttr('disabled');
		}
		else
		{	$("#M"+i+"MTDIALAB3").attr('disabled','disabled');
			asignar_valorM( "MTDIALAB", "00:00", i, 3 );
			$("#M"+i+"MTDIALAB4").attr('disabled','disabled');
			asignar_valorM( "MTDIALAB", "00:00", i, 4 );
			$("#M"+i+"MTDIALAB5").attr('disabled','disabled');
			asignar_valorM( "MTDIALAB", "00:00", i, 5 );
			$("#M"+i+"MTDIALAB6").attr('disabled','disabled');
			asignar_valorM( "MTDIALAB", "00:00", i, 6 );
		}
	}

	asignar_valor( 'CELUN', obtener_valorM('MTDIALAB', 1, 1));
	asignar_valor( 'CEMAR', obtener_valorM('MTDIALAB', 2, 1));
	asignar_valor( 'CEMIE', obtener_valorM('MTDIALAB', 3, 1));
	asignar_valor( 'CEJUE', obtener_valorM('MTDIALAB', 4, 1));
	asignar_valor( 'CEVIE', obtener_valorM('MTDIALAB', 5, 1));
	asignar_valor( 'CESAB', obtener_valorM('MTDIALAB', 6, 1));
	asignar_valor( 'CEDOM', obtener_valorM('MTDIALAB', 7, 1));

	return true;
}
asignarCheckDiasSemana();
asignar_event_matriz( "onchange" , "asignarCheckDiasSemana()" , 'MTDIALAB' , 1 );

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Validaciones de horas
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
jQuery.validator.addMethod(
    "horaMilitar",
    function(value, element){
        return this.optional(element)  || /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
    },
    "Formato inválido"
);
$("#wfrm_formulario").validate();

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//Validaciones previas al envío
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function validar()
{	var HoraIni1, HoraFin1, HoraIni2, HoraFin2;
	var minHoraIni1, minHoraFin1, minHoraIni2, minHoraFin2;

	//Se valida que se haya seleccionado un calendario
	if ((obtener_valor('OPC_CAL', 1) == 'T' || obtener_valor('OPC_CAL', 2) == 'T') && obtener_valor('ID_CALEND') == '')
	{	alertmb("Debe seleccionar un calendario", 2, 1, "Aceptar");
		return false;
	}

	if (obtener_valor('OPC_CAL', 0) == 'T' || obtener_valor('OPC_CAL', 1) == 'T')
	{
		//Se valida que se haya indicado al menos un día laborable
		if (obtener_valor('CELUN') != 'T' && obtener_valor('CEMAR') != 'T' && obtener_valor('CEMIE') != 'T' && obtener_valor('CEJUE') != 'T' && obtener_valor('CEVIE') != 'T' && obtener_valor('CESAB') != 'T' && obtener_valor('CEDOM') != 'T')
		{	alertmb("Debe indicar al menos un día hábil", 2, 1, "Aceptar");
			return false;	
		}		
		
		//Se valida el formato de las horas de la matriz de días laborables
		var filas = obtener_valor('filMTDIALAB');
		var obj = null;
		for (var i = 1; i <= filas; i++)
		{	if (obtener_valorM('MTDIALAB',i,1) == 'T')
			{	for (var j = 3; j <= 6; j++)
				{	obj = $("#M"+i+"MTDIALAB"+j);
					obj.rules('remove');
					obj.rules('add', {horaMilitar: true});
				}
			}
		}	

		if ($("#wfrm_formulario").valid() != true){
			return false;
		}		
		
		//Se valida la matriz de días laborables
		var filas = obtener_valor('filMTDIALAB');
		for (var i = 1; i <= filas; i++)
		{	if (obtener_valorM('MTDIALAB',i,1) == 'T')
			{	HoraIni1 = obtener_valorM('MTDIALAB', i, 3);
				HoraFin1 = obtener_valorM('MTDIALAB', i, 4);
				HoraIni2 = obtener_valorM('MTDIALAB', i, 5);
				HoraFin2 = obtener_valorM('MTDIALAB', i, 6);
				if (HoraIni1 == '' || HoraFin1 == '' || HoraIni2 == '' || HoraFin2 == '')
				{	alertmb("Debe completar los datos en la fila " + i + " de la matriz 'Días laborables de la semana'", 2, 1, "Aceptar");
					return false;				
				}
				minHoraIni1 = parseInt(HoraIni1.substring(0,HoraIni1.indexOf(":")) + HoraIni1.substring(HoraIni1.indexOf(":")+1));
				minHoraFin1 = parseInt(HoraFin1.substring(0,HoraFin1.indexOf(":")) + HoraFin1.substring(HoraFin1.indexOf(":")+1));
				minHoraIni2 = parseInt(HoraIni2.substring(0,HoraIni2.indexOf(":")) + HoraIni2.substring(HoraIni2.indexOf(":")+1));
				minHoraFin2 = parseInt(HoraFin2.substring(0,HoraFin2.indexOf(":")) + HoraFin2.substring(HoraFin2.indexOf(":")+1));
				if (minHoraIni1 == 0 || minHoraFin1 == 0)
				{	alertmb("Debe indicar el primer turno en la fila " + i + " de la matriz 'Días laborables de la semana'", 2, 1, "Aceptar");
					return false;				
				}

				if (minHoraIni1 > minHoraFin1 || minHoraFin1 > minHoraIni2 || minHoraIni2 > minHoraFin2)
				{	alertmb("Debe revisar las horas de la fila " + i + " de la matriz 'Días laborables de la semana'", 2, 1, "Aceptar");
					return false;				
				}
			}
		}

		//Se valida la matriz de Fechas para todos los años
		var filas = obtener_valor('filCAESTOAN');
		if (!(filas == 1 && obtener_valorM('CAESTOAN', 1, 1) == '' && obtener_valorM('CAESTOAN', 1, 2) == '' && obtener_valorM('CAESTOAN', 1, 3) == ''))
		{	for (var i = 1; i <= filas; i++)
			{	if (obtener_valorM('CAESTOAN', i, 1) == '' || obtener_valorM('CAESTOAN', i, 2) == '' || obtener_valorM('CAESTOAN', i, 3) == '')
				{	alertmb("Debe completar los datos en la fila " + i + " de la matriz 'Fechas para todos los años'", 2, 1, "Aceptar");
					return false;				
				}
			}
		}

		//Se valida la matriz de Fechas específicas
		var filas = obtener_valor('filCAESFEES');
		if (!(filas == 1 && obtener_valorM('CAESFEES', 1, 1) == '' && obtener_valorM('CAESFEES', 1, 2) == ''))
		{	for (var i = 1; i <= filas; i++)
			{	if (obtener_valorM('CAESFEES', i, 1) == '' || obtener_valorM('CAESFEES', i, 2) == '')
				{	alertmb("Debe completar los datos en la fila " + i + " de la matriz 'Fechas específicas'", 2, 1, "Aceptar");
					return false;				
				}
			}
		}
	}

	if (obtener_valor('OPC_CAL', 2) == 'T')
	{	//No se puede eliminar calendario si hay usuarios que lo están utilizando
		if (parseInt(obtener_valor('USOCALEND')) > 0)
		{	alertmb("No se puede eliminar el calendario porque está asignado a usuarios", 2, 1, "Aceptar");
			return false;
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
