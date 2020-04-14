import cronFunctions from '../functions/cronFunctions'
import cron from 'node-cron';
 
cron.schedule('*/5 * * * * *', () => {
    cronFunctions.checkAddresses()
    .then()
    .catch();
});