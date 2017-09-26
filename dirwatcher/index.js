import EventEmitter from 'events';
import fs from 'fs';
import util from 'util';
import path from 'path';

import chokidar from 'chokidar';

import { parseToJSON } from '../utils';

const readFilePromise = util.promisify(fs.readFile);

export class DirWatcher extends EventEmitter {
    watch(dirPath, delay) {
        const watcher = chokidar.watch(dirPath, {
            usePolling: true,
            interval: delay,
            binaryInterval: delay
        });

        watcher
            .on('add', this.watcherHandler)
            .on('change', this.watcherHandler);
    }

    watcherHandler = fileName => {
        if (!this.isTempFile(fileName)) {
            this.readData(fileName);
        }
    };

    isTempFile(fileName) {
        return /\.~.+#/.test(fileName);
    }

    readData(pathFile) {
        console.log('get from ', pathFile);        
        readFilePromise(pathFile).then(file => {
            this.emit('changed', {
                fileName:path.basename(pathFile), 
                data: parseToJSON(file).length
            })
        });
    }
}