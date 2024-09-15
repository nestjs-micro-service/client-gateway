import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICE_PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  // MONGO_URI: string;
  // DATABASE_URL: string;
}

//El validador de esquema es para que en caso de que no exista la variable de entorno, se lance una excepción e impida levantar la app de Nest
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
    PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
    //El required() es para que no deje pasar la variable de entorno si no está definida
    // DATABASE_URL: joi.string().required(),
    // MONGO_URI: joi.string().required(),
  })
  .unknown(true); //Porque además de las variables de arriba, voy a tener otras más que acá no menciono

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
  productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
  // databaseUrl: envVars.DATABASE_URL,
  // mongoUri: envVars.MONGO_URI,
};