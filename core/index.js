let alexa = require('alexa-sdk');
let mqtt = require('mqtt');
let conOpts = {
    usernamre: 'alexa',
    password: 'alexa'
}
let serverUrl = "tcp://sungura1-angani-ke-host.africastalking.com:1882";

var client = mqtt.connect(serverUrl, conOpts);
exports.handler = (event, context, callback) => {
    let alexa = alexa.handler(event, context, callback);
}

let handlers = {
    'LaunchIntent': () => {
        this.emit(':tell', 'Launch Intent Message');
    },
    'GetData': () => {
        this.emit(':tell', '')
    }
}