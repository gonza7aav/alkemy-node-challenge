module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.DATABASE_NAME}-dev`,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    use_env_variable: false,
  },
  test: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.DATABASE_NAME}-test`,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    logging: false,
    use_env_variable: false,
  },
  production: {
    username: '',
    password: '',
    database: '',
    host: '',
    dialect: '',
    logging: false,
    use_env_variable: true,
  },
};
