const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');

// Converts CSV text to Js objects
class CSVParser extends Transform {
    constructor(options = {}) {
        super({ ...options, objectMode: true });

        this.headers = null; // CSV headers
        this.lineNumber = 0; // In order to understand if it is the 1st line being read (which is headers)
        this.buffer = '';
    }

    // Called internally by Node.js every time a new chunk of data arrives
    _transform(chunk, _encoding, callback) {
        this.buffer += chunk.toString();

        const lines = this.buffer.split('\n');
        this.buffer = lines.pop(); // Extracts from lines last incomplete chunk and assigns it to buffer

        for (const line of lines) {
            this.parseLine(line);
        }

        // Without callback data transformation stops
        callback(); // Node.js calls this callback to indicate that the current chunk is transformed
    }

    // When file ends Node.js automatically calls _flush
    _flush(callback) {
        if (!this.buffer || !this.headers) return callback();

        this.parseLine(this.buffer); // Handles latest ommited data chunk that does not contain \n
        callback();
    }

    parseLine(line) {
        // If the line ends with a carriage return, remove it to avoid issues with Windows-style line endings
        const cleanLine = line.endsWith('\r') ? line.slice(0, -1) : line;

        if (this.lineNumber === 0) {
            // If headers
            this.headers = cleanLine.split(',');
        } else {
            // If rows
            const values = cleanLine.split(',');

            if (values.length !== this.headers.length) {
                throw new Error('Malformed CSV data');
            }

            const record = {};
            for (let i = 0; i < this.headers.length; i++) {
                record[this.headers[i]] = values[i];
            }

            // This is the method inherited from Transform class
            // Passes the Js object to the next stream
            this.push(record);
        }

        this.lineNumber++;
    }
}

// Cleans and normalises the data recived from CsvParser
class DataTransformer extends Transform {
    constructor(options = {}) {
        super({ ...options, objectMode: true });
    }

    _transform(record, _encoding, callback) {
        const transformed = {
            name: capitalizeName(record.name),
            email: normalizeEmail(record.email),
            phone: formatPhone(record.phone),
            birthdate: standardizeDate(record.birthdate),
            city: capitalizeName(record.city),
        };

        this.push(transformed);
        callback();
    }
}

class CSVWriter extends Transform {
    constructor(options = {}) {
        super({ ...options, objectMode: true });

        this.headerWritten = false;
    }

    _transform(record, _encoding, callback) {
        let csv = '';

        if (!this.headerWritten) {
            csv += Object.keys(record).join(',') + '\n'; // Construct headers
            csv += Object.values(record).join(','); // Construct rows

            this.headerWritten = true; // Changed to true so that headers are not wriiten for every row
        } else {
            csv += '\n';
            csv += Object.values(record).join(',');
        }

        this.push(csv);
        callback();
    }
}

function capitalizeName(name) {
    if (name == null || typeof name !== 'string') return name;

    name = name
        .trim()
        .toLowerCase()
        .split(/\s+/) // Split the name by one or more whitespace characters.
        .map((word) => {
            // Handle hyphenated names such as "Mary-Jane".
            if (word.includes('-')) {
                return word
                    .split('-')
                    .map((subWord) => subWord.charAt(0).toUpperCase() + subWord.slice(1))
                    .join('-');
            } else {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
        })
        .join(' ');

    return name;
}

function normalizeEmail(email) {
    /*
     * Basic email validation:
     * - contains one '@'
     * - contains a domain with '.'
     * - no whitespace allowed
     */
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || typeof email !== 'string') return email;
    const normalizedEmail = email.trim().toLowerCase();

    if (!isEmailValid.test(normalizedEmail)) return email;
    return normalizedEmail;
}

function formatPhone(phone) {
    if (!phone || typeof phone !== 'string') return 'INVALID';

    // Remove all non-digit characters from the phone number.
    phone = phone.replaceAll(/\D/g, '');

    if (phone.length !== 10) return 'INVALID';
    phone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;

    return phone;
}

function standardizeDate(date) {
    if (
        !date ||
        typeof date !== 'string' ||
        date.length !== 10 ||
        (!date.includes('-') && !date.includes('/'))
    ) {
        return date;
    }

    if (date.includes('/')) {
        const parts = date.split('/');
        if (parts.length !== 3) return date;

        if (parts[0].length === 4) {
            // Assuming the format is YYYY/MM/DD
            const [year, month, day] = parts;
            if (!isValidDate(year, month, day)) return date;

            date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (parts[0].length === 2) {
            // Assuming the format is MM/DD/YYYY
            const [month, day, year] = parts;
            if (!isValidDate(year, month, day)) return date;

            date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    } else {
        const parts = date.split('-');
        if (parts.length !== 3) return date;

        // Assuming the format is YYYY-MM-DD
        const [year, month, day] = parts;
        if (!isValidDate(year, month, day)) return date;

        date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    function isValidDate(year, month, day) {
        const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

        return (
            parsedDate.getFullYear() === Number(year) &&
            parsedDate.getMonth() + 1 === Number(month) &&
            parsedDate.getDate() === Number(day)
        );
    }

    return date;
}

async function processCSVFile(inputPath, outputPath) {
    try {
        const readStream = fs.createReadStream(inputPath);

        const parser = new CSVParser();
        const transformer = new DataTransformer();
        const writer = new CSVWriter();

        const writeStream = fs.createWriteStream(outputPath);

        await pipeline(readStream, parser, transformer, writer, writeStream);
    } catch (error) {
        throw new Error(`Failed to process CSV file: ${error.message}`);
    }
}

function createSampleData() {
    const dataDir = path.join(process.cwd(), 'data');

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    const csvData = `
        name,email,phone,birthdate,city
        john doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york
        jane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles
        bob johnson,BOB@TEST.COM,invalid-phone,03/22/1992,chicago
        alice brown,alice.brown@company.org,9876543210,1988/07/04,houston
    `
        .trim()
        .replace(/^ {8}/gm, ''); // Remove leading spaces from each line to ensure proper CSV formatting.

    fs.writeFileSync(path.join(dataDir, 'users.csv'), csvData);
}

module.exports = {
    CSVParser,
    DataTransformer,
    CSVWriter,
    processCSVFile,
    capitalizeName,
    normalizeEmail,
    formatPhone,
    standardizeDate,
    createSampleData,
};
