"use strict";

const PaqueteContratado = require("./PaqueteContratado");
const SinPaquete = require("./SinPaquete");
const SinRenovacion = require("./SinRenovacion");
const ConRenovacionAutomatica = require("./ConRenovacionAutomatica");
const Prestamo = require("./Prestamo");

const Cliente = function(nombreCompleto, numeroDeLinea, cuentaPrepaga){
   this.nombreCompleto = nombreCompleto;
   this.numeroDeLinea = numeroDeLinea;
   this.cuenta = cuentaPrepaga;
   this.paqueteActual = new SinPaquete();
   this.paquetesComprados = [];
   this.consumos = [];
   this.renovacion = new SinRenovacion();
   this.prestamosOtorgados = [];
   this.prestamosRecibidos = [];

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

   this.prestar = function(receptor, datos, minutos, fecha){
      receptor.validarPuedeRecibirPrestamo(fecha);
      this.validarPaqueteVigente(fecha);
      this.validarDisponibilidadParaPrestar(datos, minutos);
      this.paqueteActual.descontarDatos(datos);
      this.paqueteActual.descontarMinutos(minutos);
      const prestamo = new Prestamo(datos, minutos, this.paqueteActual.fechaDeVencimiento());
      this.prestamosOtorgados.push(prestamo);
      receptor.recibirPrestamo(prestamo);
   };

   this.recibirPrestamo = function(prestamo){
      this.prestamosRecibidos.push(prestamo);
      this.paqueteActual = prestamo;
   };

   this.validarPuedeRecibirPrestamo = function(fecha){
      if (this.tienePaqueteVigente(fecha)){
         throw new Error("El receptor debe tener un paquete o préstamo vencido o agotado");
      }
   };

   this.validarDisponibilidadParaPrestar = function(datos, minutos){
      if (!this.paqueteActual.puedoDescontar(datos, minutos)){
         throw new Error("No tiene suficientes datos o minutos para prestar");
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
