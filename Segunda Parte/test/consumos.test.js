"use strict";

const Paquete = require("../src/dominio/Paquete");
const PaqueteContratado = require("../src/dominio/PaqueteContratado");
const ConsumoInternet = require("../src/dominio/ConsumoInternet");
const ConsumoLlamada = require("../src/dominio/ConsumoLlamada");
const PaqueteConAppIlimitada = require("../src/dominio/PaqueteConAppIlimitada");

describe("Consumos", () => {

   const FECHA_DE_COMPRA = new Date(2024, 0, 1);

   test("Un consumo de internet se descuenta de los datos del paquete contratado", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);
      const consumo = new ConsumoInternet(500, "Chrome", new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0));

      consumo.descontarDe(contratado);

      expect (contratado.obtenerDatosDisponibles()).toBe(2060);
      expect (contratado.obtenerMinutosDisponibles()).toBe(1000);
   })

   test("Un consumo de llamada se descuenta de los minutos del paquete contratado", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);
      const consumo = new ConsumoLlamada(30, new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 10, 30));

      consumo.descontarDe(contratado);

      expect (contratado.obtenerMinutosDisponibles()).toBe(970);
      expect (contratado.obtenerDatosDisponibles()).toBe(2560);
   })

   test("Un consumo de internet de una app ilimitada no descuenta datos del paquete contratado", () => {

      const paquete = new PaqueteConAppIlimitada(new Paquete(2.5, 1000, 30, 400), "WhatsApp");
      const contratado = new PaqueteContratado(paquete, FECHA_DE_COMPRA);
      const consumo = new ConsumoInternet(500, "WhatsApp", new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0));

      consumo.descontarDe(contratado);

      expect (contratado.obtenerDatosDisponibles()).toBe(2560);
   })

   test("Un consumo de internet de una app ilimitada se permite aunque supere los datos disponibles", () => {

      const paquete = new PaqueteConAppIlimitada(new Paquete(2.5, 1000, 30, 400), "WhatsApp");
      const contratado = new PaqueteContratado(paquete, FECHA_DE_COMPRA);
      const consumo = new ConsumoInternet(5000, "WhatsApp", new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0));

      consumo.descontarDe(contratado);

      expect (contratado.obtenerDatosDisponibles()).toBe(2560);
   })

   test("Un consumo de internet de una app no ilimitada descuenta datos aunque el paquete tenga otra app ilimitada", () => {

      const paquete = new PaqueteConAppIlimitada(new Paquete(2.5, 1000, 30, 400), "WhatsApp");
      const contratado = new PaqueteContratado(paquete, FECHA_DE_COMPRA);
      const consumo = new ConsumoInternet(500, "Instagram", new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0));

      consumo.descontarDe(contratado);

      expect (contratado.obtenerDatosDisponibles()).toBe(2060);
   })

   test("Un consumo sabe que ocurrió dentro de un rango de fecha y hora", () => {

      const consumo = new ConsumoInternet(500, "Chrome", new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 11, 0));

      expect (consumo.ocurrioEntre(new Date(2024, 0, 1), new Date(2024, 0, 3))).toBe(true);
   })

   test("Un consumo sabe que ocurrió fuera de un rango de fecha y hora", () => {

      const consumo = new ConsumoLlamada(30, new Date(2024, 0, 2, 10, 0), new Date(2024, 0, 2, 10, 30));

      expect (consumo.ocurrioEntre(new Date(2024, 0, 5), new Date(2024, 0, 7))).toBe(false);
   })
});
