console.log("load c_validarForma");
var IE = document.all?true:false;

//Archivo que tiene el conjunto de funciones para validar
//los campos del formulario.
//Tipo de Pagina: Include.
//Desarrollado por: Elis Velasquez. Fecha: 05/05/1999.

function Depurar(pe_valor,pe_sepdec)
//funcion que depura el numero para realizar operaciones
//matematicas
//Parametros:
// pe_valor: Valor del Numero a depurar
// pe_sepdec: Indica el separador de decimal
//Retorna:
//El numero depurado
//Desarrollado por: Elis Velasquez. Fecha: 13/10/1999.
//Modificado por: Elis Velasquez. Fecha: 29/04/2000
{
   valor = pe_valor;
   if (valor!="")
   {
    if (pe_sepdec == ",")
 	{ while (valor.indexOf(".")>=0)
	   { valor = valor.replace(".","");
	   }
	   //valor = valor.replace(",",".");
	 }
    else if (pe_sepdec== ".")
 	 {
	  while (valor.indexOf(",")>=0)
	  {
 	   valor = valor.replace(",","");
	  }
	 }
   }
   else
    valor = "0";
   return(valor)
}


function Depurar1(pe_valor,pe_sepdec)
//funcion que depura el numero para realizar operaciones
//Debido a problemas con isNaN.
//Parametros:
// pe_valor: Valor del Numero a depurar
// pe_sepdec: Indica el separador de decimal
//Retorna:
//El numero depurado
//Desarrollado por: Elis Velasquez. Fecha: 13/10/1999.
//Modificado por: Elis Velasquez. Fecha: 29/04/2000
{
   valor = pe_valor;
   if (valor!="")
   {
    if (pe_sepdec == ",")
 	{ while (valor.indexOf(".")>=0)
	   { valor = valor.replace(".","");
	   }
	   valor = valor.replace(",",".");
	 }
    else if (pe_sepdec== ".")
 	 {
	  while (valor.indexOf(",")>=0)
	  {
 	   valor = valor.replace(",","");
	  }
	 }
   }
   else
    valor = "0";
   return(valor)
}

function FormatNum(pe_valor,pe_sepdec,pe_decimal)
//Funcion que formatea el numero
//con separador de mil y de Decimal
//Parametros:
// pe_valor: Valor del Numero a depurar
// pe_sepdec: Indica el separador de decimal
//Retorna:
//El numero depurado
//Desarrollado por: Elis Velasquez. Fecha: 13/10/1999.
//Modificado por: Elis Velasquez. Fecha: 29/04/2000
{
  pe_valor = Depurar(pe_valor,pe_sepdec);
  pe_valor = pe_valor.toString();
  //Separo primero el numero dado el separador decimal
  posDec = pe_valor.indexOf(pe_sepdec);
  if (posDec>=0)
  {
    var longiDecimales = pe_valor.length - posDec - 1;
    pe_valor = "" + (Math.round(parseFloat(Depurar1(pe_valor,pe_sepdec)) * Math.pow(10, parseInt(pe_decimal)))/Math.pow(10, parseInt(pe_decimal)));
    posDec = pe_valor.indexOf(".");
    if (posDec>=0){
	    var parteMiles = pe_valor.substring(0,posDec);
	    longiDecimales = pe_valor.length - posDec - 1;
	    if (pe_decimal!=0){
		    if (longiDecimales<pe_decimal){
			var parteDecimal = pe_sepdec + pe_valor.substring(posDec+1,posDec+1+longiDecimales);
			for(j=1;j<=pe_decimal-longiDecimales;j++){
			    parteDecimal = parteDecimal + "0";
			}
		    }else{
			var parteDecimal = pe_sepdec + pe_valor.substring(posDec+1,posDec+1+pe_decimal);
		    }
	    }else{
		var parteDecimal = "";
	    }
    }else{
	var parteMiles = pe_valor;
	var parteDecimal = "";
	if (pe_decimal!=0)  parteDecimal = pe_sepdec;
	for(i=1;i<=pe_decimal;i++){
		parteDecimal = parteDecimal + "0";
	}
    }
  }
  else
  { var parteMiles = pe_valor;
    var parteDecimal = "";
    if (pe_decimal!=0)  parteDecimal = pe_sepdec;
    for(i=1;i<=pe_decimal;i++){
	parteDecimal = parteDecimal + "0";
    }
  }
  if (pe_sepdec==".")
    pe_sepmil =",";
  else
    pe_sepmil = ".";
  lon = parteMiles.length;
  while (lon>3)
  { parteMiles = parteMiles.substring(0,lon-3)+pe_sepmil+parteMiles.substring(lon-3);
    lon = lon-3;
  }
  pe_valor = parteMiles+parteDecimal;
  return(pe_valor);
 }


