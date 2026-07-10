"use strict";

const PaqueteContratado = require("./PaqueteContratado");
const SinPaquete = require("./SinPaquete");
const SinRenovacion = require("./SinRenovacion");
const ConRenovacionAutomatica = require("./ConRenovacionAutomatica");

const Cliente = function(nombreCompleto, numeroDeLinea, cuentaPrepaga){
   this.nombreCompleto = nombreCompleto;
   this.numeroDeLinea = numeroDeLinea;
   this.cuenta = cuentaPrepaga;
   this.paqueteActual = new SinPaquete();
   this.paquetesComprados = [];
   this.consumos = [];
   this.renovacion = new SinRenovacion();

   this.cargarSaldo = function(monto){
      this.cuenta.cargarSaldo(monto);
   };

   this.obtenerSaldo = function(){
      return this.cuenta.obtenerSaldo();
   };

   this.obtenerDatosDisponibles = function(){
      return this.paqueteActual.obtenerDatosDisponibles();
   };

   this.obtenerMinutosDisponibles = function(){
      return this.paqueteActual.obtenerMinutosDisponibles();
   };

   this.activarRenovacionAutomatica = function(){
      this.renovacion = new ConRenovacionAutomatica();
   };

   this.desactivarRenovacionAutomatica = function(){
      this.renovacion = new SinRenovacion();
   };

   this.comprarPaquete = function(paquete, fechaDeCompra){
      this.validarPuedeComprar(fechaDeCompra);
      this.cuenta.debitarSaldo(paquete.costo);
      this.paqueteActual = new PaqueteContratado(paquete, fechaDeCompra);
      this.paquetesComprados.push(paquete);
   };

   this.tienePaqueteVigente = function(fecha){
      return !this.paqueteActual.estaVencido(fecha) && !this.paqueteActual.estaAgotado();
   };

   this.puedeComprar = function(fecha){
      return !this.tienePaqueteVigente(fecha);
   };

   this.validarPuedeComprar = function(fecha){
      if (!this.puedeComprar(fecha)){
         throw new Error("Ya tiene un paquete vigente");
      }
   };

   this.registrarConsumo = function(consumo){
      this.renovacion.renovarSiCorresponde(this, consumo.fechaHoraInicio);
      this.validarPaqueteVigente(consumo.fechaHoraInicio);
      consumo.descontarDe(this.paqueteActual);
      this.consumos.push(consumo);
   };

   this.validarPaqueteVigente = function(fecha){
      if (!this.tienePaqueteVigente(fecha)){
         throw new Error("No tiene un paquete vigente");
      }
   };

   this.paquetesRenovables = function(fecha){
      return this.paquetesComprados
         .slice(-1)
         .filter(paquete => this.puedeComprar(fecha))
         .filter(paquete => this.cuenta.puedoDebitar(paquete.costo));
   };

   this.historialDeConsumos = function(){
      return [...this.consumos].sort((unConsumo, otroConsumo) => unConsumo.fechaHoraInicio - otroConsumo.fechaHoraInicio);
   };

   this.historialDeConsumosEntre = function(desde, hasta){
      return this.historialDeConsumos().filter(consumo => consumo.ocurrioEntre(desde, hasta));
   };
};

module.exports = Cliente;
