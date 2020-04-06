console.log("load EventProcess");
var IE = document.all?true:false;
//arreglo que contien una pila de eventos a ser ejecutados.
var PilaEvents = new Array();
var PilaMatriz = new Array();//almacena la informacion de las matrices.
var PilaCmpActual = "";

//Rutina que valida los campo de Process y ejecuta los eventos si estos exiten en la Pila
function valida_event(tipoE,campoP){
//Parametros:
//   tipoE: Es el tipo de evento html....onblur,onclick,onchance...etc.
//   campoP: Es el campo Process al cual se aplicara el evento html.
	evaluar_event(tipoE,campoP);
}

//objeto para las entradas en la Pila de eventos.
function list_events(tipoE,nbfuncion,campoP,orden){
	this.tipoE = tipoE;
	this.nbfuncion = nbfuncion;
	this.campoP = campoP;
	this.orden = orden;//1-antes,0-despues
}

//objeto para las entradas de las matrices.
function list_matriz(nbM,Columna,tipoE,nbfuncion){
	this.NombreMatriz = nbM;
	this.Columna = Columna;
	this.tipoE = tipoE;
	this.nbfuncion = nbfuncion;
}


//agrega una entrada en la Pila de eventos.
function asignar_event(tipoE,nbfuncion,campoP,orden){
try{
	if (orden==undefined){
		orden = 0;
	}
	var longitudPila = PilaEvents.length;
	if (longitudPila == 0){
	   PilaEvents[0] = new list_events(tipoE,nbfuncion,campoP,orden);
	}else{
	   //verificar si la entrada existe?...
	   var k = 0;
	   for(k=0;k<longitudPila;k++){
		if ((PilaEvents[k].tipoE==tipoE)&&(PilaEvents[k].nbfuncion==nbfuncion)&&(PilaEvents[k].campoP==campoP)&&(PilaEvents[k].orden==orden)) break;
	   }
	   if (k==longitudPila){//agrego la nueva entrada
		PilaEvents[longitudPila] = new list_events(tipoE,nbfuncion,campoP,orden);
	   }
	}
	var evento = "";
	eval("evento=document.getElementById('"+campoP+"')."+tipoE+";");

	//if ((tipoE!="onblur")&&(tipoE!="onchange")){
	if ((evento=="")||(evento==null)){
		function generico(){
			valida_event(tipoE,campoP);
		}
		if (document.getElementById(campoP).type != "radio"){
			eval("var cp=document.getElementById('"+campoP+"'); cp."+tipoE+"=generico");
		}else{
			var items = document.getElementsByName(campoP).length;
			var l = 0;
			for(l=0;l<items;l++){
				eval("document.getElementsByName('"+campoP+"').item("+l+")."+tipoE+"=generico");
			}
		}
	}
}catch(e){}
}

//agrega entradas en la Pila de eventos, para una matriz en una columna especifica....
function asignar_event_matriz(tipoE,nbfuncion,campoP,columna){
try{
	var longitudMatriz = PilaMatriz.length;
	if (longitudMatriz == 0){
	   PilaMatriz[0] = new list_matriz(campoP,columna,tipoE,nbfuncion);
	}else{
	   //verificar si la entrada existe?...
	   var k = 0;
	   for(k=0;k<longitudMatriz;k++){
		if ((PilaMatriz[k].tipoE==tipoE)&&(PilaMatriz[k].Columna==columna)&&(PilaMatriz[k].NombreMatriz==campoP)&&(PilaMatriz[k].nbfuncion==nbfuncion)) break;
	   }
	   if (k==longitudMatriz){//agrego la nueva entrada
		PilaMatriz[longitudMatriz] = new list_matriz(campoP,columna,tipoE,nbfuncion);
	   }
	}

	var numfilas = document.getElementById("fil"+campoP).value;
	var i = 1;
	for(i=1;i<=numfilas;i++){
		asignar_event(tipoE,nbfuncion,"M"+i+campoP+columna);
	}
}catch(e){}
}

