/**
 * Created by Maxim Vyhovskyi on 03.10.15.
 */

var from = process.env.SendGridFrom;
var password = process.env.SendGridPassword;
var recepients = process.env.SendGridRecepients;

var sendgrid = require("sendgrid")(from, password);

function sendEmail(subject, body){

  var email = new sendgrid.Email();
  email.addTo(recepients);
  email.setFrom(from);
  email.setSubject(subject);
  email.setHtml(body);

  sendgrid.send(email);
}

module.exports = {
  send:sendEmail
};