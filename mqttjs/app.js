var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://sungura1-angani-ke-host.africastalking.com')
exports.handler = (event, context) => {
    try {
        if (event.session.new) {
            console.log('New Session Initiated');
        }

        switch (event.request.type) {
            case "LaunchRequest":
                console.log('Launch Request');
                context.succeed(
                    buildSpeechletResponse('Welcome to Alexa Smart IOT Skill.This skill sends commands to and receives commands from an MQTT Broker ', true), {}
                )
                break;
            case "IntentRequest":
                console.log('New Intent');
                switch (event.request.intent.name) {
                    case "GetData":
                        client.on('connect', function() {
                            client.subscribe('alexa')

                        })

                        client.on('message', function(topic, message) {
                            // message is Buffer
                            console.log(message.toString())
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`New Sensor Data is ${message.toString()}`, true), {}
                                )
                            )
                            client.end()
                        })
                        break;
                    case "SwitchOff":
                        client.on('connect', function() {

                            client.publish('alexa', 'OFF')
                        })

                        client.on('message', function(topic, message) {
                            // message is Buffer
                            console.log(message.toString())
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`Sent the command to switch off the lights`, true), {}
                                )
                            )
                            client.end()
                        })
                        break;
                    case "SwitchOn":

                        client.on('connect', function() {

                            client.publish('alexa', 'OFF')
                        })

                        client.on('message', function(topic, message) {
                            // message is Buffer
                            console.log(message.toString())
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`Sent the command to switch on the lights`, true), {}
                                )
                            )
                            client.end()
                        })
                        break;
                    case "DoStuff":

                        client.on('connect', function() {

                            client.publish('alexa', 'BLINK')
                        })

                        client.on('message', function(topic, message) {
                            // message is Buffer
                            console.log(message.toString())
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`Sent the command to blink the lights`, true), {}
                                )
                            )
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