function obtenerFloat(pe_valor,pe_sepdec)
//Funci�n que elimina las comas de un float
//Par�metros:
//	pe_valor: valor de entrada
//      pe_sepdec: separador de decimal especificado en el servidor
//Retorna: el valor del float si el n�mero es v�lido
//         cero si el n�mero es inv�lido
//Desarrollado por: Johann Brice�o.  Fecha: 14/07/1999
//Modificado por: Elis Velasquez. Fecha: 29/04/2000
{    if (pe_valor!="")
     {
      valor = Depurar1(pe_valor,pe_sepdec);
	  if (!isNaN(parseFloat(valor)))
	    return parseFloat(valor);
	  else
	    return 0;
	 }
	 else
	  return 0;
}

function esFecha(pe_objName,pe_strFmtFecha,pe_valorminimo,pe_valormaximo)
 //Funcion que valida si la fecha cumple con el formato , y si este es una fecha valida
 //Par�metros:
 //  pe_ObjName: Nombre del Objeto donde esta contenido la fecha
 //  pe_strFmtFecha: Formato de fecha que debe cumplir la cadena
 //  pe_valorminimo: Valor minimo del rango de Fechas
 //  pe_valormaximo: Valor maximo del rango de Fechas.
 //Retorna:
 // 0 = No esta completa la fecha
 // 2 = No cumple con el formato
 // 3 = No es una fecha valida
 // 4 = No es un a�o valido
 // 5 = No es un mes valido
 // 6 = No es un d�a valido
 // 7 = No esta dentro del rango valido
 //  True, si la fecha es valida
 //Desarrollado por: Elis Velasquez.  Fecha:06/05/1999.
 //Modificado por: Elis Velasquez.   Fecha:29/04/2000.
 {
    var myValue = document.getElementById(pe_objName).value+"";

    if (myValue.length == 0) return true;
    if (myValue.length < 10) return 0;
    if ( (myValue.substring(2,3) != pe_strFmtFecha.substring(2,3) ) || (myValue.substring(5,6) != pe_strFmtFecha.substring(5,6)) )
      return 2;

    posDD = pe_strFmtFecha.indexOf("DD");
    posMM = pe_strFmtFecha.indexOf("MM");
    posYYYY = pe_strFmtFecha.indexOf("YYYY");

    myDD   	= parseInt(myValue.substring(posDD,posDD+2),10);		// extrae dia
    myMM   	= parseInt(myValue.substring(posMM,posMM+2),10); 		// extrae mes
    myYYYY	= parseInt(myValue.substring(posYYYY,posYYYY+4),10);		// extrae a�o

    if ( (isNaN(myDD)) || (isNaN(myMM)) || ( isNaN(myYYYY)) ) return 3;
    if (myYYYY < 1000) return 4;
    if ( (myMM > 12) || (myMM <= 0) ) return 5;

    var lastDate = CalcNumDiasMes(myYYYY,myMM);
    if ( (myDD > lastDate) || (myDD <=0) ) return 6;

    //Comparacion con los rangos de la fecha
    minDD   = pe_valorminimo.substring(posDD,posDD+2);		// extrae dia minimo
    minMM   = pe_valorminimo.substring(posMM,posMM+2); 		// extrae mes
    minYYYY = pe_valorminimo.substring(6,10);		// extrae a�o

    maxDD   = pe_valormaximo.substring(posDD,posDD+2);
    maxMM   = pe_valormaximo.substring(posMM,posMM+2);
    maxYYYY = pe_valormaximo.substring(posYYYY,posYYYY+4);

    myDD   	= myValue.substring(posDD,posDD+2);		// extrae dia
    myMM   	= myValue.substring(posMM,posMM+2); 		// extrae mes
    myYYYY	= myValue.substring(posYYYY,posYYYY+4);		// extrae a�o

    myMax = maxYYYY+maxMM+maxDD;
    myMin = minYYYY+minMM+minDD;
    myValue = myYYYY+myMM+myDD;
    if (myValue<myMin||myValue>myMax) return 7;
    return true;
 }

