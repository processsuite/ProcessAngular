console.log("load Formulario");
//Banderas para botones ocultos en matrices
var btn_mat_nv = false; //Si oculto el boton agregar fila. 0: Visible 1: Oculto
var btn_mat_bo = false; //Si oculto el boton borrar fila. 0: Visible 1: Oculto
var btn_mat_se = false; //Si oculto el boton seleccionar todo. 0: Visible 1: Oculto


//manejo para captura de las coordenadas del mouse
var IE = document.all?true:false;
var posX = 0;
var posY = 0;
if (!IE) document.captureEvents(Event.MOUSEMOVE)
document.onmousemove = getMouseXY;

function getMouseXY(e) {
if (IE) { //para IE
posX = event.clientX;
posY = event.clientY;

if ((posX - 75) < 0){
	posX = 10 + document.body.scrollLeft;
}else if ((posX + 75) > (screen.width - 20)){
	posX = posX - ((posX +150) - (screen.width - 20)) + document.body.scrollLeft;
}else{
	posX = posX - 75 + document.body.scrollLeft;
}

if ((posY - 105) < 0){
	posY = 10 + document.body.scrollTop;
}else if ((posY + 105) > (screen.height - 200)){
	posY = posY - ((posY +210) - (screen.height - 200)) + document.body.scrollTop;
}else{
	posY = posY - 105 + document.body.scrollTop;
}
}
else { //para netscape
posX = e.pageX;
posY = e.pageY;

if ((posX - 130) < document.body.scrollLeft){
	posX = posX + 5;
}else if ((posX + 150) > (window.screen.width - 20)){
	posX = posX - ((posX +260) - (window.screen.width - 20)) + document.body.scrollLeft;
}else{
	posX = posX - 130;
}

if ((posY - 115) < document.body.scrollTop){
	posY = posY + 5;
}else if ((posY + 115) > (window.screen.height - 200)){
	posY = posY - ((posY +210) - (window.screen.height - 200)) + document.body.scrollTop;
}else{
	posY = posY - 115;
}
}
return true;
}
//

 function reload()
 {
	document.getElementById("wfrm_formulario").action = "Formulario.asp?wl_actformatemp=1";
	document.getElementById("wfrm_formulario").target="_self";
	document.getElementById("wfrm_formulario").submit();
	return(true);
 }

 function ir_formulario(param)
 {
	var res = screen.width;
	Conectarlink(param+"&wl_res="+res);
 }


 function verificar_anular(id_obj,pe_mensaje,pe_mensajeSi,pe_mensajeNo){
    if (Despliegue_interno==1){
	//verificar si hay eventos en el onclick.
	if (evaluar_event("onclick",id_obj)){
//		deshabilitar_pagina();
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 2;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='&nbsp;"+pe_mensajeSi+"&nbsp;' id='button1' name='button1'onclick='returnValue=1;window.close();'>";
			mat["boton2"] = "<input class='GrupoAcc' type='button' value='&nbsp;"+pe_mensajeNo+"&nbsp;' id='button2' name='button2'onclick='returnValue=0;window.close();'>";
			mat["mensaje"] = pe_mensaje;
			mat["icono"] = "images/Question.png";
			var x = doDialog(mat);
			if (x == 1){
				Conectarlink1('Envio.asp?wl_anular=1');
			}else{}

////		}else{
////			if (confirm(pe_mensaje)){
////				Conectarlink1('Envio.asp?wl_anular=1');
////			}
////			else{}
////		}
	}
    }
 }

 function verificar_save(pe_mensaje,pe_mensajeSi,pe_mensajeNo,pe_mensajeCancel){
////	if (IE){
		var mat = new Array();
		mat["cantB"] = 3;
		mat["boton1"] = "<input class='GrupoAcc' type='button' value='&nbsp;"+pe_mensajeSi+"&nbsp;' id='button1' name='button1'onclick='returnValue=1;window.close();'>";
		mat["boton2"] = "<input class='GrupoAcc' type='button' value='&nbsp;"+pe_mensajeNo+"&nbsp;' id='button2' name='button2'onclick='returnValue=0;window.close();'>";
		mat["boton3"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeCancel+"' id='button3' name='button3'onclick='returnValue=-1;window.close();'>";
		mat["mensaje"] = pe_mensaje;
		mat["icono"] = "images/Question.png";
		var x = doDialog(mat);
		if (x == 1){
			Conectarlink("wl_salirD=1");
		}else if (x == 0){
			Conectarlink("wl_salirD=2");
		}else{}

////	}else{
////		if (!confirm(pe_mensaje)){
////			Conectarlink("wl_salirD=2");
////		}
////		else{
////			Conectarlink("wl_salirD=1");
////		}
////	}
 }

 function verificar_saveS(pe_mensaje,pe_mensajeSi,pe_mensajeNo,pe_mensajeCancel,lectura){
  if (lectura == "S"){
	Conectarlink('wl_cs=true');
  }else{
////	if (IE){
		var mat = new Array();
		mat["cantB"] = 3;
		mat["boton1"] = "<input class='GrupoAcc' type='button' value='&nbsp;"+pe_mensajeSi+"&nbsp;' id='button1' name='button1'onclick='returnValue=1;window.close();'>";
		mat["boton2"] = "<input class='GrupoAcc' type='button' value='&nbsp;"+pe_mensajeNo+"&nbsp;' id='button2' name='button2'onclick='returnValue=0;window.close();'>";
		mat["boton3"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeCancel+"' id='button3' name='button3'onclick='returnValue=-1;window.close();'>";
		mat["mensaje"] = pe_mensaje;
		mat["icono"] = "images/Question.png";
		var x = doDialog(mat);
		if (x == 1){
			Conectarlink("wl_salird=3");
		}else if (x == 0){
			Conectarlink('wl_cs=true');
		}else{}

////	}else{
////		if (!confirm(pe_mensaje)){
////			Conectarlink('wl_cs=true');
////		}
////		else{
////			Conectarlink("wl_salird=3");
////		}
////	}
  }
 }

 function accion_coord(id_obj,param)
 {
	if (Despliegue_interno==1){
		if (evaluar_event("onclick",id_obj)){
			deshabilitar_pagina();
			Conectarlink(param);
		}
	}
 }

 function accion_coord1(id_obj,param)
 {
	if (Despliegue_interno==1){
		if (evaluar_event("onclick",id_obj)){
			deshabilitar_pagina();
			Conectarlink1(param);
		}
	}
 }

 function arregla_path(cadena)
 {
	var auxcad = new String(cadena);
	var strResul = new String();
	var i;
	for(i=0;i<auxcad.length;i++){
		if (auxcad.charAt(i) =="\\"){
			strResul = strResul + "\\" + "\\";
		}
		else	{
			strResul = strResul + auxcad.charAt(i);
		}
	}
	return(strResul);
 }


 function generico_link(id_obj,nb_funcion)
 {
	if (evaluar_event("href",id_obj)){
		eval(arregla_path(nb_funcion));
	}
 }


 function Conectarlink(param)
 {
	document.getElementById("wfrm_formulario").action = "Formulario.asp?" + param;
	document.getElementById("wfrm_formulario").target="_self";
	document.getElementById("wfrm_formulario").submit();
 }

 function Conectaradhoc(param)
 {
	document.getElementById("wfrm_formulario").action = "Visualizador.asp?" + param;
	document.getElementById("wfrm_formulario").target="_self";
	document.getElementById("wfrm_formulario").submit();
 }


 function Conectarlink1(pag)
 {
	document.getElementById("wfrm_formulario").action = pag;
	document.getElementById("wfrm_formulario").target="_self";
	document.getElementById("wfrm_formulario").submit();
 }

 function ConectarWeb(par,id_obj)
 {
	if (evaluar_event("href",id_obj)){
		var res = screen.width;
		document.getElementById("wfrm_formulario").action = "officeweb.asp?res="+res+"&"+par;
		document.getElementById("wfrm_formulario").target="_blank";
		document.getElementById("wfrm_formulario").submit();
	}
 }


 function EjecutarInternet(pe_URL)
 {
    var Test = new String(pe_URL);
    Test = Test.toUpperCase();
    if (Test.indexOf("OFFICEWEB.ASP?",0)>=0){//hacer submit
	var res = screen.width;
	document.getElementById("wfrm_formulario").action = pe_URL + "&res="+res;
	document.getElementById("wfrm_formulario").target="_blank";
	document.getElementById("wfrm_formulario").submit();
    }else{
	window.open(pe_URL,null);
    }
 }

  function HacerBusqueda()
  //Funci�n que realiza la busqueda en los pendientes
  {
    var objeto = document.forms["wfrm_formulario"].elements["wl_opcion"];
    if (document.forms["wfrm_formulario"].elements["wl_txtbuscar"].value!="")
		if (document.forms["wfrm_formulario"].elements["wl_txtbuscar"].onblur()){
				if (objeto[0].checked){
					Conectarlink("wl_desde=0&wl_wf=0&wl_wfa=0&wl_numdoc="+document.forms["wfrm_formulario"].elements["wl_txtbuscar"].value+"&wl_fechini=&wl_fechfin=");
				}else if (objeto[1].checked){
					Conectarlink("wl_desde=0&wl_wf=0&wl_wfa=0&wl_fechini="+document.forms["wfrm_formulario"].elements["wl_txtbuscar"].value+"&wl_fechfin="+document.forms["wfrm_formulario"].elements["wl_txtbuscar1"].value);
				} else{
					Conectarlink("wl_desde=0&wl_wf=0&wl_wfa=0&wl_asunto="+document.forms["wfrm_formulario"].elements["wl_txtbuscar"].value+"&wl_fechini=&wl_fechfin=");
				}
		}
  }


  function CalcNumDiasMes(pe_Year, pe_Month)
  //Funcion que calcula el numero de dias en el mes dado el a�o
  //Par�metros:
  // pe_Year: A�o de la fecha
  // pe_Month: Mes de la fecha
  // Retorna: Cant de dias , correspondiente al mes y al a�o
  // Desarrollado por: Elis Velasquez  Fecha: 07/05/1999
  {
   var FEBRERO = 2;
   var JULIO = 7;

   if (pe_Month == FEBRERO)
     {
      if(esBisiesto(pe_Year)) return 29;
      else return 28;
     }
   else
     {
      if(pe_Month>JULIO) pe_Month++;
      if (pe_Month%2 != 0)  return 31;
     }
   return 30;
  }

  function esFecha(pe_objName,pe_strFmtFecha)
  //Funcion que valida si la fecha cumple con el formato , y si este es una fecha valida
  //Par�metros:
  //  pe_ObjName: Nombre del Objeto donde esta contenido la fecha
  //  pe_strFmtFecha: Formato de fecha que debe cumplir la cadena
  //  pe_valorminimo: Valor minimo del rango de Fechas
  //  pe_valormaximo: Valor maximo del rango de Fechas.
  //Retorna:
  //  Falso, si la fecha es invalida
  //  True, si la fecha es valida
  //Desarrollado por: Elis Velasquez.  Fecha:06/05/1999.
  //Modificado por: Elis Velasquez.   Fecha:29/04/2000.
  {
    var myValue = document.forms["wfrm_formulario"].elements[pe_objName].value;
    var args = esFecha.arguments;
    pe_objName = args[0];
    pe_strFmtFecha = args[1];

    if (myValue.length==0) return true;
    if (myValue.length<10) return false;
    if ( (myValue.substring(2,3) != pe_strFmtFecha.substring(2,3) ) || (myValue.substring(5,6) != pe_strFmtFecha.substring(5,6)) )
      return false;

    posDD = pe_strFmtFecha.indexOf("DD");
    posMM = pe_strFmtFecha.indexOf("MM");
    posYYYY = pe_strFmtFecha.indexOf("YYYY");

    myDD   	= parseInt(myValue.substring(posDD,posDD+2),10);		// extrae dia
    myMM   	= parseInt(myValue.substring(posMM,posMM+2),10); 		// extrae mes
    myYYYY	= parseInt(myValue.substring(posYYYY,posYYYY+4),10);	// extrae a�o

    if ( (isNaN(myDD)) || (isNaN(myMM)) || ( isNaN(myYYYY)) ) return false;
    if (myYYYY < 1000) return false;
    if ( (myMM > 12) || (myMM <= 0) ) return false;

    var lastDate = CalcNumDiasMes(myYYYY,myMM);
    if ( (myDD > lastDate) || (myDD <=0) ) return false;

    return true;
  }

 function doOutline(pe_grupo)
  //Funcion que realiza el expandir y colapsar de un grupo de objetos
  //que se encuentran agrupados en un DIV
  //Par�metros:
  // pe_Grupo: Nombre del objeto que agrupa los elementos
  //Retorna:
  // Que el objeto se muestre o se oculte
  //Desarrollado por: Elis Velasquez .   Fecha: 10/08/2000
  {
      if (document.getElementById(pe_grupo).style.display=="none") //Expandir el grupo
      { document.getElementById(pe_grupo).style.display = "";
      }else{
	document.getElementById(pe_grupo).style.display = "none";
      }
  }


//***************rutinas **************
	function IngresarFila(pe_Matriz,pe_tipo)
	//Funci�n que ingresa una nueva fila en el campo matriz
	//Par�metros:
	// pe_Matriz: Nombre de la matriz
	//Retorna:
	//  El incremento de una fila en la matriz
	{

				var nroFilas = parseInt(document.getElementById("fil"+pe_Matriz).value)+1;
				$('#MATNV'+pe_Matriz).click();
	    /*	try
				{
					DynMatrices(pe_Matriz,nroFilas);
				}
				catch(e){}
				try
				{
					DynFormulas(pe_Matriz,nroFilas);
				}
				catch(e){}
				try
				{
					ReconstruirFormulas(pe_Matriz,nroFilas);
					reconstruir_matriz_event(pe_Matriz);
				}
				catch(e){}
				fila = null;
				mat = null;
				//evaluar_event("onclick","MATNV"+pe_Matriz);

		/*}else{//petici�n ajax
			    var apd_ult = Math.floor(parseInt(obtener_valor("MATTOT"+pe_Matriz))/parseInt(obtener_valor("MATPAG"+pe_Matriz)))*parseInt(obtener_valor("MATPAG"+pe_Matriz)) + 1;
			    matriz_data("matriz.asp","MATNV"+pe_Matriz,pe_Matriz,"wl_newfila=1&wl_frmn="+obtener_valor("wl_frmn")+"&wl_apd="+apd_ult+"&wl_res="+obtener_valor("wl_res"));
		}*/

		//ListasAjax

	    return(true);
	}

    function BorrarFila(pe_Matriz,pe_tipo)
    //Funci�n que ingresa una nueva fila en el campo matriz
    //Par�metros:
    // pe_Matriz: Nombre de la matriz
    //Retorna:
    //  El incremento de una fila en la matriz
    //Desarrollado por: Elis Velasquez.  Fecha:  22/06/2000
    //Modificado por Leo Feb 2003
    {
 	 if (parseInt(obtener_valor("MATPAG"+pe_Matriz))== 0){ //esquema antiguo sin paginaci�n
 		if (evaluar_event("onclick","MATBO"+pe_Matriz,1)){
       				//Esta funci�n solo funciona para IE 5.0
				var t = 1;
				var y = 1;
				var z = 1;

				var strNvoNombre = "";
				var vjoNombre = "";
				var strElemento = "";
				var mat = document.getElementById(pe_Matriz);
				var nFil = document.getElementById("fil"+pe_Matriz);
				var valor_antfil = document.getElementById("fil"+pe_Matriz).value;
				var mhi = document.getElementById("MATHI"+pe_Matriz);

				var tipo = pe_tipo+"";

					$('#MATBO'+pe_Matriz).click();


		}
 	}else{//AJAX
		if (obtener_valor("MATFILDELETE"+pe_Matriz) != ""){
			matriz_data("matriz.asp","MATBO"+pe_Matriz,pe_Matriz,"wl_delfila=1&wl_frmn="+obtener_valor("wl_frmn")+"&wl_res="+obtener_valor("wl_res")+"&MATFILDELETE"+pe_Matriz+"="+obtener_valor("MATFILDELETE"+pe_Matriz));
		}
 	}

	//ListasAjax
	K_ListasAjax();

	return(true);
    }

	function DesSeleccionaFila(pe_Matriz,pe_cb)
	{
		try
		{
			if(!document.getElementById(pe_cb).checked)
			{
				document.getElementById("MATHI"+pe_Matriz).value = "";
				var dt_act = obtener_valor("MATFILDELETE"+pe_Matriz);
				var mat_dt_list = dt_act.split(";");
				var num_dt_list = mat_dt_list.length-1;
				var k = 0;
				for(k=0;k<=num_dt_list;k++){
					if (mat_dt_list[k]==document.getElementById(pe_cb).value){
						mat_dt_list.splice(k, 1);
						break;
					}
				}
				asignar_valor("MATFILDELETE"+pe_Matriz,mat_dt_list.join(";"));
			}else{
				var dt_act = obtener_valor("MATFILDELETE"+pe_Matriz);
				if (dt_act == ""){
					asignar_valor("MATFILDELETE"+pe_Matriz,document.getElementById(pe_cb).value);
				}else{
					var mat_dt_list = dt_act.split(";");
					mat_dt_list.splice(0, 0,document.getElementById(pe_cb).value);
					asignar_valor("MATFILDELETE"+pe_Matriz,mat_dt_list.join(";"));
				}
			}
		}
		catch(e){}
	}


	function SeleccionaFila(pe_Matriz)
	{
		var nFil = parseInt(document.getElementById("fil"+pe_Matriz).value);
		var mat = document.getElementById(pe_Matriz);
		var mhi = document.getElementById("MATHI"+pe_Matriz);
		try
		{
			if(mhi.value == "X")
			{
				mhi.value = "";
				asignar_valor("MATFILDELETE"+pe_Matriz,"");
			/*	for(i=2;i<=nFil+2;i++)
				{
					try
					{
						mat.rows[i].cells[0].childNodes[0].checked = false;
					}
					catch(x){}
				}*/
			}
			else
			{
				mhi.value = "X";
				var cad_file_aux = "";
				for(i=2;i<=nFil+2;i++)
				{
					try
					{
						$('#MATSE'+pe_Matriz).click();
						//mat.rows[i].cells[0].childNodes[0].checked = true;
						if (i==nFil){
							cad_file_aux = cad_file_aux + i;
						}else{
							cad_file_aux = cad_file_aux + i + ";";
						}
					}
					catch(x){}
				}
				asignar_valor("MATFILDELETE"+pe_Matriz,cad_file_aux);
			}
		}
		catch(e){}
		finally
		{
			mat = null;
			mhi = null;
		}

	}

	function MatrizEstatica(nombre)
	{
		OcultarCampo(nombre,1);
		OcultarCampo(nombre,3,0);
		return(true);
	}

function OcultarGrupo(Nombre)
{
try{
//	document.getElementById("GRUPO_"+Nombre).style.display="none";
//	return(true);
	angular.element($('[name="documentForm"]')).scope().ocultarGrupoAng(Nombre);
	/*if(angular.element($('[name="documentForm"]')).scope().$$phase){
    angular.element($('[name="documentForm"]')).scope().$apply();
	}*/
	//
}catch(e){}
}

function MostrarGrupo(Nombre)
{
try{
//	document.getElementById("GRUPO_"+Nombre).style.display="";
//	return(true);
	angular.element($('[name="documentForm"]')).scope().mostrarGrupoAng(Nombre);
	/*if(angular.element($('[name="documentForm"]')).scope().$$phase){
    angular.element($('[name="documentForm"]')).scope().$apply();
	} */
}catch(e){}

}

function OcultarCampo(Nombre,op,col)
{
try{
	if (op==undefined){
		op = 0;
	}
	switch(op){
		case 0://campo de process, se oculta toda la linea.
			angular.element($('[name="documentForm"]')).scope().ocultarCampoAng(Nombre,op,col);
			/*if((document.getElementById(Nombre).type=="checkbox")||(document.getElementById(Nombre).type=="radio"))
				document.getElementById(Nombre).parentNode.parentNode.parentNode.parentNode.style.display="none";
			else
				document.getElementById(Nombre).parentNode.parentNode.style.display="none";*/
			break;
		case 1://oculta los botones de una matriz
			try{
				document.getElementById("MATSE"+Nombre).style.display="none";
				document.getElementById("MATNV"+Nombre).style.display="none";
				document.getElementById("MATBO"+Nombre).style.display="none";
			}catch(e){}
			break;
		case 2://oculta algun boton de accion de coordinacion
			try{
				document.getElementById(Nombre).style.display="none";
				document.getElementById(Nombre+"1").style.display="none";
			}catch(e){}
			break;
		case 3://oculta una columna de una matriz
			try{
				angular.element($('[name="documentForm"]')).scope().ocultarCampoAng(Nombre,op,col);
				/*var numfilasM = document.getElementById("fil"+Nombre).value;
				document.getElementById("M0"+Nombre+col).style.display="none";
				if (col == 0){
					for(i=1;i<=numfilasM;i++){
						document.getElementById("CHKBOXMAT"+ Nombre + i).parentNode.style.display="none";
					}
				}else{
					for(i=1;i<=numfilasM;i++){
						document.getElementById("M"+i+Nombre+col).parentNode.style.display="none";
					}
				}*/
			}catch(e){}
			break;
		case 4://oculta un objeto
			try{
				document.getElementById(Nombre).style.display="none";
			}catch(e){}
			break;
		case 5://oculta hijos de campos tipo alternativas exclusivos.
			try{
				if (IE){
					document.getElementsByName(Nombre).item(col).style.display="none";
					document.getElementsByName(Nombre).item(col).parentNode.parentNode.childNodes[2*parseInt(col)+1].style.display = "none";
				}else{
					document.getElementsByName(Nombre).item(col).style.display="none";
					document.getElementsByName(Nombre).item(col).parentNode.parentNode.childNodes[4*parseInt(col)+3].style.display = "none";
				}
			}catch(e){}
            break;
		case 6://oculta hijos de campos tipo alternativas inclusivos.
			try{
				document.getElementById(Nombre).style.display="none";
				document.getElementById(Nombre).parentNode.parentNode.cells[parseInt(document.getElementById(Nombre).parentNode.cellIndex)+1].style.display="none";
			}catch(e){}
			}
	return(true);
}catch(e){}
}

function MostrarCampo(Nombre,op,col)
{
try{
	if (op==undefined){
		op = 0;
	}
	switch(op){
		case 0://campo de process, se muestra toda la linea.
			angular.element($('[name="documentForm"]')).scope().mostrarCampoAng(Nombre,op,col);
			/*if((document.getElementById(Nombre).type=="checkbox")||(document.getElementById(Nombre).type=="radio"))
				document.getElementById(Nombre).parentNode.parentNode.parentNode.parentNode.style.display="";
			else
				document.getElementById(Nombre).parentNode.parentNode.style.display="";
			break;*/
		case 1://muestra los botones de una matriz
			try{
				document.getElementById("MATSE"+Nombre).style.display="";
				document.getElementById("MATNV"+Nombre).style.display="";
				document.getElementById("MATBO"+Nombre).style.display="";
			}catch(e){}
			break;
		case 2://muestra algun boton de accion de coordinacion
			try{
				document.getElementById(Nombre).style.display="";
				document.getElementById(Nombre+"1").style.display="";
			}catch(e){}
			break;
		case 3://oculta una columna de una matriz
		angular.element($('[name="documentForm"]')).scope().mostrarCampoAng(Nombre,op,col);
		/*	try{
				var numfilasM = document.getElementById("fil"+Nombre).value;
				document.getElementById("M0"+Nombre+col).style.display="";
				if (col == 0){
					for(i=1;i<=numfilasM;i++){
						document.getElementById("CHKBOXMAT"+ Nombre + i).parentNode.style.display="";
					}
				}else{
					for(i=1;i<=numfilasM;i++){
						document.getElementById("M"+i+Nombre+col).parentNode.style.display="";
					}
				}

			}catch(e){}*/
			break;
		case 4://muestra un objeto
			try{
				document.all(Nombre).style.display="";
			}catch(e){}
			break;
		case 5://muestra hijos de campos tipo alternativas exclusivos.
			try{
				if (IE){
					document.getElementsByName(Nombre).item(col).style.display="";
					document.getElementsByName(Nombre).item(col).parentNode.parentNode.childNodes[2*parseInt(col)+1].style.display = "";
				}else{
					document.getElementsByName(Nombre).item(col).style.display="";
					document.getElementsByName(Nombre).item(col).parentNode.parentNode.childNodes[4*parseInt(col)+3].style.display = "";
				}
			}catch(e){}
            break;
		case 6://oculta hijos de campos tipo alternativas inclusivos.
			try{
				document.getElementById(Nombre).style.display="";
				document.getElementById(Nombre).parentNode.parentNode.cells[parseInt(document.getElementById(Nombre).parentNode.cellIndex)+1].style.display="";
			}catch(e){}

	}
	return(true);
}catch(e){}
}

   function ValidarFecha(pe_objName,pe_strFmtFecha,pe_valorminimo,pe_valormaximo,pe_mensValFecha,pe_mensRango,pe_mensajeAceptar,pe_objMatriz)
    {
	  if (!IE && pe_objMatriz=="") agregar_onchange(pe_objName);
	  if (!IE && pe_objMatriz!="") agregar_onchangeM(pe_objMatriz,pe_objName);
	  estatus = esFecha(pe_objName,pe_strFmtFecha,pe_valorminimo,pe_valormaximo);
      if (estatus!=true)
      {
        switch(estatus)
         {
           case 7:
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensRango + pe_valorminimo + " .. " + pe_valormaximo;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_mensRango + pe_valorminimo + " .. " + pe_valormaximo);
////		}
                break;
	   default:
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensValFecha + "" + pe_strFmtFecha;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_mensValFecha + "" + pe_strFmtFecha);
////		}
         }
         document.getElementById(pe_objName).focus();
         document.getElementById(pe_objName).value = "";
	 return(false);
      }else{
	valida_event("onblur",pe_objName);
      }
    }

   function ValidarNumero(pe_objName,pe_decimal,pe_valorminimo,pe_valormaximo,pe_sepdec,pe_mensValNumero,pe_mensRango,pe_mensajeAceptar,pe_objMatriz)
    {
	  if (!IE && pe_objMatriz=="") agregar_onchange(pe_objName);
	  if (!IE && pe_objMatriz!="") agregar_onchangeM(pe_objMatriz,pe_objName);

      var estatus = esNumero(pe_objName,pe_decimal,pe_valorminimo,pe_valormaximo,pe_sepdec);
      if (estatus!=true)
      { switch(estatus)
         {
          case 2:
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensRango + pe_valorminimo + " .. " + pe_valormaximo;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_mensRango + pe_valorminimo + " .. " + pe_valormaximo);
////		}
	        break;
          default:
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensValNumero;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_mensValNumero);
////		}
	        break;
         }
        document.getElementById(pe_objName).focus();
        document.getElementById(pe_objName).value="";
	    return(false);
      }else{
	valida_event("onblur",pe_objName);
      }
    }

   function ValidarEntero(pe_objName,pe_valorminimo,pe_valormaximo,pe_sepdec,pe_mensValEntero,pe_mensRango,pe_mensajeAceptar)
    {
     var estatus = esEntero(pe_objName,pe_valorminimo,pe_valormaximo,pe_sepdec);
     if (estatus!=true)
      {  switch(estatus)
         {
          case 2:
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensRango + pe_valorminimo + " .. " + pe_valormaximo;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_mensRango + pe_valorminimo + " .. " + pe_valormaximo);
////		}
	        break;
	  default:
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensValEntero;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_mensValEntero);
////		}
	        break;
         }
        document.getElementById(pe_objName).focus();
        document.getElementById(pe_objName).value="";
	return(false);
      }else{
	valida_event("onblur",pe_objName);
      }
    }

   function ValidarHora(pe_objName,pe_mensValHora,pe_mensajeAceptar)
    {
     if (!esHora(pe_objName))
      {
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensValHora;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_mensValHora);
////		}
        document.getElementById(pe_objName).focus();
        document.getElementById(pe_objName).value="";
	return(false);
      }else{
	  valida_event("onblur",pe_objName);
      }
    }

   function ValidarLongitud(pe_Name,pe_maxcar,pe_MensValLong,pe_mensajeAceptar)
   {

    if (!limiteobservacion(pe_Name,pe_maxcar))
      {
        document.getElementById(pe_Name).focus();
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_MensValLong;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_MensValLong);
////		}
	return(false);
      }
       return(true);
    }

   function text_onblur(campoP)
   {
	valida_event("onblur",campoP);
   }

   function chk_alternativa(campoP)
   {
		if (document.getElementById(campoP).checked){
			document.getElementById(campoP).value = campoP + "****AlterT";
		}else{
			document.getElementById(campoP).value = campoP + "****AlterF";
		}

		return(true);
   }

 function gocalendar(objeto,left,top)
  //Funcion que realiza el expandir y colapsar de un grupo de objetos
  //que se encuentran agrupados en un DIV
  //Par�metros:
  // pe_Grupo: Nombre del objeto que agrupa los elementos
  //Retorna:
  // Que el objeto se muestre o se oculte
  //Desarrollado por: Oswel S�nchez.   Fecha: 04/2004
  {

		if (IE){
		      if (document.getElementById("wl_iframe").style.visibility == "hidden") //Expandir el grupo
		      {
			document.getElementById("wl_iframe").style.left = posX;
			document.getElementById("wl_iframe").style.top = posY;
			document.getElementById("wl_divcalendar").style.left = posX;
			document.getElementById("wl_divcalendar").style.top = posY;
			document.getElementById("wl_iframe").style.visibility= "visible";
			document.getElementById("wl_divcalendar").style.display = "";
		      }
		}else{
		      if (document.getElementById("wl_divcalendar").style.visibility == "hidden"){ //Expandir el grupo
			document.getElementById("wl_divcalendar").style.left = posX;
			document.getElementById("wl_divcalendar").style.top = posY;
			document.getElementById("wl_divcalendar").style.visibility = "visible";
		      }
		}
		document.getElementById("wl_opcfech").value = objeto;
  }

