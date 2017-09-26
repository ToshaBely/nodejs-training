import fs from 'fs';
import util from 'util';

import { DirWatcher } from '../dirwatcher';
import { parseToJSON } from '../utils';

const readFilePromise = util.promisify(fs.readFile);

export class Importer {
    DIR_NAME = './data';

    cacheCollection = {};
    dirWatcher;

    constructor() {
        this.dirWatcher = new DirWatcher();
        this.dirWatcher.watch('./data', 500);

        this.dirWatcher.on('changed', (event) => {
            this.cacheCollection[event.fileName] = event.data;
            console.log('changed', this.cacheCollection);
        });
    }

    import(path) {
        if (this.cacheCollection[path]) {
            console.log('get from cache');
            return Promise.resolve(this.cacheCollection[path]);
        }

        path = this.DIR_NAME + '/' + path;

        console.log('return Promise');
        return readFilePromise(path).then(res => parseToJSON(res));
    }

    importSync(path) {
        if (this.cacheCollection[path]) {
            console.log('get from cache');
            return this.cacheCollection[path];
        }

        path = this.DIR_NAME + '/' + path;

        if (!fs.existsSync(path)) {
            // TODO: throw error
            console.log('doesn`t exist');
            return null;
        }

        console.log('get Sync');
        return parseToJSON(fs.readFileSync(path)).length;
    }
}