
import User from'../schema/userModel';
import functions from './generalFunctions';
import notifications from '../utilities/notifications';
import moment from 'moment';

var exports = module.exports = {};

exports.checkAddresses = () => {
    return new Promise((resolve,reject) => {
        User.find({}, '' , {})
        .then( result => { 
            let usersWithAddress = result.filter(x => x.addresses.length);
            
            usersWithAddress.forEach(element => {
                element.addresses.forEach(address => {
                    functions.checkWeather(address.rawAddress)
                    .then( result => {
                        let time = moment().unix();
                        let inTimeFrame = moment(time).isBetween(moment(element.notifications.timeFrame.split('to')[0], 'hh:mm a').unix(),moment(element.notifications.timeFrame.split('to')[1], 'hh:mm a').unix());

                        if(result.data.weather[0].id <800 && element.notifications.active  && inTimeFrame) {
                            //TODO - Uncomment next line to send email notifications on precipitation variations
                            //notifications.sendNotification({ email: element.email, address: address.address, description: result.data.weather[0].description })
                        }
                    })
                    .catch( error => console.log("Error ", error));
                });
            });
            resolve();           
        })
        .catch( error => { reject(error) });
    })
}