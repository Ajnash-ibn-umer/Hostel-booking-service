export default () => ({
  PORT: Number(process.env.PORT),
  DB_URL: process.env.DB_URL as string,
  DB_NAME: process.env.DB_NAME as string,
  JWT_ACCESS_TOKEN_SECRET_KEY: process.env
    .JWT_ACCESS_TOKEN_SECRET_KEY as string,
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY as string,
  IS_ENABLE_SANDBOX: process.env.IS_ENABLE_SANDBOX as string,
  HASH_SALT: Number(process.env.HASH_SALT),
  SWAGGER_DOC_URL: process.env.SWAGGER_DOC_URL as string,
  RAZOR_PAY_KEY_ID: process.env.RAZOR_PAY_KEY_ID as string,
  RAZOR_PAY_SECRET_KEY: process.env.RAZOR_PAY_SECRET_KEY as string,
  RAZOR_PAY_CURRENCY: process.env.RAZOR_PAY_CURRENCY as string,
});
