"use strict";

const PaqueteConAppIlimitada = function(paquete, app){
   this.paquete = paquete;
   this.app = app;
   this.gigabytes = paquete.gigabytes;
   this.minutos = paquete.minutos;
   this.duracionEnDias = paquete.duracionEnDias;
   this.costo = paquete.costo;

   this.megabytes = function(){
      return this.paquete.megabytes();
   };

   this.esIlimitada = function(app){
      return app === this.app || this.paquete.esIlimitada(app);
   };
};

module.exports = PaqueteConAppIlimitada;
