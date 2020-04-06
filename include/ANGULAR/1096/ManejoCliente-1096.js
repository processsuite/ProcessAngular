function objectToString(o){   
    var parse = function(_o){
        var a = [], t;
        for(var p in _o){
            if(_o.hasOwnProperty(p)){
                t = _o[p];
                if(t && typeof t == "object"){
                    a[a.length]= p + ":{ " + arguments.callee(t).join(", ") + "}";
                }
                else {
                    if(typeof t == "string"){
                        a[a.length] = [ p+ ": \"" + t.toString() + "\"" ];
                    }
                    else{
                        a[a.length] = [ p+ ": " + t.toString()];
                    }
                }
            }
        }
        return a;
    }
    return "{" + parse(o).join(", ") + "}";
}


function ValidarFilas(matriz,reglas) {             

  var filas = $("#fil"+matriz).val(); //$('#'+matriz+' >tbody >tr').length -1;
  var celda,strRegla,strColumna,objRegla;

  for (fila=1;fila<=filas;fila++)
   {
     for(col=0;col<reglas.length;col++)
      { celda = $("#M"+fila+reglas[col][0]);
                    if (celda.rules.length>2)
            celda.rules('remove');
        // Se pregunta si en la regla hacen referencia a una columna para convertila en celda e incorporarlo
        // La columna se identifica por que esta encerrado entre ::
       strRegla = objectToString(reglas[col][1]);
       while (strRegla.indexOf("::") > 0 )
               { 
                   strColumna = strRegla.substring(strRegla.indexOf("::")+2,strRegla.indexOf("::",strRegla.indexOf("::") +1));
                   strRegla = strRegla.replace("::"+strColumna+"::","#M"+fila+strColumna);
               }
        eval("celda.rules('add',"+ strRegla + ")");     
      }
    }
 }

 function ValidarFilaDinamica(matriz,fila,reglas) {             
   var celda,strRegla,strColumna,objRegla;
     for(col=0;col<reglas.length;col++)
      { celda = $("#M"+fila+reglas[col][0]);
                    if (celda.rules.length>2)
            celda.rules('remove');
        // Se pregunta si en la regla hacen referencia a una columna para convertila en celda e incorporarlo
        // La columna se identifica por que esta encerrado entre ::
       strRegla = objectToString(reglas[col][1]);
       while (strRegla.indexOf("::") > 0 )
               { 
                   strColumna = strRegla.substring(strRegla.indexOf("::")+2,strRegla.indexOf("::",strRegla.indexOf("::") +1));
                   strRegla = strRegla.replace("::"+strColumna+"::","#M"+fila+strColumna);
               }
        eval("celda.rules('add',"+ strRegla + ")");     
      }
 }
function CamposObligatorios(e_lstcampos){
   for (i=0;i<e_lstcampos.length;i++)
      $("#"+e_lstcampos[i]).html( $("#"+e_lstcampos[i]).html()+'&nbsp;<i class="fas fa-asterisk" ng-show="stringToBooleanM(col.obligatorio)" style="color: #db4437;font-size: 9px;vertical-align: top;"></i>' );

   return true;
}


