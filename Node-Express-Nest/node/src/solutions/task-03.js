const fs = require('fs');
const fsPromises = require('fs').promises;

function analyzeEventLoop() {
    const analysis = {
        phases: ['Timers', 'Pending Callbacks', 'Idle/Prepare', 'Poll', 'Check', 'Close Callbacks'],

        executionOrder: [
            '1. Execute all synchronous JavaScript code.',
            '2. Run the process.nextTick() queue.',
            '3. Run the Promise microtask queue.',
            '4. Enter the Timers phase and execute expired setTimeout() and setInterval() callbacks.',
            '5. Execute Pending Callback callbacks deferred by the operating system.',
            '6. Run the internal Idle/Prepare phase (not accessible from JavaScript).',
            '7. Enter the Poll phase to process I/O operations such as fs.readFile().',
            '8. Enter the Check phase and execute setImmediate() callbacks.',
            '9. Execute Close Callback handlers for resources that have been closed.',
        ],

        explanations: [
            'The Timers phase executes callbacks scheduled with setTimeout() and setInterval() after their delay has expired.',
            'The Pending Callbacks phase runs certain system-level callbacks that were deferred to the next event loop iteration. Most JavaScript applications rarely interact with this phase directly.',
            'Idle/Prepare is an internal Node.js phase used by the runtime. JavaScript code cannot schedule work in this phase.',
            'The Poll phase waits for and processes I/O events such as file system operations, network requests, and socket events. If no timers are ready, the event loop may wait here for new events.',
            'The Check phase executes callbacks scheduled with setImmediate(). It runs after the Poll phase completes.',
            "The Close Callbacks phase executes callbacks for resources that are being closed, such as sockets or streams that emit a 'close' event.",
            'Node.js also maintains two microtask queues. The process.nextTick() queue has the highest priority and is executed before the Promise microtask queue.',
            'Microtasks always run before the event loop continues to the next macrotask phase, which is why Promise callbacks and process.nextTick() execute before timers and I/O callbacks.',
        ],
    };

    return analysis;
}

function predictExecutionOrder(snippet) {
    const predictions = {
        snippet1: [
            '1. Start (synchronous)',
            '2. End (synchronous)',
            '3. Next Tick 1 (process.nextTick - microtask)',
            '4. Next Tick 2 (process.nextTick - microtask)',
            '5. Promise 1 (Promise microtask)',
            '6. Promise 2 (Promise microtask)',
            '7. Timer 1 (Timers phase)',
            '8. Timer 2 (Timers phase)',
            '9. Immediate 1 (Check phase)',
            '10. Immediate 2 (Check phase)',
        ],

        snippet2: [
            '1. === Start === (synchronous)',
            '2. === End === (synchronous)',
            '3. NextTick (process.nextTick)',
            '4. Nested NextTick (process.nextTick)',

            '5. After this point, the order of Timer, Immediate, and fs.readFile is not guaranteed because fs.readFile depends on I/O completion.',

            'Typical execution:',
            '6. Timer (Timers phase)',
            '7. NextTick in Timer',
            '8. Immediate (Check phase)',
            '9. NextTick in Immediate',
            '10. fs.readFile (Poll phase)',
            '11. NextTick in readFile',
            '12. Immediate in readFile (Check phase)',
            '13. Timer in readFile (next Timers phase)',
        ],
    };

    return predictions[snippet] || [];
}

async function fixRaceCondition() {
    const files = await createTestFiles();

    /*
     * Using Promise.all() removes the need for a shared counter and manual
     * completion tracking while keeping the results in the same order as
     * the input files.
     */
    try {
        const results = await Promise.all(
            files.map(async (file) => {
                try {
                    const content = await fsPromises.readFile(file, 'utf8');
                    return content.toUpperCase();
                } catch (error) {
                    console.error(`Error reading ${file}: ${error.message}`);

                    await fsPromises.writeFile(file, `Content of ${file}`);

                    console.log(`Created ${file}`);

                    const content = await fsPromises.readFile(file, 'utf8');
                    return content.toUpperCase();
                }
            }),
        );

        console.log('All files processed:', results);

        return results;
    } catch (error) {
        throw new Error(`Failed to process files: ${error.message}`);
    }
}

