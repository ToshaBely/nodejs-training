import config from './config/common-config';
import * as models from './models';
import { Importer } from './importer';

// console.log('Application name: ', config.app.name);

// let user = new models.User();
// let product = new models.Product();

let importer = new Importer();

console.log(importer.importSync('MOCK_DATA.csv'));

setTimeout(() => {
    importer.import('MOCK_DATA.csv').then(res => {
        console.log(res);
    });
}, 1000);