//evalua una entrada en la Pila de eventos.
function evaluar_event(tipoE,campoP,orden){
try{
	var longitudPila = PilaEvents.length;
        var i = 0;
	var ret = false;
	var retorno = true;
	if (orden==undefined){
		orden = 0;
	}
	for(i=0;i<longitudPila;i++){
		if ((PilaEvents[i].tipoE.replace('on','')==tipoE.replace('on',''))&&(PilaEvents[i].campoP==campoP)&&(PilaEvents[i].orden==orden)){
			PilaCmpActual = campoP;
			ret = eval(PilaEvents[i].nbfuncion);
			PilaCmpActual;
			if ((ret!=true)&&(ret!=false)){
////				if (IE){
					var mat = new Array();
					mat["cantB"] = 1;
					mat["boton1"] = "<input class='GrupoAcc' type='button' value='Aceptar' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
					mat["mensaje"] ="Manejo Cliente: La rutina: ["+PilaEvents[i].nbfuncion+"] retorn� un valor no v�lido. Los valores posibles son true o false.";
					mat["icono"] = "images/Alerta.gif";
					doDialog(mat);
////				}else{
////					alert("Manejo Cliente: La rutina: ["+PilaEvents[i].nbfuncion+"] retorn� un valor no v�lido. Los valores posibles son true o false.");
////				}
				retorno = false;
				break;
			}else if (!ret){
				retorno = false;
				break;
			}
		}
	}

	return(retorno);
}catch(e){}
}

//Reasignar todos los eventos para la matriz (M),se deberia usar solo cuando se agrega.
function reconstruir_matriz_event(M){
	var longitudMatriz = PilaMatriz.length;
        var i = 0;
	for(i=0;i<longitudMatriz;i++){
		if(M == PilaMatriz[i].NombreMatriz){
			asignar_event_matriz(PilaMatriz[i].tipoE,PilaMatriz[i].nbfuncion,M,PilaMatriz[i].Columna);
		}
	}
}

//Reasignar todos los eventos onchange para la matriz (M),se deberia usar solo cuando se elimina.
function activar_onchange_matriz(M){
	var longitudMatriz = PilaMatriz.length;
        var i = 0;
	for(i=0;i<longitudMatriz;i++){
		if((M == PilaMatriz[i].NombreMatriz) && (PilaMatriz[i].tipoE == "onchange")){
			evaluar_event("onchange","M1"+M+PilaMatriz[i].Columna);
		}
	}
}

//rutina que suma todos los valores de una columna de una matriz y lo coloca en otra campo matriz.
function suma(matriz_ori,col_ori,matriz_des,col_des){
try{
	var numfilas = document.getElementById("fil"+matriz_ori).value;
	var i = 1;
	var total = 0;
	for(i=1;i<=numfilas;i++){
		total = total + parseFloat(Depurar1(document.getElementById("M"+i+matriz_ori+col_ori).value,Formatodec));
	}
	var valor = new String(total);
	try{
		document.getElementById("SPAN_M1"+matriz_des+col_des).innerHTML = FormatNum(valor.replace(".",Formatodec),Formatodec,2);
	}catch(e){}
	try{
		document.getElementById("M1"+matriz_des+col_des).value = FormatNum(valor.replace(".",Formatodec),Formatodec,2);
		//document.getElementById("M1"+matriz_des+col_des).onchange();
		$("#"+matriz_des+col_des).change();
	}catch(e){}
	return(true);
}catch(e){}
}

