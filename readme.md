# **Programación Orientada a Objetos 2** 

## *Trabajo Práctico Final cursada 2024* 

## **Pautas del final** 

El examen final consta de dos partes, una evaluación práctica y una teórica. La evaluación práctica consta de un trabajo a realizar previo a la fecha del final y una defensa oral en el dia del examen. Por otra parte, la evaluación teórica, también será de forma oral e incluirá todos los conceptos vistos durante la cursada. A continuación, se detallará más en profundidad el trabajo práctico final a desarrollar.  
   
El trabajo consiste en dos iteraciones de un mismo producto. El desarrollo se debe realizar utilizando TDD y se deben aplicar todos los conceptos vistos a lo largo del cuatrimestre (excepto Mocking).

Respecto al formato de entrega, se debe subir a la plataforma EVA una carpeta zip que contenga dos carpetas en su interior. Una carpeta "Primera Parte", donde se encontrará el código desarrollado para cumplir con la consigna de la primera parte del enunciado, y la carpeta "Segunda Parte", que incluirá el código necesario para cumplir tanto con la consigna de la parte uno como de la parte dos.

Esta entrega estará disponible en el EVA hasta 48 horas corridas antes de la fecha del examen. No se aceptará ninguna excepción, de no cumplir con esta regla, se marcará al alumno como ausente. 

## **Primera parte** 

Queremos realizar un sistema para la venta de paquetes de una compañía telefónica. Lo que se necesita es poder vender *paquetes* a personas que estén registrados como *clientes* de la compañía, y llevar registro de la validez de los mismos, como así también de los consumos que los clientes vayan realizando.   
Un paquete contiene: 
- una cantidad de datos móviles (expresada en GB), 
- una cantidad de tiempo para realizar llamadas (expresada en minutos), 
- una duración en días (luego de la misma, se vence), 
- y un costo (expresado en pesos). 

### Ejemplos de paquetes serían los siguientes: 

* 2.5 GB y 1000 minutos durante 30 días, por $400 pesos   
* 1GB y 100 minutos durante 7 dias, por $150 pesos 

Del cliente conocemos su nombre completo y número de linea. Además, tiene asociada una cuenta prepaga, de la cual se va a debitar el monto de los paquetes que vaya comprando. En este sistema prepago, los clientes deben cargar dinero a su cuenta antes de comprar un paquete. Si el cliente no tiene suficiente saldo para comprar un paquete, el sistema no debe permitir la compra del mismo. 

El cliente va a poder adquirir todos los paquetes que estén disponibles. No va a poder adquirir dos paquetes al mismo tiempo, debe esperar que se termine uno para adquirir otro. No obstante, para tener cobertura en todo momento, puede configurar que sus paquetes se renueven automáticamente. 

Vamos a querer registrar cada consumo realizado por el cliente. Podemos asumir que un sistema externo nos va a proveer de la siguiente información para los diferentes tipos de consumo: 

* Consumo de internet: cantidad de MB, fecha/hora de inicio y fin   
* Consumo de minutos: cantidad de minutos, fecha/hora de inicio y fin. 

Cada vez que se efectúa un consumo, se "descuenta" del paquete actual que el cliente tenga, queremos saber en todo momento cuánto queda disponible (de datos y minutos de llamadas). No se puede efectuar un consumo mayor a lo que el paquete tenga disponible. Queremos saber el historial de consumos ordenado por fecha, y con un filtro opcional por fecha y hora de inicio y fin. 

El paquete se considera agotado cuando no quedan datos ni minutos de llamadas por consumir. Y se considera vencido cuando la fecha de expiración (determinada por la fecha de compra del paquete \+ la duración del mismo) es mayor a la fecha de hoy. Un cliente puede comprar un paquete nuevo si el último paquete está vencido o agotado. 

## **Segunda parte** 

Luego del primer MVP presentado al cliente, nos solicitaron agregar las siguientes funcionalidades. 

Primero, debemos agregar a los paquetes la posibilidad de uso ilimitado de una app en particular, por ejemplo, WhatsApp. Esto supone también que al recibir un consumo de internet de la entidad externa, va a estar detallado qué aplicación fue la que lo realizó. 

Por otra parte, debemos permitirles a los clientes prestar datos y/o minutos. La vigencia de este préstamo tendrá la misma fecha de vencimiento del plan del cliente que está realizando el regalo. Esto se tiene que registrar tanto en el cliente que recibe y como en el que lo otorga. Esto no se puede realizar en cualquier momento, el receptor debe tener un plan o préstamo vencido o agotado. 