function setCookie(name, value, expires, path, domain, secure) {
  document.cookie = name + "=" + escape(value) +
  ((expires == null) ? "" : "; expires=" + expires.toGMTString()) +
  ((path == null) ? "" : "; path=" + path) +
  ((domain == null) ? "" : "; domain=" + domain) +
  ((secure == null) ? "" : "; secure");
}

  function salir()
 {
	 var k = new Date();
	 setCookie('tiempoinicial', k.getTime(), null, null,null,null);
 }

//funcionamiento AJAX
//objeto ajax
function obj_ajax(url,id,nb_matriz,param){
	this.id = id;
	this.http = getHTTPObject();//objeto que hace la peticion http
	this.st = false;//estatus(true,false)
	this.url = url;
	this.query = param;
	this.nb_matriz = nb_matriz;
}

function sendHttpMatriz(obj,nb_matriz) {
		function handleHttpResponse() {
		    if (obj.http.readyState == 4) {
		       if (obj.http.status == 200) {
		          if (obj.http.responseText.indexOf('invalid') == -1) {
					 objs_ocultosMT_P(nb_matriz);//verifico objetos ocultos
		             results = obj.http.responseText;
					 document.getElementById("CELDA_DIV_MATRIZ_"+obj.nb_matriz).innerHTML = results;
					 ocultar_objsMT_P(nb_matriz);//Oculto objetos de la matriz (Agregar,Borrar y Columna de Checks)
		             obj.st = false;
		             //revisar eventos
		             evaluar_event("onclick",obj.id);
		          }
		       }
		    }
		}
    if (!obj.st && obj.http) {
       obj.http.open("POST", obj.url, true);
	   obj.http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
       obj.http.onreadystatechange = handleHttpResponse;
       obj.st = true;
       obj.http.send(obj.query);
    }
}

