var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://sungura1-angani-ke-host.africastalking.com')
var msg;
client.on('connect', function() {
    client.subscribe('presence')
        // client.publish('presence', 'Hello mqtt')
})

client.on('message', function(topic, message) {
    // message is Buffer
    console.log(message.toString())
    msg = message.toString();
    console.log(`Msg is ${msg}`)
    client.end()
})