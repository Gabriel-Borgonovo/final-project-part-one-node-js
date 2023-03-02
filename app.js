import express from 'express';
import productsRoute from './routes/products.route.js'; 
import cartsRoute from './routes/carts.route.js'
import fileDirName from './utils/fileDirName.js';
import { uploader } from './utils/uploader.js';
const {__dirname} = fileDirName(import.meta);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//app.use(express.static(__dirname + '/public')); Esa linea de código es para más adelante en mi proyecto

app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);


const port = 8080;
app.listen(port, () => console.log(`Servidor express escuchando en el puerto ${port}`));

