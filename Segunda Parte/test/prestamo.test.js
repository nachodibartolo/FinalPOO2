"use strict";

const Prestamo = require("../src/dominio/Prestamo");

describe("Préstamo", () => {

   const FECHA_DE_VENCIMIENTO = new Date(2024, 0, 31);

   test("Un préstamo conoce sus datos y minutos disponibles", () => {

      const prestamo = new Prestamo(500, 100, FECHA_DE_VENCIMIENTO);

      expect (prestamo.obtenerDatosDisponibles()).toBe(500);
      expect (prestamo.obtenerMinutosDisponibles()).toBe(100);
   })

   test("Un préstamo descuenta datos y minutos", () => {

      const prestamo = new Prestamo(500, 100, FECHA_DE_VENCIMIENTO);

      prestamo.descontarDatos(200);
      prestamo.descontarMinutos(30);

      expect (prestamo.obtenerDatosDisponibles()).toBe(300);
      expect (prestamo.obtenerMinutosDisponibles()).toBe(70);
   })

   test("Un préstamo no permite descontar más datos de los disponibles", () => {

      const prestamo = new Prestamo(500, 100, FECHA_DE_VENCIMIENTO);

      expect (() => prestamo.descontarDatos(600)).toThrow("No hay datos suficientes disponibles");
      expect (prestamo.obtenerDatosDisponibles()).toBe(500);
   })

   test("Un préstamo no permite descontar más minutos de los disponibles", () => {

      const prestamo = new Prestamo(500, 100, FECHA_DE_VENCIMIENTO);

      expect (() => prestamo.descontarMinutos(200)).toThrow("No hay minutos suficientes disponibles");
      expect (prestamo.obtenerMinutosDisponibles()).toBe(100);
   })

   test("Un préstamo no permite descontar cantidades negativas", () => {

      const prestamo = new Prestamo(500, 100, FECHA_DE_VENCIMIENTO);

      expect (() => prestamo.descontarDatos(-10)).toThrow("No puede descontar cantidades negativas");
      expect (() => prestamo.descontarMinutos(-10)).toThrow("No puede descontar cantidades negativas");
   })

   test("Un préstamo descuenta datos de cualquier app porque no tiene apps ilimitadas", () => {

      const prestamo = new Prestamo(500, 100, FECHA_DE_VENCIMIENTO);

      prestamo.descontarDatosDe("WhatsApp", 200);

      expect (prestamo.obtenerDatosDisponibles()).toBe(300);
   })

   test("Un préstamo vence en la fecha con la que fue creado", () => {

      const prestamo = new Prestamo(500, 100, FECHA_DE_VENCIMIENTO);

      expect (prestamo.fechaDeVencimiento()).toEqual(FECHA_DE_VENCIMIENTO);
      expect (prestamo.estaVencido(new Date(2024, 0, 31))).toBe(false);
      expect (prestamo.estaVencido(new Date(2024, 1, 1))).toBe(true);
   })

   test("Un préstamo está agotado cuando no le quedan datos ni minutos", () => {

      const prestamo = new Prestamo(500, 100, FECHA_DE_VENCIMIENTO);

      expect (prestamo.estaAgotado()).toBe(false);

      prestamo.descontarDatos(500);
      prestamo.descontarMinutos(100);

      expect (prestamo.estaAgotado()).toBe(true);
   })

   test("Un préstamo sabe si puede descontar una combinación de datos y minutos", () => {

      const prestamo = new Prestamo(500, 100, FECHA_DE_VENCIMIENTO);

      expect (prestamo.puedoDescontar(500, 100)).toBe(true);
      expect (prestamo.puedoDescontar(501, 100)).toBe(false);
      expect (prestamo.puedoDescontar(500, 101)).toBe(false);
   })
});
