const config = {
    DB_USERNAME: process.env.DB_USERNAME ? process.env.DB_USERNAME : 'root',
    DB_PASSWORD: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'password',
    DB_HOST: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
};

module.exports = config;
