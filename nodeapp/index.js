var express = require('express');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://sungura1-angani-ke-host.africastalking.com:1882');
var options = {
    sandbox: true, // true/false to use/not sandbox
    apiKey: 'e83d183e5cd04bc6c60c3a0051da5908c34a6016c45abfe4ff4cec2f88b59e89', // Use sandbox username and API key if you're using the sandbox
    username: 'sandbox', //
    format: 'json' // or xml
};
var app = express();
app.get('/', (req, res) => {
    res.status(200).send('Hello, world!').end();
});
var AfricasTalking = require('africastalking')(options);
var pay = AfricasTalking.PAYMENTS;
client.on('connect', function() {
    client.subscribe('payments');
});
client.on('message', function(topic, message) {
    var amt = parseInt(message.toString());
    console.log(amt);
    var opts = {
        productName: 'awesomeproduct',
        phoneNumber: '+254724587654',
        currencyCode: 'KES',
        amount: amt

    };
    try {
        pay.checkout(opts);
    } catch (error) {
        console.log('Woops!');
    }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});