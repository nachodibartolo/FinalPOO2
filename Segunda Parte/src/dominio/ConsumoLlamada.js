"use strict";

const ConsumoLlamada = function(minutos, fechaHoraInicio, fechaHoraFin){
   this.minutos = minutos;
   this.fechaHoraInicio = fechaHoraInicio;
   this.fechaHoraFin = fechaHoraFin;

   this.descontarDe = function(paqueteContratado){
      paqueteContratado.descontarMinutos(this.minutos);
   };

   this.ocurrioEntre = function(desde, hasta){
      return this.fechaHoraInicio >= desde && this.fechaHoraInicio <= hasta;
   };
};

module.exports = ConsumoLlamada;
