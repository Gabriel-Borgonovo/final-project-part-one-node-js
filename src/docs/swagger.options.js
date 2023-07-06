import * as path from "path";
import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Cart API",
      version: "1.0.0",
      description: "Cart API Information",
    },
  },
  apis: [
    path.resolve("./src/docs/**/*.yaml"),
  ],
};

const spec = swaggerJsDoc(swaggerOptions);
export default spec;