function esNumero(pe_objName,pe_decimal,pe_valorminimo,pe_valormaximo,pe_sepdec)
//Funcion que valida si es un numero el valor del Objeto
//Par�metros:
// pe_objName: Nombre del Objeto.
// pe_valorminimo: Valor minimo del rango de valores.
// pe_valormaximo: Valor maximo del rango de valores.
// pe_decimal: numero de lugares del decimal.
// pe_sepdec: Simbolo de separador de decimal.
//Retorna: 0 = No es un numero valido
//         2 = No se encuentra dentro del rango
//         3 = El valor minimo es mayor que el valor maximo, error en el dise�o
//         True, si es un numero flotante
//Desarrollado por: Elis Velasquez.  Fecha:07/05/1999
//Modificado por: Elis Velasqeuz.  Fecha: 29/04/2000
{
	var Valor = document.getElementById(pe_objName).value;
	if (Valor == "") return true;
	if(isNaN(Depurar1(Valor,pe_sepdec))) return 0;
	if (Valor!=null)
	{
		////if (parseFloat(Depurar1(Valor,pe_sepdec))==0) return true;
		//Validacion de los lugares del Decimal
		////if (obtenerFloat(Valor,pe_sepdec))
		////{
			posDec = Valor.indexOf(pe_sepdec);
			if (pe_decimal>0&&posDec>=0)
				document.getElementById(pe_objName).value = FormatNum(Valor,pe_sepdec,pe_decimal);
			else if (pe_decimal==0&&posDec>=0)
				document.getElementById(pe_objName).value = FormatNum(Valor,pe_sepdec,pe_decimal);
			else if (pe_decimal>0&&posDec<0)
				document.getElementById(pe_objName).value = FormatNum(Valor,pe_sepdec,pe_decimal);
			else if (pe_decimal==0&&posDec<0)
				document.getElementById(pe_objName).value = FormatNum(Valor,pe_sepdec,pe_decimal);
			else
				document.getElementById(pe_objName).value = FormatNum(Valor,pe_sepdec,pe_decimal);

			if (pe_valorminimo!=null && pe_valormaximo!=null)
			{
				ValorMin = obtenerFloat(pe_valorminimo);
				ValorMax = obtenerFloat(pe_valormaximo);
				Valor = obtenerFloat(Valor,pe_sepdec);

				if (ValorMin<=ValorMax)
				{
					if (Valor<ValorMin||Valor>ValorMax)
						return 2;
				}
				else
					return 3;
			}
     	////}
    	////else
      	////	return 0;
  	}
  	return true;
 }

function esEntero(pe_objName,pe_valorminimo,pe_valormaximo,pe_sepdec)
//Funcion que valida si es un Numero entero, sin decimales
//Par�metros:
//  pe_objName: Nombre del Objeto
//  pe_valorminimo: Valor minimo del rango de valores.
//  pe_valormaximo: Valor maximo del rango de valores.
//Retorna:
//  False, no es un numero entero
//  true, es un numero entero
//Desarrollado por: Elis Velasquez.  Fecha:07/05/1999
//Modificado por: Elis Velasquez.  Fecha: 29/04/2000
 {
   var myvalue = document.getElementById(pe_objName).value;
   if (myvalue.length>0)
    {
     var estatus = esNumero(pe_objName,0,pe_valorminimo,pe_valormaximo,pe_sepdec);
     if (estatus==true)
     {
      var result = FormatNum(myvalue,pe_sepdec,0);//parseInt(myvalue) + "";
      document.getElementById(pe_objName).value = result;
      return true;
     }
     else
      return estatus;
    }
   return true;
 }

function esHora(pe_objName)
//Funcion que valida si es una hora valida
//Par�metros:
//  pe_objName: Nombre del objeto
//Retorna:
//  false, no es una hora valida
//  true,  es una hora valida
//Desarrollado por: Elis Velasquez.   Fecha:07/05/1999
//Modificado por: Johann Brice�o.     Fecha:01/07/1999
//Modificado por: Elis Velasquez.     Fecha:29/04/2000
 {
  var Valor = document.getElementById(pe_objName).value;
  if (Valor.length==0)
     return true;
  if (Valor.length!=8)
     return false;

  var myhh = Valor.substring(0,2)+"";
  var myoper = 	Valor.substring(2,3)+"";
  var mymm = Valor.substring(3,5)+"";
  var myespacio = Valor.substring(5,6)+"";
  var myit = Valor.substring(6,8)+"";

  if (myoper != ":") return false;
  if (isNaN(myhh)||isNaN(mymm))  return false;
  if (myhh<0||myhh>12) return false;
  if (mymm<0||mymm>59) return false;
  if (myespacio != " ") return false;
  if ((myit.toUpperCase() != "AM") && (myit.toUpperCase() != "PM")) return false;

  return true;
 }


 function esBisiesto (pe_Year)
