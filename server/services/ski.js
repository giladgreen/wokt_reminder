const axios = require('axios');
const logger = require('../helpers/logger');

async function isSkiOpen() {
    try {
        const searchPath = `https://skihermon.co.il/%d7%97%d7%93%d7%a9%d7%95%d7%aa-%d7%95%d7%a2%d7%93%d7%9b%d7%95%d7%a0%d7%99%d7%9d/`;
        const { data: text } = await axios.get(searchPath);
        const html = text || '';
        const open = html.includes('האתר פתוח למבקרים')
        const closedForSki = html.includes(`אין תנאי גלישה`)
        return open && !closedForSki;
    } catch (e) {
        logger.error('checkSkiOpen error', e);

        return false;
    }

}

async function check() {
    const open = await isSkiOpen();
    if (open) {
        logger.info('ski is open!!');
        sendHtmlMail(`ski is open!!`, `<b>ski site now is open!!</b>`, 'green.gilad@gmail.com')

    } else{
        logger.info('ski is closed..  :(')
    }
}
setInterval(check,60*60*1000);

check();
