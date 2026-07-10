"use strict";

const Paquete = require("../src/dominio/Paquete");
const PaqueteContratado = require("../src/dominio/PaqueteContratado");

describe("Paquete Contratado", () => {

   const FECHA_DE_COMPRA = new Date(2024, 0, 1);

   test("Un paquete recién contratado tiene disponibles todos los datos y minutos del paquete", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (contratado.obtenerDatosDisponibles()).toBe(2560);
      expect (contratado.obtenerMinutosDisponibles()).toBe(1000);
   })

   test("Descontar datos reduce los datos disponibles", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      contratado.descontarDatos(560);

      expect (contratado.obtenerDatosDisponibles()).toBe(2000);
   })

   test("Descontar minutos reduce los minutos disponibles", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      contratado.descontarMinutos(100);

      expect (contratado.obtenerMinutosDisponibles()).toBe(900);
   })

   test("Se puede descontar exactamente lo que queda disponible", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      contratado.descontarDatos(2560);
      contratado.descontarMinutos(1000);

      expect (contratado.obtenerDatosDisponibles()).toBe(0);
      expect (contratado.obtenerMinutosDisponibles()).toBe(0);
   })

   test("No se puede descontar más datos de los disponibles y los disponibles no cambian", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (() => contratado.descontarDatos(3000)).toThrow("No hay datos suficientes disponibles");
      expect (contratado.obtenerDatosDisponibles()).toBe(2560);
   })

   test("No se puede descontar más minutos de los disponibles y los disponibles no cambian", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (() => contratado.descontarMinutos(1500)).toThrow("No hay minutos suficientes disponibles");
      expect (contratado.obtenerMinutosDisponibles()).toBe(1000);
   })

   test("No se pueden descontar cantidades negativas de datos", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (() => contratado.descontarDatos(-100)).toThrow("No puede descontar cantidades negativas");
   })

   test("No se pueden descontar cantidades negativas de minutos", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (() => contratado.descontarMinutos(-100)).toThrow("No puede descontar cantidades negativas");
   })

   test("Un paquete recién contratado no está agotado", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (contratado.estaAgotado()).toBe(false);
   })

   test("No está agotado si se quedó sin datos pero le quedan minutos", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      contratado.descontarDatos(2560);

      expect (contratado.estaAgotado()).toBe(false);
   })

   test("No está agotado si se quedó sin minutos pero le quedan datos", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      contratado.descontarMinutos(1000);

      expect (contratado.estaAgotado()).toBe(false);
   })

   test("Está agotado cuando no quedan ni datos ni minutos", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      contratado.descontarDatos(2560);
      contratado.descontarMinutos(1000);

      expect (contratado.estaAgotado()).toBe(true);
   })

   test("La fecha de vencimiento es la fecha de compra más la duración del paquete", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (contratado.fechaDeVencimiento()).toEqual(new Date(2024, 0, 31));
   })

   test("No está vencido antes de la fecha de vencimiento", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (contratado.estaVencido(new Date(2024, 0, 15))).toBe(false);
   })

   test("No está vencido el mismo día del vencimiento", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (contratado.estaVencido(new Date(2024, 0, 31))).toBe(false);
   })

   test("Está vencido pasada la fecha de vencimiento", () => {

      const contratado = new PaqueteContratado(new Paquete(2.5, 1000, 30, 400), FECHA_DE_COMPRA);

      expect (contratado.estaVencido(new Date(2024, 1, 1))).toBe(true);
   })
});
