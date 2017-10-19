let Alexa = require('alexa-sdk'),
    mqtt = require('mqtt'),
    conOpts = {
        usernamre: 'alexa',
        password: 'alexa'
    },
    serverUrl = "tcp://sungura1-angani-ke-host.africastalking.com:1882",
    client = mqtt.connect(serverUrl, conOpts);

exports.handler = (event, context, callback) => {
    let alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
}

let handlers = {
    'LaunchRequest': () => {
        this.emit(':tell', 'Hey there,am Alexa Smart IOT service.I can send commands and receive reding to a connected device');
    },
    'GetData': () => {
        client.on('connect', () => {
            client.subscribe('alexa/sensor/value');
        });
        client.on('message', (topic, message) => {
            let msg = message.toString();
            this.emit(':tell', 'The Current sensor value is ' + msg);
        })
    },
    'SwitchOn': () => {
        client.on('connect', () => {
            client.publish('alexa/commands/client', 'ON');
        });
        client.on('message', (topic, message) => {
            let msg = message.toString();
            this.emit(':tell', 'Lights have switched on');
        })
    },
    'SwitchOff': () => {
        client.on('connect', () => {
            client.publish('alexa/commands/client', 'OFF');
        });
        client.on('message', (topic, message) => {
            let msg = message.toString();
            this.emit(':tell', 'Lights have switched off');
        })
    },
    'Blink': () => {
        client.on('connect', () => {
            client.publish('alexa/commands/client', 'Blink');
        });
        client.on('message', (topic, message) => {
            let msg = message.toString();
            this.emit(':tell', 'Blinking lights');
        })
    }

}