function matriz_data(url,id_obj,nb_matriz,param){
	if (evaluar_event("onclick",id_obj,1)){
		//desabilitar demas opciones para esta matriz.
		try{
			document.getElementById("MATSE"+nb_matriz).disabled = true;
			document.getElementById("MATNV"+nb_matriz).disabled = true;
			document.getElementById("MATBO"+nb_matriz).disabled = true;
		}catch(e){}
		try{
			document.getElementById("MATANT"+nb_matriz).disabled = true;
		}catch(e){}
		try{
			document.getElementById("MATSIG"+nb_matriz).disabled = true;
	        }catch(e){}
		try{
			document.getElementById("MATSIGF"+nb_matriz).disabled = true;
	        }catch(e){}
		try{
			document.getElementById("MATANTI"+nb_matriz).disabled = true;
	        }catch(e){}
		//contruir cadena para guardar informaci�n.
		var linea_celdas = new String(obtener_valor("MATID"+nb_matriz));

		var campos_celdas = linea_celdas.split(",");
		var num_celdas = campos_celdas.length - 1;
		var apd_ult = Math.floor(parseInt(obtener_valor("MATTOT"+nb_matriz))/parseInt(obtener_valor("MATPAG"+nb_matriz)))*parseInt(obtener_valor("MATPAG"+nb_matriz)) + 1;
		var cad_datos = "wl_apd_old="+escape(obtener_valor("MATDESDE"+nb_matriz))+"&MATID"+nb_matriz+"="+escape(obtener_valor("MATID"+nb_matriz))+"&MATTOT"+nb_matriz+"="+escape(obtener_valor("MATTOT"+nb_matriz))+"&wl_nbmat="+nb_matriz+"&"+param;
		if (linea_celdas!=""){
			for(k=0;k<=num_celdas;k++){
				cad_datos = cad_datos + "&" + campos_celdas[k] + "=" + encodeURIComponent(obtener_valor(campos_celdas[k]));
			}
		}
		var obj_http = new obj_ajax(url,id_obj,nb_matriz,cad_datos);
		sendHttpMatriz(obj_http,nb_matriz);
		//limpiar nombre matriz de la estructura general
		var dt_act = obtener_valor("wl_camposm_onchange");
		var dt_modf = dt_act.replace(nb_matriz+",","");
		dt_modf = dt_modf.replace(","+nb_matriz,"");
		dt_modf = dt_modf.replace(nb_matriz,"");
		asignar_valor("wl_camposm_onchange",dt_modf);
	}
	//return(true);
}


