"use strict";

const CuentaPrepaga = require("../src/dominio/CuentaPrepaga");
const Paquete = require("../src/dominio/Paquete");
const Cliente = require("../src/dominio/Cliente");
const ConsumoInternet = require("../src/dominio/ConsumoInternet");
const ConsumoLlamada = require("../src/dominio/ConsumoLlamada");

describe("Cliente", () => {

   const FECHA_DE_COMPRA = new Date(2024, 0, 1);

   const crearCliente = () => new Cliente("Juan Pérez", "1122334455", new CuentaPrepaga());
   const paqueteGrande = () => new Paquete(2.5, 1000, 30, 400);
   const paqueteChico = () => new Paquete(1, 100, 7, 150);

   test("Un cliente se crea con su nombre completo, número de línea y una cuenta con saldo 0", () => {

      const cliente = crearCliente();

      expect (cliente.nombreCompleto).toBe("Juan Pérez");
      expect (cliente.numeroDeLinea).toBe("1122334455");
      expect (cliente.obtenerSaldo()).toBe(0);
   })

   test("Un cliente sin paquete no tiene datos ni minutos disponibles", () => {

      const cliente = crearCliente();

      expect (cliente.obtenerDatosDisponibles()).toBe(0);
      expect (cliente.obtenerMinutosDisponibles()).toBe(0);
   })

   test("Cargar saldo al cliente lo acredita en su cuenta prepaga", () => {

      const cliente = crearCliente();

      cliente.cargarSaldo(500);

      expect (cliente.obtenerSaldo()).toBe(500);
   })

   test("Comprar un paquete debita su costo de la cuenta", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(500);

      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);

      expect (cliente.obtenerSaldo()).toBe(100);
   })

   test("Comprar un paquete deja disponibles sus datos y minutos", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(500);

      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);

      expect (cliente.obtenerDatosDisponibles()).toBe(2560);
      expect (cliente.obtenerMinutosDisponibles()).toBe(1000);
   })

   test("No puede comprar un paquete sin saldo suficiente y sigue sin paquete", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(100);

      expect (() => cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA)).toThrow("Saldo insuficiente");
      expect (cliente.obtenerDatosDisponibles()).toBe(0);
      expect (cliente.obtenerSaldo()).toBe(100);
   })

   test("No puede comprar un paquete si ya tiene uno vigente y no se le debita nada", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(1000);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);

      expect (() => cliente.comprarPaquete(paqueteGrande(), new Date(2024, 0, 15))).toThrow("Ya tiene un paquete vigente");
      expect (cliente.obtenerSaldo()).toBe(600);
   })

   test("Puede comprar un paquete nuevo cuando el anterior está vencido", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(400);
      cliente.comprarPaquete(paqueteChico(), FECHA_DE_COMPRA);

      cliente.comprarPaquete(paqueteChico(), new Date(2024, 0, 10));

      expect (cliente.obtenerSaldo()).toBe(100);
      expect (cliente.obtenerDatosDisponibles()).toBe(1024);
   })

   test("Puede comprar un paquete nuevo cuando el anterior está agotado", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(300);
      cliente.comprarPaquete(paqueteChico(), FECHA_DE_COMPRA);
      cliente.registrarConsumo(new ConsumoInternet(1024, new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0)));
      cliente.registrarConsumo(new ConsumoLlamada(100, new Date(2024, 0, 2, 12, 0), new Date(2024, 0, 2, 13, 40)));

      cliente.comprarPaquete(paqueteChico(), new Date(2024, 0, 3));

      expect (cliente.obtenerSaldo()).toBe(0);
      expect (cliente.obtenerDatosDisponibles()).toBe(1024);
   })

   test("Registrar un consumo de internet descuenta datos del paquete actual", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(400);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);

      cliente.registrarConsumo(new ConsumoInternet(500, new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0)));

      expect (cliente.obtenerDatosDisponibles()).toBe(2060);
   })

   test("Registrar un consumo de llamada descuenta minutos del paquete actual", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(400);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);

      cliente.registrarConsumo(new ConsumoLlamada(30, new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 10, 30)));

      expect (cliente.obtenerMinutosDisponibles()).toBe(970);
   })

   test("No se puede registrar un consumo sin haber comprado un paquete", () => {

      const cliente = crearCliente();

      const consumo = new ConsumoInternet(500, new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0));

      expect (() => cliente.registrarConsumo(consumo)).toThrow("No tiene un paquete vigente");
   })

   test("No se puede registrar un consumo con el paquete vencido", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(150);
      cliente.comprarPaquete(paqueteChico(), FECHA_DE_COMPRA);

      const consumo = new ConsumoInternet(500, new Date(2024, 0, 20, 10, 0), new Date(2024, 0, 20, 11, 0));

      expect (() => cliente.registrarConsumo(consumo)).toThrow("No tiene un paquete vigente");
   })

   test("Un consumo mayor a lo disponible falla y no queda en el historial", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(150);
      cliente.comprarPaquete(paqueteChico(), FECHA_DE_COMPRA);

      const consumo = new ConsumoInternet(2000, new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0));

      expect (() => cliente.registrarConsumo(consumo)).toThrow("No hay datos suficientes disponibles");
      expect (cliente.historialDeConsumos()).toEqual([]);
   })

   test("El historial de consumos está ordenado por fecha aunque lleguen desordenados", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(400);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);

      const consumoDelDia5 = new ConsumoInternet(500, new Date(2024, 0, 5, 10, 0), new Date(2024, 0, 5, 11, 0));
      const consumoDelDia3 = new ConsumoLlamada(30, new Date(2024, 0, 3, 10, 0), new Date(2024, 0, 3, 10, 30));
      cliente.registrarConsumo(consumoDelDia5);
      cliente.registrarConsumo(consumoDelDia3);

      expect (cliente.historialDeConsumos()).toEqual([consumoDelDia3, consumoDelDia5]);
   })

   test("El historial se puede filtrar por un rango de fecha y hora", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(400);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);

      const consumoDelDia2 = new ConsumoInternet(500, new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0));
      const consumoDelDia10 = new ConsumoLlamada(30, new Date(2024, 0, 10, 10, 0), new Date(2024, 0, 10, 10, 30));
      const consumoDelDia20 = new ConsumoInternet(200, new Date(2024, 0, 20, 10, 0), new Date(2024, 0, 20, 11, 0));
      cliente.registrarConsumo(consumoDelDia2);
      cliente.registrarConsumo(consumoDelDia10);
      cliente.registrarConsumo(consumoDelDia20);

      const filtrado = cliente.historialDeConsumosEntre(new Date(2024, 0, 5), new Date(2024, 0, 15));

      expect (filtrado).toEqual([consumoDelDia10]);
   })

   test("Con renovación automática, al consumir con el paquete vencido se recompra el mismo paquete", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(800);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);
      cliente.activarRenovacionAutomatica();

      cliente.registrarConsumo(new ConsumoInternet(500, new Date(2024, 1, 15, 10, 0), new Date(2024, 1, 15, 11, 0)));

      expect (cliente.obtenerSaldo()).toBe(0);
      expect (cliente.obtenerDatosDisponibles()).toBe(2060);
   })

   test("Con renovación automática, al consumir con el paquete agotado se recompra el mismo paquete", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(300);
      cliente.comprarPaquete(paqueteChico(), FECHA_DE_COMPRA);
      cliente.activarRenovacionAutomatica();
      cliente.registrarConsumo(new ConsumoInternet(1024, new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0)));
      cliente.registrarConsumo(new ConsumoLlamada(100, new Date(2024, 0, 2, 12, 0), new Date(2024, 0, 2, 13, 40)));

      cliente.registrarConsumo(new ConsumoInternet(100, new Date(2024, 0, 2, 15, 0), new Date(2024, 0, 2, 16, 0)));

      expect (cliente.obtenerSaldo()).toBe(0);
      expect (cliente.obtenerDatosDisponibles()).toBe(924);
   })

   test("Con renovación automática pero sin saldo suficiente, el consumo falla por no tener paquete vigente", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(400);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);
      cliente.activarRenovacionAutomatica();

      const consumo = new ConsumoInternet(500, new Date(2024, 1, 15, 10, 0), new Date(2024, 1, 15, 11, 0));

      expect (() => cliente.registrarConsumo(consumo)).toThrow("No tiene un paquete vigente");
      expect (cliente.obtenerSaldo()).toBe(0);
   })

   test("Sin renovación automática, consumir con el paquete vencido falla aunque haya saldo", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(800);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);

      const consumo = new ConsumoInternet(500, new Date(2024, 1, 15, 10, 0), new Date(2024, 1, 15, 11, 0));

      expect (() => cliente.registrarConsumo(consumo)).toThrow("No tiene un paquete vigente");
      expect (cliente.obtenerSaldo()).toBe(400);
   })

   test("La renovación automática se puede desactivar", () => {

      const cliente = crearCliente();
      cliente.cargarSaldo(800);
      cliente.comprarPaquete(paqueteGrande(), FECHA_DE_COMPRA);
      cliente.activarRenovacionAutomatica();
      cliente.desactivarRenovacionAutomatica();

      const consumo = new ConsumoInternet(500, new Date(2024, 1, 15, 10, 0), new Date(2024, 1, 15, 11, 0));

      expect (() => cliente.registrarConsumo(consumo)).toThrow("No tiene un paquete vigente");
      expect (cliente.obtenerSaldo()).toBe(400);
   })
});
