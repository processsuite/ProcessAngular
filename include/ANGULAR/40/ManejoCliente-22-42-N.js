//-----------------------------------------------------------------------------------------------------------------
//----------------------------------( LLAMADAS )-------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
asignar_valor("wl_bavanzar_comentario","Modificar Alarma");
OcultarCampo("wl_bobjetar",2);

OcultarCampo("PLANTCORRE");
OcultarCampo('ACCESO_VIR');
OcultarCampo( 'MATNVINICSERV', 4);

asignar_valor("SEPARADOR1","<font size='2' color='#0000FF'><B>Indique cuál es la tabla ó vista de Base de datos que se utilizará para definir las condiciones de ejecución de la alarma</B></font>");
asignar_valor("SEPARADOR5","<font size='2' color='#0000FF'><B>Indique las condiciones de activación de la alarma. Puede configurar más de una haciendo uso de los operadores AND y OR lógicos.</B></font>");
asignar_valor("SEPARADOR6","<font size='2' color='#0000FF'><B>Indique las personas a quienes se les debe generar la alarma. Puede seleccionar usuarios de la aplicación o indicar usuarios por preselección.</B></font>");
asignar_valor("SEPARADOR7","<font size='2' color='#0000FF'><B>Indique si deberá iniciar de forma automática algún servicio particular e incluya el destinatario del mismo.</B></font>");
asignar_valor("MATNVCMPEVEN","Agregar condición adicional");
asignar_valor("MATBOCMPEVEN","Borrar condiciones seleccionadas");
asignar_valor("MATNVDESTINA","Agregar destinatario adicional");
asignar_valor("MATBODESTINA","Borrar destinatarios seleccionados");
asignar_valor("MATNVDESTINB","Agregar destinatario adicional");
asignar_valor("MATBODESTINB","Borrar destinatarios seleccionados");
asignar_valor("MATBOINICSERV","Borrar servicio seleccionado");

asignar_event("onclick" ,"asignar_valor('EXT',''); asignar_valor('PLANTCORRE', ''); asignar_valor('ACCESO_VIR',''); ocultar(); window.event.returnValue = false;" , "evento_M1M_ARCH3");

//-----------------------------------------------------------------------------------------------------------------
//---------------------------------------( FUNCIONES )-------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

//-------- Función que se encarga de ocultar o mostrar campos dinamicamente
function ocultar()
{	if(obtener_valor("ORIGEVENTO")=="")
	{	OcultarCampo("ORIGEVENTO");
		OcultarCampo("NBCMPEXP");
		OcultarCampo("CMPEVEN");
		OcultarCampo("DESTINA");
		OcultarCampo("DESTINB");
		OcultarCampo("DESTIF");
		OcultarCampo("DESTEMAI");		
		OcultarCampo("INICSERV");
		OcultarCampo("M_ARCH");
		OcultarCampo("SEPARADOR5");
		OcultarCampo("SEPARADOR6");
		OcultarCampo("SEPARADOR7");
		cambiar_nombre('TABLA_VIST'," ",4,1);
	}
	else
	{	MostrarCampo("ORIGEVENTO");
		MostrarCampo("NBCMPEXP");
		MostrarCampo("CMPEVEN");
		MostrarCampo("DESTINA");
		MostrarCampo("DESTINB");
		MostrarCampo("DESTIF");
		MostrarCampo("DESTEMAI");		
		MostrarCampo("INICSERV");
		MostrarCampo("M_ARCH");
		MostrarCampo("SEPARADOR5");
		MostrarCampo("SEPARADOR6");
		MostrarCampo("SEPARADOR7");
		cambiar_nombre('TABLA_VIST'," ");
	
		if(obtener_valorM("M_ARCH",1,4)  =="")
			asignar_valorM("M_ARCH","<font color='#FF0000'><img src='images/info.gif'><B> Esta alarma no posee una plantilla de correo asociada. <br>Para asociarle una, presione el enlace que se presenta a continuación:</font>",1,1);
		}
		else
		{	
			asignar_valorM("M_ARCH","<font color='#0000FF'><img src='images/checkst.png'><B> Esta alarma posee una plantilla de correo asociada. <br>Seleccione una de las opciones que se listan a continuación:</font>",1,1);
			var aux = obtener_valor('DIR_FIS');
			var archivoVirtual = obtener_valorM('M_ARCH',1,4);
			var nombre = archivoVirtual.split('/');
			nombre = nombre[nombre.length-1];
			asignar_valor("PLANTCORRE", aux+'\\'+nombre);
			asignar_valor("ACCESO_VIR",archivoVirtual);
		}
	}
	return true;
}
ocultar();

AnexoArchivo('M_ARCH', 'DIR_VIR','DIR_FIS',2,3,4,'');

