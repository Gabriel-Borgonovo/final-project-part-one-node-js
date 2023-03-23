import express from 'express';
import productsRoute from './routes/products.route.js'; 
import cartsRoute from './routes/carts.route.js'
import fileDirName from './utils/fileDirName.js';
import { uploader } from './utils/uploader.js';
import viewsRoute from './routes/views.route.js';//nuevo
import configureHandlebars from './lib/hbs.middleware.js'; //nuevo
import configureSocket from './socket/configure-socket.js'; //nuevo
const {__dirname} = fileDirName(import.meta);

const app = express();
configureHandlebars(app);

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(express.static(__dirname + '/public')); //Esa linea de código es para más adelante en mi proyecto
app.use('/', viewsRoute); //nuevo
app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);


const port = 8080;
const httpServer = app.listen(port, () => 
    console.log(`Servidor express escuchando en el puerto ${port}`)
);

configureSocket(httpServer);
