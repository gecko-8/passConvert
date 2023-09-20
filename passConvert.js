const KeepassToNordpass = require('./converters/keepassToNordpass.js')

const converter = new KeepassToNordpass('MyDatabase.xml', 'MyDatabase.csv');

try {
    converter.convertData();
} catch(ex) {
    console.log(ex);
}
