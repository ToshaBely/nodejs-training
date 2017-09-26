export function parseToJSON(csvBuffer) {
    const [props, ...items] = csvBuffer.toString()
        .split('\n')
        .filter(s => s.trim())
        .map(line => line.split(','));
    return items.map(values => values.reduce(
        (obj, val, idx) => ({...obj, [props[idx]]: val}), {})
    );
};