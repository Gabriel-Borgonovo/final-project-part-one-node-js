import { create } from "express-handlebars";
import fileDirName from "../utils/fileDirName.js";
//import helpers from './helpers.handlebars.js';
import path from 'path'; 

const { __dirname } = fileDirName(import.meta);
export default function configureHandlebars(app){
    
    
    const partialsDir = path.join(__dirname, '..', 'views', 'partials');

    const hbs = create({
        partialsDir: [partialsDir],
        helpers: {
            urlEncode: (str) => encodeURIComponent(JSON.stringify(str)),
          },
    });

    app.engine('handlebars', hbs.engine);
    app.set('views', `${__dirname}/../views`);
    app.set('view engine', 'handlebars');
}