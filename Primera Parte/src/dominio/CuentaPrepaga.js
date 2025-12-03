"use strict";

const CuentaPrepaga = function(){
   this.saldo = 0;
};

CuentaPrepaga.prototype.obtenerSaldo = function(){
   return this.saldo;
};

CuentaPrepaga.prototype.cargarSaldo = function(monto){
   if (this.esMontoNegativo(monto)){
      throw new Error("No puede cargar numeros negativos")
   }
   this.saldo += monto;
};

CuentaPrepaga.prototype.debitarSaldo = function(monto){
   if (this.esMontoNegativo(monto)){
      throw new Error("No puede debitar numeros negativos")
   }
   if (!this.puedoDebitar(monto)){
      throw new Error("Saldo insuficiente")
   }
   this.saldo -= monto;
}

CuentaPrepaga.prototype.puedoDebitar = function(monto){
   return this.saldo >= monto;
}

CuentaPrepaga.prototype.esMontoNegativo = function(monto){
   return monto < 0;
}

module.exports = CuentaPrepaga;