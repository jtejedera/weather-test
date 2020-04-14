# Weather Test APP
Weather test app built with Node.js, Redis, Mongo, Firebase, Google Geolocation API and  Weather Open API

## Project configuration
Review the ./app/config/config.js file

Add Firebase keys information in ./app/utilities
```
serviceAccountKey.json  -   Firebase Admin
serviceAppSnippet.json  -   Firebase
```

## Project setup
```
npm install
```

## Docker setup
```
Build the image: docker imagr build -t exampleapp .
Execute Docker-compose: docker-compose up
```

### Compiles and hot-reloads for development
```
nodemon server
```
