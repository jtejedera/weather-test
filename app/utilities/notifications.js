import nodemailer from 'nodemailer'
import config from '../config/config'

//TODO - Be sure to configure your SMTP server address in your config file.
const transporter = nodemailer.createTransport(config.SMTP);

exports.sendNotification = emailinfo => {
    return new Promise((resolve,reject) => {
        const mailOptions = {
            from: '"Weather APP" <admin@weather.app>',
            to: emailinfo.email, 
            subject: `Weather Alert: ${emailInfo.description}`,
            text: `Hello, this is a notification from Weather APP. We detected a precipitation in your address ${infoEmail.address}.\n Precipitation Information: ${infoEmail.description}`,
            html: `<b>Hello, this is a notification from Weather APP. We detected a precipitation in your address ${infoEmail.address}.</b><br>Precipitation Information: ${infoEmail.description}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                reject(error)
            }
            resolve(info)
        });        
    })
}
