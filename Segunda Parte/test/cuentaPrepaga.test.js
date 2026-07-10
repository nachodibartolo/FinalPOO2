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

   test("debitarSaldo puede debitar exactamente el monto en cuenta", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(100);
      cuenta.debitarSaldo(100);

      expect (cuenta.obtenerSaldo()).toBe(0);
   })

   test("puedoDebitar es true cuando el monto es exactamente igual al saldo", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(100);

      expect (cuenta.puedoDebitar(100)).toBe(true);
   })

   test("Debitar de una cuenta recién creada falla por saldo insuficiente", () => {

      const cuenta = new CuentaPrepaga();

      expect (() => cuenta.debitarSaldo(1)).toThrow("Saldo insuficiente");
   })

   test("Cargas sucesivas acumulan el saldo", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(100);
      cuenta.cargarSaldo(50);

      expect (cuenta.obtenerSaldo()).toBe(150);
   })

   test("Débitos sucesivos descuentan del saldo acumulado", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(600);
      cuenta.debitarSaldo(400);
      cuenta.debitarSaldo(150);

      expect (cuenta.obtenerSaldo()).toBe(50);
   })

   test("El saldo no cambia cuando el débito falla por saldo insuficiente", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(100);

      expect (() => cuenta.debitarSaldo(150)).toThrow("Saldo insuficiente");
      expect (cuenta.obtenerSaldo()).toBe(100);
   })

   test("El saldo no cambia cuando la carga falla por monto negativo", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(100);

      expect (() => cuenta.cargarSaldo(-50)).toThrow("No puede cargar numeros negativos");
      expect (cuenta.obtenerSaldo()).toBe(100);
   })

   test("El saldo no cambia cuando el débito falla por monto negativo", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(100);

      expect (() => cuenta.debitarSaldo(-50)).toThrow("No puede debitar numeros negativos");
      expect (cuenta.obtenerSaldo()).toBe(100);
   })

   test("Cargar 0 pesos está permitido y no modifica el saldo", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(0);

      expect (cuenta.obtenerSaldo()).toBe(0);
   })

   test("Debitar 0 pesos está permitido y no modifica el saldo", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(100);
      cuenta.debitarSaldo(0);

      expect (cuenta.obtenerSaldo()).toBe(100);
   })

   test("Se pueden cargar y debitar montos con decimales", () => {

      const cuenta = new CuentaPrepaga();

      cuenta.cargarSaldo(150.50);
      cuenta.debitarSaldo(100.25);

      expect (cuenta.obtenerSaldo()).toBe(50.25);
   })
});

