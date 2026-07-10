"use strict";

const Paquete = require("../src/dominio/Paquete");
const PaqueteConAppIlimitada = require("../src/dominio/PaqueteConAppIlimitada");

describe("Paquete con app ilimitada", () => {

   test("Un paquete común no tiene ninguna app ilimitada", () => {
      const paquete = new Paquete(2.5, 1000, 30, 400);

      expect(paquete.esIlimitada("WhatsApp")).toBe(false);
   });

   test("Un paquete con app ilimitada considera ilimitada a esa app", () => {
      const paquete = new PaqueteConAppIlimitada(new Paquete(2.5, 1000, 30, 400), "WhatsApp");

      expect(paquete.esIlimitada("WhatsApp")).toBe(true);
   });

   test("Un paquete con app ilimitada no considera ilimitadas a las demás apps", () => {
      const paquete = new PaqueteConAppIlimitada(new Paquete(2.5, 1000, 30, 400), "WhatsApp");

      expect(paquete.esIlimitada("Instagram")).toBe(false);
   });

   test("Un paquete con app ilimitada conserva los datos del paquete que envuelve", () => {
      const paquete = new PaqueteConAppIlimitada(new Paquete(2.5, 1000, 30, 400), "WhatsApp");

      expect(paquete.gigabytes).toBe(2.5);
      expect(paquete.minutos).toBe(1000);
      expect(paquete.duracionEnDias).toBe(30);
      expect(paquete.costo).toBe(400);
      expect(paquete.megabytes()).toBe(2560);
   });

   test("Se pueden apilar varias apps ilimitadas y todas se consideran ilimitadas", () => {
      const paquete = new PaqueteConAppIlimitada(
         new PaqueteConAppIlimitada(new Paquete(2.5, 1000, 30, 400), "WhatsApp"),
         "Instagram"
      );

      expect(paquete.esIlimitada("WhatsApp")).toBe(true);
      expect(paquete.esIlimitada("Instagram")).toBe(true);
      expect(paquete.esIlimitada("TikTok")).toBe(false);
   });
});
