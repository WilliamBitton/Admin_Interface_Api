const cron = require('node-cron');
const http = require('http');

function setupCron() {
    cron.schedule('*/10 * * * *', () => {
        http.get('https://snippet-o8zu.onrender.com')
    })
}

module.exports = setupCron;
