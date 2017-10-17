var mqtt = require('mqtt')
var conOpts = {
    username: "alexa",
    password: "alexa"
}
var client = mqtt.connect('mqtt://sungura1-angani-ke-host.africastalking.com:1882', conOpts)
var msg;
exports.handler = (event, context) => {
    try {
        if (event.session.new) {
            console.log('New Session Initiated');
        }

        switch (event.request.type) {
            case "LaunchRequest":
                console.log('Launch Request');
                context.succeed(
                    buildSpeechletResponse('Hey there,am Alexa Smart IOT service.I can send commands and receive reding to a connected device', true), {}
                )
                break;
            case "IntentRequest":
                console.log('New Intent');
                switch (event.request.intent.name) {
                    case "GetData":
                        client.on('connect', function() {
                            client.subscribe('alexa/sensor/value')

                        })

                        client.on('message', function(topic, message) {
                            // message is Buffer
                            console.log(message.toString())
                            msg = message.toString();
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse('New Sensor Data is' + msg, true), {}
                                )
                            )
                            client.end()
                        })
                        break;
                    case "SwitchOff":
                        client.on('connect', function() {

                            client.publish('alexa/commands/client', 'OFF')
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse('Switching Off Lights', true), {}
                                )
                            )
                        })


                        client.on('message', function(topic, message) {
                            // message is Buffer
                            console.log(message.toString())
                            client.end()

                        })
                        break;
                    case "SwitchOn":

                        client.on('connect', function() {

                            client.publish('alexa/commands/client', 'ON')
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse('Switching On Lights', true), {}
                                )
                            )
                        })

                        client.on('message', function(topic, message) {
                            // message is Buffer
                            console.log(message.toString())

                            client.end()
                        })
                        break;
                    case "Blink":

                        client.on('connect', function() {

                            client.publish('alexa/commands/client', 'BLINK')
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse('Blinking Lights', true), {}
                                )
                            )
                        })



                        client.on('message', function(topic, message) {
                            // message is Buffer
                            console.log(message.toString())

                            client.end()
                        })
                        break;

                    default:
                        throw "Invalid intent"
                }
                break;
            case "SessionEndedRequest":
                console.log('New Session Ended');
                break;
            default:
                context.fail(`INVALID REQUEST TYPE:${event.request.type}`);
        }
    } catch (error) {
        context.fail(`Error: ${error}`);
    }



}

//Helper Funcs
buildSpeechletResponse = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }
}

generateResponse = (sessionAtribtes, speechletResponse) => {
    return {
        version: "1.0",
        sessionAtribtes: sessionAtribtes,
        response: speechletResponse
    }
}