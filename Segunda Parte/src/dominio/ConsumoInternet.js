"use strict";

const ConsumoInternet = function(megabytes, app, fechaHoraInicio, fechaHoraFin){
   this.megabytes = megabytes;
   this.app = app;
   this.fechaHoraInicio = fechaHoraInicio;
   this.fechaHoraFin = fechaHoraFin;

   this.descontarDe = function(paqueteContratado){
      paqueteContratado.descontarDatosDe(this.app, this.megabytes);
   };

   this.ocurrioEntre = function(desde, hasta){
      return this.fechaHoraInicio >= desde && this.fechaHoraInicio <= hasta;
   };
};

module.exports = ConsumoInternet;
