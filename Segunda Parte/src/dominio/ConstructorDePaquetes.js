"use strict";

const Paquete = require("./Paquete");
const PaqueteConAppIlimitada = require("./PaqueteConAppIlimitada");

const ConstructorDePaquetes = function(){
   this.gigabytes = 0;
   this.minutos = 0;
   this.duracionEnDias = 0;
   this.costo = 0;
   this.appsIlimitadas = [];

   this.conGigabytes = function(gigabytes){
      this.gigabytes = gigabytes;
      return this;
   };

   this.conMinutos = function(minutos){
      this.minutos = minutos;
      return this;
   };

   this.conDuracionEnDias = function(duracionEnDias){
      this.duracionEnDias = duracionEnDias;
      return this;
   };

   this.conCosto = function(costo){
      this.costo = costo;
      return this;
   };

   this.conAppIlimitada = function(app){
      this.appsIlimitadas.push(app);
      return this;
   };

   this.construir = function(){
      return this.appsIlimitadas.reduce(
         (paquete, app) => new PaqueteConAppIlimitada(paquete, app),
         new Paquete(this.gigabytes, this.minutos, this.duracionEnDias, this.costo)
      );
   };
};

module.exports = ConstructorDePaquetes;
