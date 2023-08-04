import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

const datosConection = {
    PORT: env.PORT,
    MONGO_URL: env.MONGO_URL,
    cookie_secret: env.COOKIE_SECRET,
    github_client_id: env.GITHUB_CLIENT_ID,
    github_client_secret: env.GITHUB_CLIENT_SECRET,
    github_callback_url: env.GITHUB_CALLBACK_URL,
    JWT_TOKEN: env.JWT_TOKEN,
    SESSION_SECRET: env.SESSION_SECRET,
    PERSISTENCE_TYPE: env.PERSISTENCE_TYPE,
    MAIL: {
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        auth: {
            user: env.MAIL_USER,
            pass: env.MAIL_PASS
        }
    },
    };

export default datosConection;