async function fixCallbackHell(userId) {
    /*
     * Using async/await replaces deeply nested callbacks with sequential,
     * readable code while allowing a single try/catch block to handle
     * asynchronous and JSON parsing errors.
     */

    try {
        const userData = await fsPromises.readFile(`user-${userId}.json`, 'utf8');
        const user = JSON.parse(userData);

        const preferencesData = await fsPromises.readFile(`preferences-${user.id}.json`, 'utf8');
        const preferences = JSON.parse(preferencesData);

        const activityData = await fsPromises.readFile(`activity-${user.id}.json`, 'utf8');
        const activity = JSON.parse(activityData);

        const combinedData = {
            user: user,
            preferences: preferences,
            activity: activity,
            processedAt: new Date(),
        };

        await fsPromises.writeFile(
            `processed-${userId}.json`,
            JSON.stringify(combinedData, null, 2),
        );

        return combinedData;
    } catch (error) {
        throw new Error(`Failed to process user data: ${error.message}`);
    }
}

async function fixMixedAsync() {
    /*
     * Using async/await consistently avoids mixing promises and callbacks,
     * makes the execution flow easier to follow, and centralizes error
     * handling in a single try/catch block.
     */

    try {
        console.log('Starting data processing...');

        let data;

        try {
            data = await fsPromises.readFile('input.txt', 'utf8');
            console.log('File read successfully');
        } catch (error) {
            console.error('Read error:', error.message);

            await fsPromises.writeFile('input.txt', 'Hello World!');

            console.log('Created input file, please run again');
            return;
        }

        const processedData = data.toUpperCase();

        await fsPromises.writeFile('output.txt', processedData);
        console.log('File written successfully');

        const verifyData = await fsPromises.readFile('output.txt', 'utf8');

        console.log('Verification successful');
        console.log('Data length:', verifyData.length);
    } catch (error) {
        throw new Error(`Failed to process data: ${error.message}`);
    }
}

async function demonstrateEventLoop() {
    console.log('=== Event Loop Demonstration ===');

    // Synchronous code
    logWithPhase('Synchronous', 'This runs first');

    // Microtasks
    process.nextTick(() => {
        logWithPhase('Microtasks', 'nextTick executed');
    });

    Promise.resolve().then(() => {
        logWithPhase('Microtasks', 'Promise microtask executed');
    });

    // Timers phase
    setTimeout(() => {
        logWithPhase('Timers', 'setTimeout executed');
    }, 0);

    const intervalId = setInterval(() => {
        logWithPhase('Timers', 'setInterval executed');
        clearInterval(intervalId);
    }, 0);

    // Poll phase
    fs.readFile(__filename, () => {
        logWithPhase('Poll', 'fs.readFile completed');

        process.nextTick(() => {
            logWithPhase('Microtasks', 'nextTick executed after poll');
        });

        Promise.resolve().then(() => {
            logWithPhase('Microtasks', 'Promise microtask after poll');
        });
    });

    // Check phase
    setImmediate(() => {
        logWithPhase('Check', 'setImmediate executed');
    });

    // Close callbacks phase
    const stream = fs.createReadStream(__filename);

    stream.on('close', () => {
        logWithPhase('Close', 'Stream closed');
    });

    stream.destroy();

    console.log(
        'Pending callbacks and Idle/Prepare phases cannot be demonstrated directly from JavaScript.',
    );

    // Allow async callbacks to execute before returning
    await new Promise((resolve) => setTimeout(resolve, 50));
}

async function createTestFiles() {
    const files = ['file1.txt', 'file2.txt', 'file3.txt'];

    await Promise.all([
        fsPromises.writeFile(files[0], 'Content of file 1 - processing data'),
        fsPromises.writeFile(files[1], 'Content of file 2 - more data'),
        fsPromises.writeFile(files[2], 'Content of file 3 - final data'),
    ]);

    return files;
}

function logWithPhase(phase, message) {
    console.log(`[${phase}] ${message} (${new Date().toISOString()})`);
}

module.exports = {
    analyzeEventLoop,
    predictExecutionOrder,
    fixRaceCondition,
    fixCallbackHell,
    fixMixedAsync,
    demonstrateEventLoop,
    createTestFiles,
    logWithPhase,
};
