"use strict";

const comportamientoConsumible = require("./comportamientoConsumible");

const Prestamo = function(datos, minutos, fechaDeVencimientoDelPrestamo){
   Object.assign(this, comportamientoConsumible);
   this.datosDisponibles = datos;
   this.minutosDisponibles = minutos;
   this.vencimiento = fechaDeVencimientoDelPrestamo;

   this.fechaDeVencimiento = function(){
      return this.vencimiento;
   };

   this.descontarDatosDe = function(app, megabytes){
      this.descontarDatos(megabytes);
   };
};

module.exports = Prestamo;
