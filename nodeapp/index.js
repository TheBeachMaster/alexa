var express = require('express');
var options = {
    sandbox: true, // true/false to use/not sandbox
    apiKey: 'e83d183e5cd04bc6c60c3a0051da5908c34a6016c45abfe4ff4cec2f88b59e89', // Use sandbox username and API key if you're using the sandbox
    username: 'sandbox', //
    format: 'json' // or xml
};
var AfricasTalking = require('africastalking')(options);
var app = express();
app.get('/', (req, res) => {
    res.status(200).send('Hello, world!').end();
});
app.post('/pay', (req, res) => {
    var pay = AfricasTalking.PAYMENTS;
    var opts = {
        productName: 'awesomeproduct',
        phoneNumber: '+254724587654',
        currencyCode: 'KES',
        amount: 1500

    };
    pay.checkout(opts)
        .then(console.log('Success'))
        .catch(console.log('Error'));
});
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});