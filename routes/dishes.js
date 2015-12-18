var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var jade = require('jade');
var fs = require('fs');
var emailService = require('../services/emailService');

/* GET users listing. */
router.post('/', function (req, res) {
    var body = getEmailBody(req.body.data);
    emailService.send("A new order from Stars-Sushi.com", body);
    res.send({});
});

router.get('/data',function(req,res){
    var template = jade.compileFile(__dirname+'/data.jade', { pretty: true });
    var data = template(data);
    res.end(data);
});

router.get('/json',function(req,res){
    var content = fs.readFileSync(__dirname+'/../public/data/dishes.json', 'utf8');
    res.end(content);
});

function getEmailBody(data){
    var template = jade.compileFile(__dirname+'/email.jade', { pretty: true });
    var emailBody = template(data);
    return emailBody;
}

function sendEmail(data) {

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sushistarssender@gmail.com',
            pass: 'q1w2a1s2z1x2'
        }
    });

    var emailBody = getEmailBody(data);
    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Stars Sushi <sushistarssender@gmail.com>', // sender address
        to: 'admin@reststars.com;makem@ukr.net', // list of receivers
        subject: 'A new order from Sushi-Stars', // Subject line
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
