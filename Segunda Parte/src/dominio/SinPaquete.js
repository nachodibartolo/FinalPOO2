"use strict";

const SinPaquete = function(){
   this.obtenerDatosDisponibles = function(){
      return 0;
   };

   this.obtenerMinutosDisponibles = function(){
      return 0;
   };

   this.estaAgotado = function(){
      return true;
   };

   this.estaVencido = function(fecha){
      return true;
   };
};

module.exports = SinPaquete;
