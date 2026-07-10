"use strict";

const comportamientoConsumible = {

   obtenerDatosDisponibles: function(){
      return this.datosDisponibles;
   },

   obtenerMinutosDisponibles: function(){
      return this.minutosDisponibles;
   },

   descontarDatos: function(megabytes){
      this.validarCantidadPositiva(megabytes);
      this.validarDisponibilidad(megabytes, this.datosDisponibles, "No hay datos suficientes disponibles");
      this.datosDisponibles -= megabytes;
   },

   descontarMinutos: function(minutos){
      this.validarCantidadPositiva(minutos);
      this.validarDisponibilidad(minutos, this.minutosDisponibles, "No hay minutos suficientes disponibles");
      this.minutosDisponibles -= minutos;
   },

   validarCantidadPositiva: function(cantidad){
      if (cantidad < 0){
         throw new Error("No puede descontar cantidades negativas");
      }
   },

   validarDisponibilidad: function(cantidad, disponible, mensaje){
      if (cantidad > disponible){
         throw new Error(mensaje);
      }
   },

   puedoDescontar: function(datos, minutos){
      return this.datosDisponibles >= datos && this.minutosDisponibles >= minutos;
   },

   estaAgotado: function(){
      return this.datosDisponibles === 0 && this.minutosDisponibles === 0;
   },

   estaVencido: function(fecha){
      return fecha > this.fechaDeVencimiento();
   }
};

module.exports = comportamientoConsumible;
