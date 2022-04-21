'use strict';

import express from 'express';
import * as mariadb from 'mariadb';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { Client } from 'whatsapp-web.js';
import * as config from './config.js';
import { log } from './log.js';
import qrcode from 'qrcode-terminal';

// import fs from 'fs'
// import https from 'https'
// const key = fs.readFileSync('./server.key');
// const cert = fs.readFileSync('./server.cert');

const db = mariadb.createPool(config.mariadb);

const wa = new Client(config.wa);

wa.on('qr', (qr) => {
    // log.info('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

wa.on('ready', () => {
    log.info('Client is ready!');
});

await wa.initialize();

export const run = () => {
    setInterval(tryDeliverMessage, config.messageInternal);

    const server = express();
    server.use(pinoHttp(config.log, pino.destination("./pino-logger.log")));
    server.use(express.json());

    server.post('/new_message', async (req, res) => {
        const conn = await db.getConnection();

        try {
            await conn.query(
                'INSERT INTO `wa`(target,nama,pesan,keterangan) VALUES (?,?,?,?)',
                [req.body.target, req.body.nama, req.body.pesan, req.body.keterangan],
            );
        } catch (e) {
            log.error(e);
            res.status(500).send('' + e);
        } finally {
            conn.release();
        }

        res.send('success');
    });

    // const serverWa = https.createServer({key:key,cert:cert},server)

    server.listen(config.server.port, () => {
        log.info(`Server listening on ${config.server.host ?? ''}:${config.server.port} ...`);
    });
};

const tryDeliverMessage = async () => {
    const conn = await db.getConnection();

    try {
        const messages = await conn.query('SELECT * FROM `wa` LIMIT 5');

        for (const message of messages) {
            const number_details = await wa.getNumberId(message.target);

            if (!number_details) {
                log.error(`"${message.target}," Mobile number is not registered`);
                continue;
            }

            await wa.sendMessage(number_details._serialized, `Absensi Kehadiran Otomatis

Assalamu'alaikum Wr. Wb.
Diberitahukan kepada bapak/ibu wali siswa bahwa:
Ananda: ${message.nama}
${message.pesan}

Keterangan:
${message.keterangan || '-'}

Semoga Mendapat Ilmu yang bermanfaat,
aamiin...
Wassalamu'alaikum Wr. Wb.`);
        }

        conn.query('DELETE FROM `wa` LIMIT 5');
    } catch (e) {
        log.error(e);
    } finally {
        conn.release();
    };
};
