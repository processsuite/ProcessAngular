function AnexoArchivo(
    matriz,//Nombre de matriz
    dirvir, //directorio virtual
    dirfis, //Directorio fisico
    colBotAnex,//columna donde se muestra el boton para anexar
    colBotCons,//columna donde se muestra boton para consultar el archivo
    colRuta,//columna donde se guarda la ruta
    sufijo//sufijo
){
      let fila = obtener_valor("fil"+matriz)
      let sec = fila;
      for(x=1;x<=fila;x++){
            valor = '<a href=javascript:abrir_ventana("'+ matriz + '","' + x + '","' + sufijo + '",' + colBotCons + ',' + colRuta  + ',"'+dirvir+'","'+dirfis+'");><i class="fa fa-paperclip" style="color:black"></i></a>';
            asignar_valorM( matriz , valor , x , colBotAnex);


            if($('#M'+x+matriz+colRuta).val() != "" && $('#M'+fila+matriz+colRuta).val() != undefined){
              $('#M'+x+matriz+colBotCons).val("<a href=javascript:abrir_archivo(" + x + ",'"+ matriz +"'," +  colRuta +  ") ><i class='fa fa-file' style='color:black'></i>");
              $('#M'+x+matriz+colBotCons).trigger('input');
            }
      }
      return true;
}

function abrir_ventana(matriz,sec,sufijo,colver,colruta,dirvir,dirfis){
  console.log("ventana");

  let interpretar = sufijo.match(/\{([^{}]*[^{}]*)\}/g);
  let variable = "";
  if(interpretar!= null && interpretar.length > 0){
      angular.forEach(interpretar,function(k,v){
          console.log(k)
          variable = k.replace('{','').replace('}','')
          sufijo = obtener_valor(variable)
      });
  }

  if(interpretar!= null && interpretar.length > 0 && sufijo =="" && variable != "" ){
    alertmb("Debe llenar el campo <span style='color:red'>"+$("#"+variable).parent().children('div').children('label').children('span').html()+"</span> para poder adjuntar el archivo", 1,1, 'Aceptar')
    return false;
  }

  angular.element($('[name=\"documentForm\"]')).scope().openAnexoConsultoriaModal(matriz, sec, sufijo, obtener_valor(dirvir), obtener_valor(dirfis),colruta, colver);
//  asignar_valorM(matriz,"<a href=javascript:abrir_archivo(" + sec + ",'"+ matriz +"'," +  colruta +  ") ><i class='fa fa-file' style='color:black'></i>",sec,colver);
}

function abrir_archivo(sec,matriz,col){
 angular.element($('[name=\"documentForm\"]')).scope().openLink(obtener_valorM(matriz,sec,col));
}
