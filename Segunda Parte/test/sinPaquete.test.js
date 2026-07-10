"use strict";

const SinPaquete = require("../src/dominio/SinPaquete");

describe("Sin Paquete", () => {
   test("Sin paquete se considera vencido y agotado, y no tiene datos ni minutos disponibles", () => {

      const sinPaquete = new SinPaquete();

      expect (sinPaquete.estaVencido(new Date(2024, 0, 1))).toBe(true);
      expect (sinPaquete.estaAgotado()).toBe(true);
      expect (sinPaquete.obtenerDatosDisponibles()).toBe(0);
      expect (sinPaquete.obtenerMinutosDisponibles()).toBe(0);
   })
});
