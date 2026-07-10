"use strict";

const ConsumoInternet = function(megabytes, fechaHoraInicio, fechaHoraFin){
   this.megabytes = megabytes;
   this.fechaHoraInicio = fechaHoraInicio;
   this.fechaHoraFin = fechaHoraFin;

   this.descontarDe = function(paqueteContratado){
      paqueteContratado.descontarDatos(this.megabytes);
   };

   this.ocurrioEntre = function(desde, hasta){
      return this.fechaHoraInicio >= desde && this.fechaHoraInicio <= hasta;
   };
};

module.exports = ConsumoInternet;
