import  User    from '../schema/userModel';
import validator from '../utilities/validations'
import async from 'async';
import axios from 'axios';
import redisMethods from './redisFunctions';

var exports = module.exports = {};

exports.checkWeather = address => {
	return new Promise((resolve,reject) => {
        let lat,lng,weather,addressinfo,output = '';
        let checked = false;
        const addressFormat = `${address.street} ${address.streetNumber} ${address.town} ${address.postalCode} ${address.country}`.toLowerCase().replace(/\s+/g, '');

		async.series([
			(cb) => {
                redisMethods.getAddress(addressFormat)
                .then( result => {
                   if(result != null){
                        checked = true;
                        addressinfo = JSON.parse(result);
                    }
                    cb();
                 })
                .catch( err => { 
                    cb({
                        success: false,
                        data: {},
                        message: err.message});
                });			
			},            
			(cb) => {
                if(!checked){
                    validator(address)
                    .then( result => { 
                        lat = result.data.lat;
                        lng = result.data.lng;
                        cb();
                     })
                    .catch( err => { 
                        cb({
                            success: false,
                            data: {},
                            message: err.message});
                    });	
                }else{
                    lat = addressinfo[0].lat;
                    lng = addressinfo[0].lng;
                    cb();
                }
				
            },
            (cb) => {
                getWeather(lat,lng)
                .then(function (response) {
                    weather = response.data.weather;
                    output = {
                        success: true,
                        data: response.data,
                        message: "Weather"};
                    cb();
                })
                .catch(function (error) {
                    cb({
                        success: false,
                        data: {},
                        message: error.message});
                });                 
            },
            (cb) => {
                if(!checked){
                    weather[0].lat = lat;
                    weather[0].lng = lng;

                    redisMethods.setAddress(addressFormat, weather)
                    .then(result => {
                        cb();
                    })
                    .catch(error => {
                        reject(error);
                    });
                }else{
                    cb();
                }                     
            }
			],(err, res) => {
				if(err) reject(err);
				else resolve(output);
		});					
	});
}


exports.getAddresses = data => {
    const uid = data.query;

	return new Promise((resolve,reject) => {
        User.findById(uid, {}).select('addresses')
        .then( result => { 
            resolve({
                success: true,
                data: result,
                message: 'Get Addresses'
            });
         })
        .catch( err => { 
            reject({
                success: false,
                data: {},
                message: error.message});
        });
	});
}

exports.delAddress = data => {
    const addressId = data.body._id;
    const uid = data.query;

	return new Promise((resolve,reject) => {
        User.findByIdAndUpdate(uid, { $pull: { addresses : { _id : addressId } } })
        .then( result => { 
            resolve({
                success: true,
                data: {},
                message: 'Address deleted'
            });
         })
        .catch( error => { 
            reject({
                success: false,
                data: {},
                message: error.message});
        });
	});
}

