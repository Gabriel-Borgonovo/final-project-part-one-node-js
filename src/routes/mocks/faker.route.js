import { Router } from "express";
import { Faker, es, en, base } from "@faker-js/faker";

const faker = new Faker({
    locale: [es, en, base],
});

const route = Router();

// Ruta de Mocking de productos
route.get('/', async (req, res, next) => {
    try {
      // Generar 100 productos utilizando Faker
      const products = Array.from({ length: 100 }, () => ({
        code: faker.number.int({ min: 10, max: 100 }),
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 10, max: 100 }),
        category: faker.commerce.department(),
        thumbnail: [faker.image.avatar()],
        status: faker.datatype.boolean(),
      }));
  
      // Insertar los productos generados en la base de datos
  
      res.json(products);
    } catch (error) {
      console.error(error);
      next(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default route;