//rutina auxiliar para asignar valores a campos Process(No matriz) y avisar que han cambiado.
function asignar_valor(campoP,valor,index){
try{
	if (document.getElementById(campoP).tagName=="SELECT"){
		var num_list = document.getElementById(campoP).length;
		var i = 0;
		for(i=0;i<num_list;i++){
			if (document.getElementById(campoP).item(i).getAttribute("value")){
				if (document.getElementById(campoP).item(i).getAttribute("value")==valor){
					document.getElementById(campoP).selectedIndex = i;
					//document.getElementById(campoP).onchange();
					$("#"+campoP).change();
					break;
				}
			}
			if (document.getElementById(campoP).item(i).text==valor){
					document.getElementById(campoP).selectedIndex = i;
					//document.getElementById(campoP).onchange();
					$("#"+campoP).change();
					break;
			}
		}
  }else if (document.getElementById(campoP).type=="checkbox"){
			if (valor == "T"){
				document.getElementById(campoP).checked = true;
				//document.getElementById(campoP).onchange();
				$("#"+campoP).change();
			}else{
				document.getElementById(campoP).checked = false;
				//document.getElementById(campoP).onchange();
				$("#"+campoP).change();
			}
	}else if (document.getElementById(campoP).type=="radio"){
		//document.getElementById(campoP).type=="radio"
			if (valor == "T"){
				document.getElementsByName(campoP).item(index).checked = true;
				//document.getElementById(campoP).onclick();
				$("input[value='"+$("input[name='"+campoP+"']")[index].value+"']").click()
				//$("#"+campoP).change();
				//$("input[name='"+campoP+"']").click();
				$("#"+$("input[name='"+campoP+"']")[index].value).click();
			}else{
				document.getElementsByName(campoP).item(index).checked = false;
				//document.getElementById(campoP).onclick();
				$("input[value='"+$("input[name='"+campoP+"']")[index].value+"']").change()
				//$("#"+campoP).change();
				//$("#"+$("input[name='"+campoP+"']")[index].ide).click();
			}
	}else{
		try{
		    document.getElementById("SPAN_"+campoP).innerHTML = valor;

		}
		catch(e){
				document.getElementById(campoP).innerHTML = valor;
		}
		try{
		    document.getElementById(campoP).value = valor;
		    //document.getElementById(campoP).onchange();
				$("#"+campoP).change();
		}catch(e){}
	}
	return(true);
}catch(e){}
}

//rutina auxiliar para asignar valores a campos Process(solo matriz) y avisar que han cambiado.
function asignar_valorM(campoP,valor,fila,columna){
try{
	if (document.getElementById("M"+fila+campoP+columna).tagName=="SELECT"){
		var num_list = document.getElementById("M"+fila+campoP+columna).length;
		var i = 0;
		for(i=0;i<num_list;i++){
			if (document.getElementById("M"+fila+campoP+columna).item(i).getAttribute("value")){
				if (document.getElementById("M"+fila+campoP+columna).item(i).getAttribute("value")==valor){
					document.getElementById("M"+fila+campoP+columna).selectedIndex = i;
					$("#M"+fila+campoP+columna).change();
					break;
				}
			}
			if (document.getElementById("M"+fila+campoP+columna).item(i).text==valor){
					document.getElementById("M"+fila+campoP+columna).selectedIndex = i;
					$("#M"+fila+campoP+columna).change();
					break;
			}
		}
        }else{
		try{
		    document.getElementById("SPAN_M"+fila+campoP+columna).innerHTML = valor;
		}
		catch(e){}
		try{
			if (document.getElementById("M"+fila+campoP+columna).type=="checkbox"){
				if (valor == "T"){
					document.getElementById("M"+fila+campoP+columna).checked = true;
					$("#M"+fila+campoP+columna).change();
				}else{
					document.getElementById("M"+fila+campoP+columna).checked = false;
					$("#M"+fila+campoP+columna).change();
				}
			}else{
				$("#M"+fila+campoP+columna).val(valor);
				$("#M"+fila+campoP+columna).change();
			}
		}catch(e){}
	}
	return(true);
}catch(e){}
}

//rutina auxiliar para obtener valores de campos Process(No matriz).
function obtener_valor(campoP,index){
	try{
	    if (document.getElementById(campoP).tagName=="SELECT"){
					if (index==undefined){
						index = 0;
					}
					if (index==0){
						if (document.getElementById(campoP).item(document.getElementById(campoP).selectedIndex).getAttribute("value")){
							var val = document.getElementById(campoP).item(document.getElementById(campoP).selectedIndex).getAttribute("value")
							if(val.split(":").length>0){
								return val.split(":")[1];
							}
							return val;
						}else{
							return(document.getElementById(campoP).item(document.getElementById(campoP).selectedIndex).text);
						}
					}else{
						return(document.getElementById(campoP).item(document.getElementById(campoP).selectedIndex).text);
					}
        }
		if (document.getElementById(campoP).type=="checkbox"){
			if (document.getElementById(campoP).checked){
				return("T");
			}else{
				return("F");
			}
	    }else if (document.getElementById(campoP).type=="radio"){
			if (document.getElementsByName(campoP).item(index).checked){
				return("T");
			}else{
				return("F");
			}
	    }else{
			if (index==undefined){
				index = 0;
			}
			if (index==0){
				return(document.getElementById(campoP).value);
			}else{
				return(document.getElementById("SPAN_"+campoP).innerHTML);
			}
        }
	}
	catch(e){}
}