exports.addAddress = data => {
    const address = data.body;
    let lat,lng,addressInfo,fullAddress,weather,output = '';
    const uid = data.query;
    let checked = false;
    const addressFormat = `${address.street} ${address.streetNumber} ${address.town} ${address.postalCode} ${address.country}`.toLowerCase().replace(/\s+/g, '');

	return new Promise((resolve,reject) => {

		async.series([
            (cb) => {
                redisMethods.getAddress(addressFormat)
                .then( result => { 
                    if(result != null){
                        checked = true;
                        addressinfo = JSON.parse(result);
                    }
                    cb();
                 })
                .catch( err => { 
                    cb({
                        success: false,
                        data: {},
                        message: err.message});
                });
			},            
			(cb) => {
                if(!checked){
                    validator(address)
                    .then( result => { 
                        lat = result.data.lat;
                        lng = result.data.lng;
                        cb();
                     })
                    .catch( err => { 
                        cb({
                            success: false,
                            data: {},
                            message: err.message});
                    });
                }else{
                    lat = addressinfo[0].lat;
                    lng = addressinfo[0].lng;
                    cb();
                }	
            },
            (cb) => {
                getWeather(lat,lng)
                .then(function (response) {
                    weather = response.data.weather;
                    output = {
                        success: true,
                        data: response.data,
                        message: "Weather"};
                    cb();
                })
                .catch(function (error) {
                    cb({
                        success: false,
                        data: {},
                        message: error.message});
                });                 
            },
            (cb) => {
                fullAddress = `${address.street} ${address.streetNumber} ${address.town} ${address.postalCode} ${address.country}`;
                
                User.findByIdAndUpdate(uid, { $push: {'addresses': {'address':fullAddress, 'rawAddress': address}} , "returnNewDocument": true})
                .then( result => { 
                    cb();       
                })
                .catch( error => { 
                    reject({
                        success: false,
                        data: {},
                        message: error.message},null);
                });
            },
            (cb) => {
                if(!checked){
                    weather[0].lat = lat;
                    weather[0].lng = lng;

                    redisMethods.setAddress(addressFormat,weather)
                    .then(result => {
                        cb();
                    })
                    .catch(error => {
                        reject(error);
                    })          
                }else{
                    cb();
                }     
            }
			],(err, res) => {
				if(err) reject(err);
				else resolve(output);
		});					
	});
}

exports.updateAddress = data => {
    const address = data.body;
    const addressId = address._id;
    const uid = data.query;
    let weather,lat,lng = '';

	return new Promise((resolve,reject) => {
		async.series([
			(cb) => {
                validator(address)
                .then( result => { 
                    lat = result.data.lat;
                    lng = result.data.lng;
                    cb();
                 })
                .catch( err => { 
                    reject({
                        success: false,
                        data: {},
                        message: err.message});
                });
            },
            (cb) => {
                getWeather(lat,lng)
                .then(function (response) {
                    weather = response;
                    cb();
                })
                .catch(function (error) {
                    cb({
                        success: false,
                        data: {},
                        message: error.message});
                });                 
            },
            (cb) => {
                let fullAddress = `${address.street} ${address.streetNumber} ${address.town} ${address.postalCode} ${address.country}`;

                User.findOneAndUpdate({ '_id': uid, 'addresses._id': addressId }, { 'addresses.$.address': fullAddress, 'addresses.$.rawAddress': address}, { safe: true, upsert: true})
                .then( result => { 
                    cb({
                        success: true,
                        data: weather.data,
                        message: 'Address Updated'
                    });
                 })
				.catch( error => { 
                    cb({
                        success: false,
                        data: {},
                        message: error.message});
                });
            }       
			],(err, res) => {
				if(err) reject(err);
				else resolve(res);
		});					
	});
}

exports.getNotifications = id => {
    return new Promise((resolve,reject) => {
        User.findById(id)
        .then(result => {
            resolve({
                success: true,
                data: result.notifications,
                message: "Notification parameters"
            });
        })
        .catch(error => {
            reject({
                success: false,
                data: {},
                message: error
            });
        });
    });
}

exports.updateNotifications = notification => {
    let notifications = notification.body;
    let uid = notification.query;

    return new Promise((resolve,reject) => {
        User.findOneAndUpdate({ '_id': uid}, { 'notifications.active': notifications.active, 'notifications.timeFrame': notifications.timeFrame}, { safe: true, upsert: true})
        .then( result => { 
            resolve({
                success: true,
                data: {},
                message: 'Notifications Updated'
            });
         })
        .catch( error => { 
            reject({
                success: false,
                data: {},
                message: error.message});
        });   
    });
}

const getWeather = (lat,lng) => {
    return new Promise((resolve,reject) => {   
        axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${config.WEATHER_KEY}`)
        .then(response => {     
            resolve(response);
        })
        .catch(error => {
            reject(error);
        });    
    });
}