//Funcion que indica si el a�o es bisiesto
//Par�metros:
// pe_Year: A�o a validar si es bisiesto
//Retorna:
// False, si no es bisiesto
// True, si es bisiesto
// Desarrollado por: Elis Velasquez. Fecha: 07/05/1999
  {
   if (((pe_Year % 4)==0) && ((pe_Year % 100)!=0) || ((pe_Year % 400)==0))
     return (true);
   else
     return (false);
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


function limiteobservacion(pe_observacion,pe_maxcar)
//Regula que una observaci�n tenga a lo sumo 100 caracteres.
//Parametros:
// pe_observacion: Nombre de la observaci�n(campo) a validar.
// pe_maxcar: numero maximo de caracteres permitidos en la observacion
//Retorna:	True, si el numero de caracteres de la observaci�n
//			es menor al m�ximo permitido.
//			False, en caso contrario.
//Desarrollado por:	Ramiro Aliaga	Fecha:	06/09/1999.
//Modificado por: Elis Velasquez.  Fecha:20/04/2000.
  { var observ = document.getElementById(pe_observacion).value;
	var numcaracteres = observ.length;
	if (numcaracteres>pe_maxcar)
		{	document.getElementById(pe_observacion).focus();
			document.getElementById(pe_observacion).value = observ.substring(0,pe_maxcar-1);
            return false
		}
    return true;
  }


 function checkEmail(emailAddr) {
	// this function checks for a well-formed e-mail address
	// in the format:
	// user@domain.com

	var i;

	// check for @
	i = emailAddr.indexOf("@");
	if (i == -1) {
		return false;
	}

	// separate the user name and domain
	var username = emailAddr.substring(0, i);
	var domain = emailAddr.substring(i + 1, emailAddr.length)

	// look for spaces at the beginning of the username
	i = 0;
	while ((username.substring(i, i + 1) == " ") && (i < username.length)) {
		i++;
	}
	// remove any found
	if (i > 0) {
		username = username.substring(i, username.length);
	}

	// look for spaces at the end of the domain
	i = domain.length - 1;
	while ((domain.substring(i, i + 1) == " ") && (i >= 0)) {
		i--;
	}
	// remove any found
	if (i < (domain.length - 1)) {
		domain = domain.substring(0, i + 1);
	}

	// make sure neither the username nor domain is blank
	if ((username == "") || (domain == "")) {
		return false;
	}

	// check for bad characters in the username
	var ch;
	for (i = 0; i < username.length; i++) {
		ch = (username.substring(i, i + 1)).toLowerCase();
		if (!(((ch >= "a") && (ch <= "z")) ||
			((ch >= "0") && (ch <= "9")) ||
			(ch == "_") || (ch == "-") || (ch == "."))) {
				return false;
		}
	}


	var index = domain.indexOf(".");
	var predomain = domain.substring(0, index)
	var postdomain = domain.substring(index + 1, domain.length);

	if (predomain == "") return(false);

	// check for bad characters in the predomain
	for (i = 0; i < predomain.length; i++) {
		ch = (predomain.substring(i, i + 1)).toLowerCase();
		if (!((ch == "_") || (ch == "-") ||
		      ((ch >= "a") && (ch <= "z")) ||
		      ((ch >= "0") && (ch <= "9")))) {
				return false;
		}
	}


	// check for bad characters in the postdomain
	for (i = 0; i < postdomain.length; i++) {
		ch = (postdomain.substring(i, i + 1)).toLowerCase();
		if (!((ch == ".") || ((ch >= "a") && (ch <= "z")) || ((ch >= "0") && (ch <= "9")) )) {
				return false;
		}
	}

	return true;
}

function emailOK(emailAddr,pe_Mensaje,pe_mensajeAceptar) {
	if (!(checkEmail(emailAddr))) {
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensaje;
			mat["icono"] = "images/Alerta.gif";
			//doDialog(mat);
			alertmb(pe_mensaje,2,1,pe_mensajeAceptar);
////		}else{
////			alert(pe_mensaje);
////		}
		return false;
	}
  return true;
}