//rutina auxiliar para obtener valores de campos Process(solo matriz).
function obtener_valorM(campoP,fila,columna,tipo){
	try{
	    if (tipo==undefined){
			tipo = 0;
	    }
	   /* if (document.getElementById("M"+fila+campoP+columna).tagName=="SELECT"){
			if (tipo==0){
				var r = document.getElementById("M"+fila+campoP+columna).item(document.getElementById("M"+fila+campoP+columna).selectedIndex).getAttribute("value").split(":");
				if(r.length == 2)
					return(r[1]);
				else
					return(document.getElementById("M"+fila+campoP+columna).item(document.getElementById("M"+fila+campoP+columna).selectedIndex).getAttribute("value"));
			}else{
				return(document.getElementById("M"+fila+campoP+columna).item(document.getElementById("M"+fila+campoP+columna).selectedIndex).text);
			}
        }else{
			if (tipo==0){
				if (document.getElementById("M"+fila+campoP+columna).type=="checkbox"){
					if (document.getElementById("M"+fila+campoP+columna).checked){
						return("T");
					}else{
						return("F");
					}
				}else{
					return(document.getElementById("M"+fila+campoP+columna).value);
				}
			}else{
				return(document.getElementById("SPAN_M"+fila+campoP+columna).innerHTML);
			}
		}*/
		return angular.element($('[name="documentForm"]')).scope().obtenerValorMAng(campoP, fila, columna);
	}
	catch(e){}
}

//rutina que agrega un campo process que ha cambiado a la lista
function agregar_onchange(campoP){
try{
        var campos_onchange = new String(document.getElementById("wl_campos_onchange").value);
	if (campos_onchange == ""){
	      campos_onchange = campoP;
	}else{
	    var list_change = campos_onchange.split(",");
	    var num_change = list_change.length - 1;
	    var st = 0;
	    for(i=0;i<=num_change;i++){
		if (list_change[i] == campoP){
			st = 1;
			break;
		}
    	    }
	    if (st == 0) campos_onchange = campos_onchange + "," + campoP;
	}
	document.getElementById("wl_campos_onchange").value = campos_onchange;
    	valida_event("onchange",campoP);//ejecuta las demas llamadas registradas del evento onchange.
}catch(e){}
}


//rutina que agrega un campo process que ha cambiado a la lista
function agregar_onchangeM(nombre_matriz,campoP){
try{
        var camposm_onchange = new String(document.getElementById("wl_camposm_onchange").value);
	if (camposm_onchange == ""){
	      camposm_onchange = nombre_matriz;
	}else{
	    var list_change = camposm_onchange.split(",");
	    var num_change = list_change.length - 1;
	    var st = 0;
	    for(i=0;i<=num_change;i++){
		if (list_change[i] == nombre_matriz){
			st = 1;
			break;
		}
    	    }
	    if (st == 0) camposm_onchange = camposm_onchange + "," + nombre_matriz;
	}
	document.getElementById("wl_camposm_onchange").value = camposm_onchange;
	//agregar el id del campo a la estructura interna de la matriz.
        var camposid_onchange = new String(document.getElementById("MATID"+nombre_matriz).value);
	if (camposid_onchange == ""){
	      camposid_onchange = campoP;
	}else{
	    var listid_change = camposid_onchange.split(",");
	    var numid_change = listid_change.length - 1;
	    var st_id = 0;
	    for(i=0;i<=numid_change;i++){
		if (listid_change[i] == campoP){
			st_id = 1;
			break;
		}
    	    }
	    if (st_id == 0) camposid_onchange = camposid_onchange + "," + campoP;
	}
	document.getElementById("MATID"+nombre_matriz).value = camposid_onchange;

	valida_event("onchange",campoP);//ejecuta las demas llamadas registradas del evento onchange.
}catch(e){}
}

