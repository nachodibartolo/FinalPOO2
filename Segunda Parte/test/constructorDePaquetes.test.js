"use strict";

const ConstructorDePaquetes = require("../src/dominio/ConstructorDePaquetes");

describe("Constructor de paquetes", () => {

   test("Construye un paquete común con todos sus datos", () => {
      const paquete = new ConstructorDePaquetes()
         .conGigabytes(2.5)
         .conMinutos(1000)
         .conDuracionEnDias(30)
         .conCosto(400)
         .construir();

      expect(paquete.gigabytes).toBe(2.5);
      expect(paquete.minutos).toBe(1000);
      expect(paquete.duracionEnDias).toBe(30);
      expect(paquete.costo).toBe(400);
      expect(paquete.esIlimitada("WhatsApp")).toBe(false);
   });

   test("Construye un paquete sin configurar nada con todos los valores en cero", () => {
      const paquete = new ConstructorDePaquetes().construir();

      expect(paquete.gigabytes).toBe(0);
      expect(paquete.minutos).toBe(0);
      expect(paquete.duracionEnDias).toBe(0);
      expect(paquete.costo).toBe(0);
   });

   test("Construye un paquete con una app ilimitada", () => {
      const paquete = new ConstructorDePaquetes()
         .conGigabytes(2.5)
         .conMinutos(1000)
         .conDuracionEnDias(30)
         .conCosto(400)
         .conAppIlimitada("WhatsApp")
         .construir();

      expect(paquete.esIlimitada("WhatsApp")).toBe(true);
      expect(paquete.esIlimitada("Instagram")).toBe(false);
      expect(paquete.costo).toBe(400);
      expect(paquete.megabytes()).toBe(2560);
   });

   test("Construye un paquete con varias apps ilimitadas", () => {
      const paquete = new ConstructorDePaquetes()
         .conGigabytes(1)
         .conMinutos(100)
         .conDuracionEnDias(7)
         .conCosto(150)
         .conAppIlimitada("WhatsApp")
         .conAppIlimitada("Instagram")
         .construir();

      expect(paquete.esIlimitada("WhatsApp")).toBe(true);
      expect(paquete.esIlimitada("Instagram")).toBe(true);
      expect(paquete.esIlimitada("TikTok")).toBe(false);
   });
});
