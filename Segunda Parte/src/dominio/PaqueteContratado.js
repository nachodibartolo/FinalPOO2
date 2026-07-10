"use strict";

const comportamientoConsumible = require("./comportamientoConsumible");

const PaqueteContratado = function(paquete, fechaDeCompra){
   Object.assign(this, comportamientoConsumible);
   this.paquete = paquete;
   this.fechaDeCompra = fechaDeCompra;
   this.datosDisponibles = paquete.megabytes();
   this.minutosDisponibles = paquete.minutos;

   this.descontarDatosDe = function(app, megabytes){
      [megabytes]
         .filter(cantidad => !this.paquete.esIlimitada(app))
         .forEach(cantidad => this.descontarDatos(cantidad));
   };

   this.fechaDeVencimiento = function(){
      const vencimiento = new Date(this.fechaDeCompra);
      vencimiento.setDate(vencimiento.getDate() + this.paquete.duracionEnDias);
      return vencimiento;
   };
};

module.exports = PaqueteContratado;
