'use strict';

/** @type {boolean} */
export const debug = true;

/** @type {number} */
export const messageInternal = 5000;

/** @type {{host:string,port:number}} */
export const server = { port: 4343 };

/** @type {import('pino').LoggerOptions} */
export const log = {
    transport: {
        target: 'pino-pretty',
        options: { colorize: true }
    },
    level: debug ? 'debug' : 'warn',
};

/** @type {import('mariadb').PoolConfig} */
export const mariadb = {
    resetAfterUse: true,
    user: 'root',
    password: '1234',
    database: 'wa',
    host: 'localhost',
    port: 3306,
};

// resetAfterUse: true,
// user: 'diparafc_neji',
// password: 'p3menang2024',
// database: 'diparafc_whatsapp',
// host: 'localhost',
// port: 3306,



/** @type {import('whatsapp-web.js').ClientOptions} */
export const wa = {
    takeoverTimeoutMs: 5000,
    qrMaxRetries: 5,
    puppeteer: {
        headless: true,
        // executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        args: [
            '--log-level=3',
            '--start-maximized',
            '--disable-infobars',
            '--disable-web-security',
            '--disable-site-isolation-trials',
            '--no-experiments',
            '--ignore-gpu-blacklist',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-default-apps',
            '--enable-features=NetworkService',
            '--disable-setuid-sandbox',
            '--no-sandbox'
        ],
    }
};
