/**
 * エントリポイント
 */
'use strict';
var Alexa = require('alexa-sdk');

const LaunchRequest = require('./app/LaunchRequest');
const TemperetureCheckIntent = require('./app/intents/TemperetureCheck');
const SwitchIntent = require('./app/intents/Switch');

const S3Helper = require('./app/helper/S3Helper');

var handlers = {
    'LaunchRequest': function() {
        console.log('### LaunchRequest');
        LaunchRequest.execute.call(this);
    },
    'SessionEndedRequest': function() {
        console.log('### SessionEndedRequest');
    },
    'TemperetureCheckIntent': function() {
        console.log('### TemperetureCheckIntent');
        TemperetureCheckIntent.execute.call(this);
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

var switchHandlers = Alexa.CreateStateHandler('SWITCH', {
    'Unhandled': function() {
        console.log('### SwitchIntent');
        SwitchIntent.execute.call(this);
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
    alexa.registerHandlers(handlers, switchHandlers);
    alexa.execute();
}