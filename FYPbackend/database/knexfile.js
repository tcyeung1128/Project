require("dotenv").config();
module.exports = {
development: {
        client: 'postgresql',
        connection: {
            host: "127.0.0.1",
            port: 5432,
            // database: process.env.DATABASE_NAME,
            // user: process.env.DATABASE_USER,
            // password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,//"fypproject",
            user: process.env.DATABASE_USER//"chung",
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

};