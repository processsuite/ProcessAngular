function CamposObligatorios(e_lstcampos){
   for (i=0;i<e_lstcampos.length;i++)
      $("#"+e_lstcampos[i]).html( $("#"+e_lstcampos[i]).html()+'&nbsp;<i class="fas fa-asterisk" ng-show="stringToBooleanM(col.obligatorio)" style="color: #db4437;font-size: 9px;vertical-align: top;"></i>' );

   return true;
}