//obtiene el numero de fila donde se realizo un evento dentro de una matriz.
function id_fila(e){
try{
	if (!IE){
		 var obj = e.target.id; // Netscape
		 alert("Netscape-->"+e.target);
	}else{
		 var obj = event.srcElement.id;  // Internet Explorer
	}
	return(document.getElementById(obj).parentNode.parentNode.childNodes[0].childNodes[0].getAttribute("value"));
}catch(e){}
}

function get_fila(pMatriz){
	try
	{
		var f = 0;
		if(PilaCmpActual != "" && pMatriz != "")
		{
			if(PilaCmpActual.indexOf(pMatriz) >= 0)
			{
				f = parseInt(PilaCmpActual.substr(1,PilaCmpActual.indexOf(pMatriz) - 1));
			}
		}
	return(f);
}
	catch(e)
	{
		return(-1);
	}
}

function cambiarCampo(campoP, col, tipo){
	angular.element($('[name="documentForm"]')).scope().cambioInpu(campoP,tipo, col);
}


//convierte un campo process en tipo password.
function convertir_password(campoP,col){


try{
	angular.element($('[name="documentForm"]')).scope().cambioInpu(campoP,'Z', col);
	/*var tipo = document.getElementById(campoP).type;
	if((tipo!="select-one")&&(tipo!="radio")&&(tipo!="checkbox")){
		if (!IE){
			if (col != undefined){
				num_filas = parseInt(obtener_valor("fil"+campoP));
				for(var i=1;i<=num_filas;i++){
					var nb_campoP = "M"+i+campoP+col;
					var html = document.getElementById(nb_campoP).parentNode.innerHTML;
					html = html.replace("type=\"text\"","type=\"password\"");
					document.getElementById(nb_campoP).parentNode.innerHTML = html;
				}
			}else{
				var html = document.getElementById(campoP).parentNode.innerHTML;
				html = html.replace("type=\"text\"","type=\"password\"");
				document.getElementById(campoP).parentNode.innerHTML = html;
			}
		}else{
			if (col != undefined){
				num_filas = parseInt(obtener_valor("fil"+campoP));
				for(var i=1;i<=num_filas;i++){
					var nb_campoP = "M"+i+campoP+col;
					var html = document.getElementById(nb_campoP).parentNode.innerHTML;
					html = html.replace("type=\"text\"","type=\"password\"");
					document.getElementById(nb_campoP).parentNode.innerHTML = html;
				}
			}else{
				var html = document.getElementById(campoP).parentNode.innerHTML;
				var pre_html = html.substring(0,html.indexOf("id"));
				var pre_html = pre_html + "type='password' " + html.substring(html.indexOf("id"),html.length);
				document.getElementById(campoP).parentNode.innerHTML = pre_html;
			}
		}
	}*/
	return(true);
}catch(e){return(false)}
}

function cambiar_nombre(nb_obj,valor,op,nu_form){
try{
	if (op==undefined){
		op = 0;
	}
	switch(op){
		case 0://cambiar un link cualquiera
			try{
				if (nb_obj == "wl_bguardar")
					document.getElementById(nb_obj).innerHTML = "<img id='wl_bguardar' src='images/save.gif' border='0'/>&nbsp;" + valor;
				else if (nb_obj == "anexar_link")
					document.getElementById(nb_obj).innerHTML = "<img id='anexar_link' src='images/anexa.gif' border='0'/>&nbsp;" + valor;
				else
					document.getElementById(nb_obj).innerHTML = valor;
			}
			catch(e){}
			break;
		case 1://cambiar el nombre a un grupo.
			try{
				document.getElementById("nbgrupo_"+nb_obj).innerHTML = valor;
			}catch(e){}
			break;
		case 2://cambiar el nombre a formulario.
			try{
				document.getElementById("formulario_"+nb_obj).innerHTML = valor;
				document.getElementById("formulario_"+nb_obj+"1").innerHTML = valor;
				document.getElementById("formulario_"+nu_form).innerHTML = valor;
			}catch(e){}
			break;
		case 3://cambiar el nombre a un evento
			try{
				document.getElementById("evento_"+nb_obj).innerHTML = valor;
			}catch(e){}
			break;
		case 4://cambiar la descripci�n
			try{
				if ((document.getElementById(nb_obj).type=="checkbox")||(document.getElementById(nb_obj).type=="radio")){
					if (nu_form==1){
						document.getElementById(nb_obj).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerHTML = "<img src='images/obligatorio.gif' alt='' hspace='3'>" + valor;
					}else{
						document.getElementById(nb_obj).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerHTML = valor;
					}
			        }else{
					if (nu_form==1){
						document.getElementById(nb_obj).parentNode.parentNode.childNodes[0].innerHTML = "<img src='images/obligatorio.gif' alt='' hspace='3'>" + valor;
					}else{
						document.getElementById(nb_obj).parentNode.parentNode.childNodes[0].innerHTML = valor;
					}

				}
			}catch(e){}
			break;
	}
	return(true);
}catch(e){}
}

