"use strict";

const CuentaPrepaga = function(){
   this.saldo = 0;

   this.obtenerSaldo = function(){
      return this.saldo;
   };

   this.cargarSaldo = function(monto){
      if (this.esMontoNegativo(monto)){
         throw new Error("No puede cargar numeros negativos")
      }
      this.saldo += monto;
   };

   this.debitarSaldo = function(monto){
      if (this.esMontoNegativo(monto)){
         throw new Error("No puede debitar numeros negativos")
      }
      if (!this.puedoDebitar(monto)){
         throw new Error("Saldo insuficiente")
      }
      this.saldo -= monto;
   };

   this.puedoDebitar = function(monto){
      return this.saldo >= monto;
   };

   this.esMontoNegativo = function(monto){
      return monto < 0;
   };
};

module.exports = CuentaPrepaga;