function getHTTPObject() {
    var xmlhttp;
    /*@cc_on
    @if (@_jscript_version >= 5)
       try {
          xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
       } catch (e) {
          try {
             xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (E) { xmlhttp = false; }
       }
    @else
    xmlhttp = false;
    @end @*/
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
       try {
          xmlhttp = new XMLHttpRequest();
       } catch (e) { xmlhttp = false; }
    }
    return xmlhttp;
}

function deshabilitar_pagina(){
	try{
		document.getElementById("wl_bsolicitar").disabled = true;
		document.getElementById("wl_bsolicitar1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("wl_baprobar").disabled = true;
		document.getElementById("wl_baprobar1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("wl_bentregar").disabled = true;
		document.getElementById("wl_bentregar1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("wl_baceptar").disabled = true;
		document.getElementById("wl_baceptar1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("wl_bguardar").disabled = true;
		document.getElementById("wl_bguardar1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("wl_banular").disabled = true;
		document.getElementById("wl_banular1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("wl_bobjetar").disabled = true;
		document.getElementById("wl_bobjetar1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("wl_badquirir").disabled = true;
		document.getElementById("wl_badquirir1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("wl_brecuperar").disabled = true;
		document.getElementById("wl_brecuperar1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("wl_bborrar").disabled = true;
		document.getElementById("wl_bborrar1").disabled = true;
	}catch(e){}
	try{
		document.getElementById("anexar_link").disabled = true;
		document.getElementById("anexar_link").disabled = true;
	}catch(e){}
	try{
		document.getElementById("anexar_link").disabled = true;
		document.getElementById("anexar_link").disabled = true;
	}catch(e){}
	try{
		document.getElementById("cerrar_link").disabled = true;
		document.getElementById("cerrar_link").disabled = true;
	}catch(e){}
	try{
		document.onclick=function(){return false};
	}catch(e){}
}

function objs_ocultosMT_P(nb_matriz){
	try{

		if (document.getElementById('MATSE'+nb_matriz).style.display == "none"){//BOTON SELECCIONAR TODO
			btn_mat_se = true;
		}
		if (document.getElementById('MATNV'+nb_matriz).style.display == "none"){//BOTON AGREGAR
			btn_mat_nv = true;
		}
		if (document.getElementById('MATBO'+nb_matriz).style.display == "none"){//BOTON BORRAR
			btn_mat_bo = true;
		}
	}catch(e){}
}

function ocultar_objsMT_P(nb_matriz){
	try{
		if (btn_mat_se){//OCULTO BOTON SELECCIONAR TODO
			document.getElementById('MATSE'+nb_matriz).style.display ="none";
			OcultarCampo(nb_matriz,3,0);//oculto columna check
		}
		if (btn_mat_nv){//OCULTO BOTON AGREGAR
			document.getElementById('MATNV'+nb_matriz).style.display ="none";
		}
		if (btn_mat_bo){//OCULTO BOTON BORRAR
			document.getElementById('MATBO'+nb_matriz).style.display ="none";//oculto
			OcultarCampo(nb_matriz,3,0);//oculto columna check
		}
	}catch(e){}
}

function K_ListasAjaxCampo(campo, fila, columna)
{
	try
	{
		var options_xml =
		{	script:  function (input)
				{ return "AjaxListas.asp?campo="+campo+"&fila="+fila+"&columna="+columna+"&input="+input; },
			varname: "input"
		};
		if (fila == "0" && columna == "0")
			var as_xml = new bsn.AutoSuggest(campo, options_xml);
		else
			var as_xml = new bsn.AutoSuggest("M"+fila+campo+columna, options_xml);
	}
	catch(e) {}
}

function K_ListasAjaxMatriz(campo, columna)
{
	try
	{
		var filas = obtener_valor('fil'+campo);
		for (var i = 1; i <= filas; i++)
		{
			K_ListasAjaxCampo(campo, i, columna);
		}
	}
	catch(e) {}
}


function visualizar(nudoc,nuinst,wp,wfa)
{
 try{ var res = screen.width;
      window.open("Visualizador.asp?res="+res+"&wl_nudoc="+nudoc+"&wl_inst="+nuinst+"&wl_wff="+wp+"&wl_wfaf="+wfa,"Visualizador","height="+(screen.height*75)/100 +"px, width="+(screen.width*75)/100 +"px,status=1,toolbar=0,menubar=1,resizable=1,scrollbars=1");
    }
 catch(e) {}

}

function MatrizDinamica(nombre)
{
	MostrarCampo(nombre,1);
	MostrarCampo(nombre,3,0);
	return(true);
}
