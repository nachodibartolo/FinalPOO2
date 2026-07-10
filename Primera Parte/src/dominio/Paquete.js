"use strict";

const MB_POR_GB = 1024;

const Paquete = function(gigabytes, minutos, duracionEnDias, costo){
   this.gigabytes = gigabytes;
   this.minutos = minutos;
   this.duracionEnDias = duracionEnDias;
   this.costo = costo;

   this.megabytes = function(){
      return this.gigabytes * MB_POR_GB;
   };
};

module.exports = Paquete;
