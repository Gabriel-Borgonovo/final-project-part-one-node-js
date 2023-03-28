import express from 'express';
import productsRoute from './routes/products.route.js'; 
import cartsRoute from './routes/carts.route.js'
import fileDirName from './utils/fileDirName.js';
import { uploader } from './utils/uploader.js';
import viewsRoute from './routes/views.route.js';//nuevo
import configureHandlebars from './lib/hbs.middleware.js'; //nuevo
import configureSocket from './socket/configure-socket.js'; //nuevo
import mongoose from 'mongoose';
import datosConection from '../data.js';
const {__dirname} = fileDirName(import.meta);

const {PORT, MONGO_URL} = datosConection

const app = express();

/**Mongoose */

const connection = mongoose.connect(
    MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
);


configureHandlebars(app);

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(express.static(__dirname + '/public')); //Esa linea de código es para más adelante en mi proyecto
app.use('/', viewsRoute); //nuevo
app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);


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
