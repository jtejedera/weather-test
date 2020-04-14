import Joi from '@hapi/joi';
import axios from 'axios';

module.exports = (data) => {
    if(data.hasOwnProperty('_id')){
        delete data._id;
    }
    
    const addressSchema = Joi.object({
            street: Joi.string()
            .required(),
    
            streetNumber: Joi.number()
                .required(),
        
            town: Joi.string()
                .required(),
        
            postalCode: Joi.number()
                .required(),
        
            country: Joi.string()
                .required(),
    });

    return new Promise((resolve,reject) => {
        const { error, value } = addressSchema.validate(data)

        if(error) {
            reject({
                success: false,
                data: {},
                message: error})
        }else{
            let streetArr = data.street.split(" ").map( element => `+${element}`);
            let countryArr = data.country.split(" ").map( element => `+${element}`);
            let townArr = data.country.split(" ").map( element => `+${element}`);

            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${streetArr}+${data.streetNumber},+${townArr},+${data.postalCode},+${countryArr}&key=AIzaSyDw-8z0Vy82qlX5d65I2cP6SEWkAD3HbtI`)
            .then((response) => {
                if(response.data.status !== 'OK'){
                    reject({
						success: false,
						data: {},
						message: response.data.status})
                }
                resolve({
                    success: true,
                    data: response.data.results[0].geometry.location,
                    message: response.data.status})
            })
            .catch(function (error) {
                reject({
                    success: false,
                    data: {},
                    message: error})
            });                
        }
    

    });


}