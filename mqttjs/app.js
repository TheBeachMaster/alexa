var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://sungura1-angani-ke-host.africastalking.com')

client.on('connect', function() {
    client.subscribe('alexa')
    client.publish('alexa', '24')
})

client.on('message', function(topic, message) {
    // message is Buffer
    console.log(message.toString())
    client.end()
})