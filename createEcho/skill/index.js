/**
 * エントリポイント
 */
'use strict';
var Alexa = require('alexa-sdk');

const LaunchRequest = require('./app/LaunchRequest');
const AcceptanceIntent = require('./app/intents/Acceptance');
const CheckIntent = require('./app/intents/Check');
const ReceiveIntent = require('./app/intents/Receive');

var handlers = {
    'LaunchRequest': function() {
        console.log('### LaunchRequest');
        LaunchRequest.execute.call(this);
    },
    'SessionEndedRequest': function() {
        console.log('### SessionEndedRequest');
    },
    'AcceptanceIntent': function() {
        console.log('### AcceptanceIntent');
        AcceptanceIntent.execute.call(this);
    },
    'CheckIntent': function() {
        console.log('### CheckIntent');
        CheckIntent.execute.call(this);
    },
    'AMAZON.HelpIntent': function() {
        console.log('### AMAZON.HelpIntent');
    },
    'AMAZON.StopIntent': function() {
        console.log('### AMAZON.StopIntent');
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function() {
        console.log('### AMAZON.CancelIntent');
        this.emit('SessionEndedRequest');
    },
    // 上記以外
    'Unhandled': function() {
        console.error('### Unhandled!!');
        console.log(this.event.request);
    }
};

var receiveMessageHandlers = Alexa.CreateStateHandler('RECEIVE', {
    'Unhandled': function() {
        console.log('### ReceiveIntent');
        ReceiveIntent.execute.call(this);
    },
    "AMAZON.StopIntent": function() {
        this.emit("stop");
    }
});


// メインハンドラ
exports.handler = (event, context, callback) => {
    console.log('handler start');
    const alexa = Alexa.handler(event, context, callback);
    //alexa.appId = Config.get('alexa.appId');
    alexa.registerHandlers(handlers);
    alexa.execute();
}