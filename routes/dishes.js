var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var jade = require('jade');

/* GET users listing. */
router.post('/', function (req, res) {
    sendEmail(req.body.data);
    res.send({});
});

function sendEmail(data) {
    
    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sushistarssender@gmail.com',
            pass: 'q1w2a1s2z1x2'
        }
    });

    var template = jade.compileFile(__dirname+'/email.jade', { pretty: true });
    var emailBody = template(data);
    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails
    
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Stars Sushi <sushistarssender@gmail.com>', // sender address
        to: 'makem@ukr.net', // list of receivers
        subject: 'A new order', // Subject line
        text: emailBody,
        html: emailBody // html body
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
};


module.exports = router;