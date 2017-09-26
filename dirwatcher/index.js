import EventEmitter from 'events';
import chokidar from 'chokidar';

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
            this.emit('changed', fileName);
        }
    };

    isTempFile(fileName) {
        return /\.~.+#/.test(fileName);
    }
}