"use strict";

const CuentaPrepaga = require("../src/dominio/CuentaPrepaga");
const Paquete = require("../src/dominio/Paquete");
const Cliente = require("../src/dominio/Cliente");
const ConsumoInternet = require("../src/dominio/ConsumoInternet");
const ConsumoLlamada = require("../src/dominio/ConsumoLlamada");

describe("Préstamos entre clientes", () => {

   const FECHA_DE_COMPRA = new Date(2024, 0, 1);
   const FECHA_DEL_PRESTAMO = new Date(2024, 0, 10);

   const paqueteGrande = () => new Paquete(2.5, 1000, 30, 400);

   const crearClienteConPaquete = () => {
      const cliente = new Cliente("Juan Pérez", "1122334455", new CuentaPrepaga());
      cliente.cargarSaldo(400);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);
      return cliente;
   };

   const crearClienteSinPaquete = () => new Cliente("Ana García", "1155667788", new CuentaPrepaga());

   test("Prestar descuenta los datos y minutos del paquete del que presta", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();

      emisor.prestar(receptor, 500, 100, FECHA_DEL_PRESTAMO);

      expect (emisor.obtenerDatosDisponibles()).toBe(2060);
      expect (emisor.obtenerMinutosDisponibles()).toBe(900);
   })

   test("Prestar deja los datos y minutos disponibles en el receptor", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();

      emisor.prestar(receptor, 500, 100, FECHA_DEL_PRESTAMO);

      expect (receptor.obtenerDatosDisponibles()).toBe(500);
      expect (receptor.obtenerMinutosDisponibles()).toBe(100);
   })

   test("El préstamo queda registrado en el que presta y en el que recibe", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();

      emisor.prestar(receptor, 500, 100, FECHA_DEL_PRESTAMO);

      expect (emisor.prestamosOtorgados.length).toBe(1);
      expect (receptor.prestamosRecibidos.length).toBe(1);
      expect (emisor.prestamosOtorgados[0]).toBe(receptor.prestamosRecibidos[0]);
   })

   test("Se puede prestar solo datos o solo minutos", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();

      emisor.prestar(receptor, 500, 0, FECHA_DEL_PRESTAMO);

      expect (receptor.obtenerDatosDisponibles()).toBe(500);
      expect (receptor.obtenerMinutosDisponibles()).toBe(0);
   })

   test("El receptor consume de su préstamo y le queda registrado el consumo", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();
      emisor.prestar(receptor, 500, 100, FECHA_DEL_PRESTAMO);

      receptor.registrarConsumo(new ConsumoInternet(200, "Chrome", new Date(2024, 0, 11, 10, 0), new Date(2024, 0, 11, 11, 0)));
      receptor.registrarConsumo(new ConsumoLlamada(30, new Date(2024, 0, 11, 12, 0), new Date(2024, 0, 11, 12, 30)));

      expect (receptor.obtenerDatosDisponibles()).toBe(300);
      expect (receptor.obtenerMinutosDisponibles()).toBe(70);
      expect (receptor.historialDeConsumos().length).toBe(2);
   })

   test("El préstamo vence cuando vence el paquete del que presta", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();

      emisor.prestar(receptor, 500, 100, FECHA_DEL_PRESTAMO);

      expect (receptor.prestamosRecibidos[0].fechaDeVencimiento()).toEqual(new Date(2024, 0, 31));

      const consumoPosteriorAlVencimiento = new ConsumoInternet(200, "Chrome", new Date(2024, 1, 5, 10, 0), new Date(2024, 1, 5, 11, 0));

      expect (() => receptor.registrarConsumo(consumoPosteriorAlVencimiento)).toThrow("No tiene un paquete vigente");
   })

   test("No se puede prestar a un receptor con un paquete vigente", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteConPaquete();

      expect (() => emisor.prestar(receptor, 500, 100, FECHA_DEL_PRESTAMO))
         .toThrow("El receptor debe tener un paquete o préstamo vencido o agotado");
      expect (emisor.obtenerDatosDisponibles()).toBe(2560);
      expect (emisor.obtenerMinutosDisponibles()).toBe(1000);
   })

   test("No se puede prestar a un receptor con un préstamo vigente", () => {

      const emisor = crearClienteConPaquete();
      const otroEmisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();
      otroEmisor.prestar(receptor, 500, 100, FECHA_DEL_PRESTAMO);

      expect (() => emisor.prestar(receptor, 200, 50, FECHA_DEL_PRESTAMO))
         .toThrow("El receptor debe tener un paquete o préstamo vencido o agotado");
   })

   test("Un receptor con su préstamo agotado puede recibir un préstamo nuevo", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();
      emisor.prestar(receptor, 500, 0, FECHA_DEL_PRESTAMO);
      receptor.registrarConsumo(new ConsumoInternet(500, "Chrome", new Date(2024, 0, 11, 10, 0), new Date(2024, 0, 11, 11, 0)));

      emisor.prestar(receptor, 200, 50, new Date(2024, 0, 12));

      expect (receptor.obtenerDatosDisponibles()).toBe(200);
      expect (receptor.obtenerMinutosDisponibles()).toBe(50);
      expect (receptor.prestamosRecibidos.length).toBe(2);
   })

   test("Sin un paquete vigente no se puede prestar", () => {

      const emisor = crearClienteSinPaquete();
      const receptor = crearClienteSinPaquete();

      expect (() => emisor.prestar(receptor, 500, 100, FECHA_DEL_PRESTAMO)).toThrow("No tiene un paquete vigente");
   })

   test("No se puede prestar más de lo disponible y no se descuenta nada", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();

      expect (() => emisor.prestar(receptor, 500, 2000, FECHA_DEL_PRESTAMO))
         .toThrow("No tiene suficientes datos o minutos para prestar");
      expect (emisor.obtenerDatosDisponibles()).toBe(2560);
      expect (emisor.obtenerMinutosDisponibles()).toBe(1000);
      expect (receptor.prestamosRecibidos.length).toBe(0);
   })

   test("Un receptor con un préstamo vigente no puede comprar un paquete", () => {

      const emisor = crearClienteConPaquete();
      const receptor = crearClienteSinPaquete();
      emisor.prestar(receptor, 500, 100, FECHA_DEL_PRESTAMO);
      receptor.cargarSaldo(400);

      expect (() => receptor.comprarPaquete(paqueteGrande(), FECHA_DEL_PRESTAMO)).toThrow("Ya tiene un paquete vigente");
   })
});
