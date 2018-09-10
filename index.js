const { readFileSync, writeFileSync, accessSync } = require('fs');
const { resolve } = require('path');
const { parseString } = require('xml2js');

if (process.argv.length < 3) {
    console.log('Usage: npm start filename.xml');
    process.exit(1);
}

const FILE = process.argv[2] || '';
const IN_PATH = resolve(__dirname, FILE);
const OUT_PATH = resolve(__dirname, FILE + '_parsed.txt');

try {
    accessSync(IN_PATH);
} catch (e) {
    console.log(`could not access input file: ${IN_PATH}`);
    process.exit(1);
}

var xml = readFileSync(IN_PATH);
parseString(xml, function (err, results) {
    console.log('parsing xml...');

    if (!results || !results.lognotes || !results.lognotes.notes || !results.lognotes.notes[0] || !results.lognotes.notes[0].note) {
        console.log('invalid file. No <notes> found.');
        process.exit(1);
    }
    
    console.log('generating parsed txt...');
    const out = results.lognotes.notes[0].note.map(note => {
        const { time, speaker, text } = note;
        return `time: ${time}\r\nspeaker: ${speaker}\r\n${text}\r\n`
    });

    console.log(`saving: ${OUT_PATH}`)
    writeFileSync(OUT_PATH, out.join('\r\n\r\n'))
    console.log(`done. Parsed ${out.length} notes`)
});