/*ejecutar evento cuando se llena un input*/
$('#M1M_ARCH3').on('input', function(){
	ocultar();	
})
/*
//-------- Función que permite visualizar el archivo digitalizado del recaudo
function abrir_archivo()
{	EjecutarInternet(obtener_valor('DIR_VIR')+obtener_valor('IGNUDOC')+"."+obtener_valor('EXT'));
	window.event.returnValue = false;
	return false;
}
asignar_event("onclick" ,"abrir_archivo()" , "evento_M1M_ARCH4");

//-------- Abre una ventana modal para cargar el adjunto del recaudo
function abrir_ventana()
{	showModalDialog('Subir_Archivos.asp?wg_ambiente='+obtener_valor('wg_ambiente')+'&nudoc='+obtener_valor('IGNUDOC'),'help:0; dialogHeight:250px; dialogWidth:510px; center:1;  status:no;resizable:no');
	window.event.returnValue = false;
	var a = document.cookie.substring(document.cookie.indexOf('RUTA=') + 5,document.cookie.length);
                if(a.indexOf(';') != -1) a = a.substring(0,a.indexOf(';'))
	if(a !="X")
	{	
		readCookie("RUTA","EXT");
		ocultar();
	}
	return false;
}
asignar_event("onclick" ,"abrir_ventana()" , "evento_M1M_ARCH2");

//------- Obtiene la extensión del archivo cargado con el recaudo desde una cookie de sesión
function readCookie(nombre,campo) 
{	a = document.cookie.substring(document.cookie.indexOf(nombre + '=') + nombre.length + 1,document.cookie.length);
	if(a.indexOf(';') != -1)
	{	a = a.substring(0,a.indexOf(';'));
		var aux =unescape(a);
		if( (nombre == "DIRVIR") && (aux.charAt(aux.length-1) != "/") )
		{	aux = aux + "/";
		}
		asignar_valor(campo, aux);
	}
	return true;
}*/

//-------- Función que valida el formulario antes de enviar
function obligatoriedad()
{	//Se verifica que se haya seleccionado el operador
	var filas = obtener_valor("filCMPEVEN");
	for(var i=1; i<filas; i++)
	{	if (obtener_valorM("CMPEVEN",i,6) == '')
		{	alertmb("Debe seleccionar el Operador en la fila " + i + " de la matriz de ''Condiciones de Activación''",2,1,"Aceptar");
			return false;
		}
	}
	//Se verifica que se haya buscado el destinatario
	var filas = obtener_valor("filDESTINA");
	for(var i=1; i<=filas; i++)
	{	if ((obtener_valorM("DESTINA",i,3) =="") && (obtener_valorM("DESTINA",i,1) !="" ))
		{	alertmb("No ha seleccionado el destinatario. Por favor,  presione el enlace ''Seleccionar'' en la fila " + i + " de la matriz de Destinatarios.",2,1,"Aceptar");
			return false;
		}
		if ((obtener_valorM("DESTINA",i,2) =="") && (obtener_valorM("DESTINA",i,1) !="" ))
		{	alertmb("El destinatario no tiene correo electrónico definido en la fila " + i + " de la matriz de Destinatarios.",2,1,"Aceptar");
			return false;
		}		
	}
	//Se verifica que se haya buscado el destinatario por preselección
	var filas = obtener_valor("filDESTINB");
	for(var i=1; i<=filas; i++)
	{	if ((obtener_valorM("DESTINB",i,3) =="") && (obtener_valorM("DESTINB",i,1) !="" ))
		{	alertmb("No ha seleccionado el destinatario por preselección. Por favor,  presione el enlace ''Seleccionar'' en la fila " + i + " de la matriz de Destinatarios por preselección.",2,1,"Aceptar");
			return false;
		}
	}
	if( (obtener_valorM("INICSERV",1,1) =="") && (obtener_valorM("INICSERV",1,2) !="" ) )
	{	alertmb("Si desea que esta alarma inicie una actividad particular al ejecutarse, presione el enlace ''Buscar'' en la matriz de servicios para validar el valor ingresado",2,1,"Aceptar");
		return false;
	}
	if( (obtener_valorM("INICSERV",1,1) !="") && (obtener_valorM("INICSERV",1,4) =="" ) )
	{	alertmb("No ha seleccionado un destinatario para el servicio a iniciarse con la alarma. Por favor,  presione el enlace ''Seleccionar'' en la matriz de servicios.",2,1,"Aceptar");
		return false;
	}
	if( (obtener_valorM("INICSERV",1,4) !="") && (obtener_valorM("INICSERV",1,1) =="" ) )
	{	alertmb("No ha seleccionado un servicio para el destinatario seleccionado en la matriz de servicios. Por favor,  presione el enlace ''Buscar'' en la matriz de servicios.",2,1,"Aceptar");
		return false;
	}
	if( (obtener_valorM("INICSERV",1,4) =="") && (obtener_valorM("INICSERV",1,3) !="" ) )
	{	alertmb("Debe presionar el enlace ''Seleccionar'' en la matriz de servicios para validar al destinatario ingresado",2,1,"Aceptar");
		return false;
	}
	if (obtener_valorM("DESTINA",1,1) != "" || obtener_valorM("DESTINB",1,1) != "")
	{	if(obtener_valor("EXT")=="")
		{	alertmb("Debe seleccionar una plantilla HTML para el correo de la alarma",2,1,"Aceptar");
			return false;
		}
	}
	if (obtener_valor('BD') == 'PostgreSQL')
	{	//Para PostsgreSql es necesario sustituir los "\" por "\\"
		asignar_valor("PLANTCORRE", obtener_valor("PLANTCORRE").replace(/\\/gi, "\\\\"));
	}	
	return true;
}
asignar_event("onclick" ,"obligatoriedad()" , "wl_bavanzar");
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
