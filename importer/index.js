import fs from 'fs';
import util from 'util';
import path from 'path';

import { DirWatcher } from '../dirwatcher';
import { parseToJSON } from '../utils';

const readFilePromise = util.promisify(fs.readFile);

export class Importer {
    DIR_NAME = './data';

    cacheCollection = {};
    dirWatcher;

    constructor() {
        this.dirWatcher = new DirWatcher();
        this.dirWatcher.watch(this.DIR_NAME, 500);

        this.dirWatcher.on('changed', (fileName) => {
            if(this.cacheCollection[path.basename(fileName)]) {
                this.cacheCollection[path.basename(fileName)].resolve(readFilePromise(fileName));
            } else {
                this.cacheCollection[path.basename(fileName)] = {promise: readFilePromise(fileName), resolve:()=>{}};
            }
        });
    }

    import(path) {
        if (!this.cacheCollection[path]) {
            let resolve;

            const promise = new Promise((res, rej) => {
                resolve = res;
            });

            this.cacheCollection[path] = { promise, resolve };
        }

        return this.cacheCollection[path].promise.then(res => parseToJSON(res));
    }

    importSync(path) {
        path = this.DIR_NAME + '/' + path;

        if (!fs.existsSync(path)) {
            throw {message: `Path ${path} doesn't exist.`};
        }

        return parseToJSON(fs.readFileSync(path));
    }
}