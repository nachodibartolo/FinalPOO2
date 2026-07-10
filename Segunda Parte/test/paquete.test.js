"use strict";

const Paquete = require("../src/dominio/Paquete");

describe("Paquete", () => {
   test("Un paquete se crea con sus gigabytes, minutos, duración en días y costo", () => {

      const paquete = new Paquete(2.5, 1000, 30, 400);

      expect (paquete.gigabytes).toBe(2.5);
      expect (paquete.minutos).toBe(1000);
      expect (paquete.duracionEnDias).toBe(30);
      expect (paquete.costo).toBe(400);
   })

   test("Un paquete sabe expresar sus datos en megabytes", () => {

      const paquete = new Paquete(2.5, 1000, 30, 400);

      expect (paquete.megabytes()).toBe(2560);
   })
});
