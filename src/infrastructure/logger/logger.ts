import pino from 'pino';
import * as fs from 'fs';
import * as path from 'path';


const LOGS_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE_PATH = path.join(LOGS_DIR, 'app.log');

if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const fileStream = fs.createWriteStream(LOG_FILE_PATH, { flags: 'a' });

export const logger = pino(
    {
        level: 'info',
    },
    pino.multistream([
        { stream: process.stdout },  // лог в консоль
        { stream: fileStream },      // лог в файл
    ]),
);