//convierte un campo process en tipo file.
function convertir_file(campoP,col){
try{
	var nb_campoP = campoP;
	if (col != undefined){
		num_filas = parseInt(obtener_valor("fil"+campoP));
		for(var i=1;i<=num_filas;i++){
			nb_campoP = "M"+i+campoP+col;
			var size = parseInt(document.getElementById(nb_campoP).style.width);
			document.getElementById(nb_campoP).style.width = "85%";
			var tipo = document.getElementById(nb_campoP).type;
			document.getElementById(nb_campoP).style.background = "#C0C0C0";
			var html = document.getElementById(nb_campoP).parentNode.innerHTML;
			document.getElementById(nb_campoP).parentNode.innerHTML = "<div class='Fileinputs'>"+
				"<input type='file' UNSELECTABLE='on' name='file_"+nb_campoP+"' id='file_"+nb_campoP+"' style='width:85%' class='File' onchange='Javascript:"+nb_campoP+".value=this.value;"+nb_campoP+".onchange();'>"+
				"<div class='Fakefile'>"+
				html +
				"<img src='images/folder.gif'>"+
				"</div>"+
				"</div>";
		}
	}else{
		var size = document.getElementById(nb_campoP).size;
		document.getElementById(nb_campoP).style.background = "#C0C0C0";
		var html = document.getElementById(nb_campoP).parentNode.innerHTML;
		var tipo = document.getElementById(nb_campoP).type;
		document.getElementById(nb_campoP).parentNode.innerHTML = "<div class='Fileinputs'>"+
			"<input type='file' UNSELECTABLE='on' name='file_"+nb_campoP+"' id='file_"+nb_campoP+"' size='"+size+"' class='File' onchange='Javascript:"+nb_campoP+".value=this.value;"+nb_campoP+".onchange();'>"+
			"<div class='Fakefile'>"+
			html +
			"<img src='images/folder.gif'>"+
			"</div>"+
			"</div>";
	}
	return(true);
}catch(e){return(false)}
}

function obliga(nb_obj)
{
  var valor = $("#DES"+nb_obj).text();
  document.getElementById(nb_obj).parentNode.parentNode.childNodes[0].innerHTML = "<img src='images/obligatorio.gif' alt='' hspace='3'>" + valor;
  return true;
}

function obtenerDataServices(idquery, param){
	/*
	idquery = Idendificador del servicio a consumir.
	param = let param = [];
	param.push(["parametro1","valor1"])
	param.push(["parametro2","valor2"])
	*/
	let ajax = angular.element($('[name=\"documentForm\"]')).scope().ajaxDataServices(idquery, param);

	return ajax;

	/*obtenerDataServices('query3','').then(function(data){
	console.log(data);
})*/
}

function refrescarListaManejoCliente(campo, col, opciones){
	/*Las opciones se deben enviar de la siguiente ModalUploadAnexoConsultoria
	"OPCION": [{            "seleccionado": null,
													"codigo": "01",
													"value": "AMAZONAS"
											}, {
													"seleccionado": null,
													"codigo": "02",
													"value": "ANCASH"
											}
						 ]
	*/
	let ajax = angular.element($('[name=\"documentForm\"]')).scope().refrescarListaManejoCliente(campo, col, opciones);
	return ajax;

}
