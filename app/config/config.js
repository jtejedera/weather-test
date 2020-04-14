module.exports = {
    'port': process.env.PORT || 3000,
    'database': 'mongodb://nodeuser:example@mongo:27017/test',
    'redis': {
      host: 'redis',
      port: 6379
    },
	'WEATHER_KEY': '',
    'SMTP': {
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: 'username',
        pass: 'password'
      }
    }
  };
  