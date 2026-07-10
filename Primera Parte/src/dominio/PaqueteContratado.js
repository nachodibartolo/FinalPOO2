"use strict";

const PaqueteContratado = function(paquete, fechaDeCompra){
   this.paquete = paquete;
   this.fechaDeCompra = fechaDeCompra;
   this.datosDisponibles = paquete.megabytes();
   this.minutosDisponibles = paquete.minutos;

   this.obtenerDatosDisponibles = function(){
      return this.datosDisponibles;
   };

   this.obtenerMinutosDisponibles = function(){
      return this.minutosDisponibles;
   };

   this.descontarDatos = function(megabytes){
      this.validarCantidadPositiva(megabytes);
      this.validarDisponibilidad(megabytes, this.datosDisponibles, "No hay datos suficientes disponibles");
      this.datosDisponibles -= megabytes;
   };

   this.descontarMinutos = function(minutos){
      this.validarCantidadPositiva(minutos);
      this.validarDisponibilidad(minutos, this.minutosDisponibles, "No hay minutos suficientes disponibles");
      this.minutosDisponibles -= minutos;
   };

   this.validarCantidadPositiva = function(cantidad){
      if (cantidad < 0){
         throw new Error("No puede descontar cantidades negativas");
      }
   };

   this.validarDisponibilidad = function(cantidad, disponible, mensaje){
      if (cantidad > disponible){
         throw new Error(mensaje);
      }
   };

   this.estaAgotado = function(){
      return this.datosDisponibles === 0 && this.minutosDisponibles === 0;
   };

   this.fechaDeVencimiento = function(){
      const vencimiento = new Date(this.fechaDeCompra);
      vencimiento.setDate(vencimiento.getDate() + this.paquete.duracionEnDias);
      return vencimiento;
   };

   this.estaVencido = function(fecha){
      return fecha > this.fechaDeVencimiento();
   };
};

module.exports = PaqueteContratado;
