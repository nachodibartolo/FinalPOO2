"use strict";

const CuentaPrepaga = require("../src/dominio/CuentaPrepaga");

describe("Cuenta Prepaga", () => {
   test("Cuenta prepaga creada, comienza con saldo 0", () => {
      
      const cuenta = new CuentaPrepaga();

      expect (cuenta.obtenerSaldo()).toBe(0);
   });

   test("Comienza en 0, acredito 100 pesos", () => {
      
      const cuenta = new CuentaPrepaga();
      
      cuenta.cargarSaldo(100);
      
      expect (cuenta.obtenerSaldo()).toBe(100);
   })

   test("Le debito 50 pesos a una cuenta con 100 pesos", () => {
      
      const cuenta = new CuentaPrepaga();
      
      cuenta.cargarSaldo(100);
      cuenta.debitarSaldo(50);
      
      expect (cuenta.obtenerSaldo()).toBe(50);
   })

   test("puedoDebitar es true cuando el saldo a debitar es menor al saldo actual", () => {
      
      const cuenta = new CuentaPrepaga();
      
      cuenta.cargarSaldo(100);
      
      expect (cuenta.puedoDebitar(50)).toBe(true);
   })

   test("puedoDebitar es false cuando el saldo a debitar es mayor al saldo actual", () => {
      
      const cuenta = new CuentaPrepaga();
      
      cuenta.cargarSaldo(100);
      
      expect (cuenta.puedoDebitar(150)).toBe(false);
   })

   test("Le debito 150 pesos a una cuenta con 100 pesos, falla por saldo insuficiente", () => {
      
      const cuenta = new CuentaPrepaga();
      
      cuenta.cargarSaldo(100);
      
      expect (() => cuenta.debitarSaldo(150)).toThrow("Saldo insuficiente");
   })

   test("debitarSaldo tira error cuando intento debitar saldos negativos", () => {
      
      const cuenta = new CuentaPrepaga();
      
      cuenta.cargarSaldo(100);
      
      expect (() => cuenta.debitarSaldo(-150)).toThrow("No puede debitar numeros negativos");
   })

   test("cargarSaldo tira error cuando intento cargar saldos negativos", () => {
      
      const cuenta = new CuentaPrepaga();
      
      expect (() => cuenta.cargarSaldo(-1)).toThrow("No puede cargar numeros negativos");
   })
});

