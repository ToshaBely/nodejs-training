import csvjson from 'csvjson';

export function parseToJSON(csvBuffer) {
    return csvjson.toObject(csvBuffer.toString(), {delimetr: ',', quote: '"'});
};