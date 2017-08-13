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