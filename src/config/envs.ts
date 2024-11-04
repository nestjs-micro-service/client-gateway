import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICE_PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  ORDERS_MICROSERVICE_PORT: number;
  ORDERS_MICROSERVICE_HOST: string;
  NATS_SERVERS: string[];
}

//El validador de esquema es para que en caso de que no exista la variable de entorno, se lance una excepción e impida levantar la app de Nest
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true); //Porque además de las variables de arriba, voy a tener otras más que acá no menciono

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
};
