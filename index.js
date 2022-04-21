const qrcode = require('qrcode-terminal');

const {
    Client
} = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    if (message.body === '!ping') {
        console.log(message.body);
        message.reply('pong');
    } else {
        client.sendMessage(message.from, 'kata kunci salah tuliskan !ping');
    }
});
client.initialize();