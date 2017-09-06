const config = require('./config/common-config');
const models = require('./models');

console.log('Application name: ', config.app.name);

let user = new models.User();
let product = new models.Product();
