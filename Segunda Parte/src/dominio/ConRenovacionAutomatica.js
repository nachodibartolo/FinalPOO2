"use strict";

const ConRenovacionAutomatica = function(){
   this.renovarSiCorresponde = function(cliente, fecha){
      cliente.paquetesRenovables(fecha).forEach(paquete => cliente.comprarPaquete(paquete, fecha));
   };
};

module.exports = ConRenovacionAutomatica;
