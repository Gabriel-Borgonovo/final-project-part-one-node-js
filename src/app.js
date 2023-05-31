import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fileDirName from './utils/fileDirName.js';
import viewsRoute from './routes/views.route.js';//nuevo
import configureHandlebars from './lib/hbs.middleware.js'; //nuevo
import configureSocket from './socket/configure-socket.js'; //nuevo
import mongoose from 'mongoose';
import datosConection from '../data.js';
import MongoStore from 'connect-mongo';
import { configurePassport } from './config/passport.config.js';
import passport from 'passport';
import router from './routes/index.js';
import fakerRoutes from './routes/mocks/faker.route.js';


const {__dirname} = fileDirName(import.meta);

const {PORT, MONGO_URL, cookie_secret} = datosConection

const app = express();

/**Mongoose */

const connection = mongoose.connect(
    MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
);

/**Cookie parser middleware de tercero */

app.use(cookieParser(cookie_secret));

/**************************************** */

/**session */
app.use(session({
	store: MongoStore.create({
	    mongoUrl: MONGO_URL,
		mongoOptions: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		ttl: 120,
	}),
	secret: cookie_secret,
	resave: true,
	saveUninitialized: true,
})
);


configurePassport();
app.use(passport.initialize());
app.use(passport.session());


/****************************** */

configureHandlebars(app);

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(express.static(__dirname + '/public')); //Esa linea de código es para más adelante en mi proyecto

app.use('/', viewsRoute); 
app.use('/api', router);
app.use('/mockingproducts', fakerRoutes);




/**Manejo de errores, middleware */

app.use((error, req, res, next) => {
    if(error.message){
        return res.status(400).send({
             message: error.message
        });   
    }
     res.status(500).send({error});
});


const httpServer = app.listen(PORT, () => 
    console.log(`Servidor express escuchando en el puerto ${PORT}`)
);

configureSocket(httpServer); 
