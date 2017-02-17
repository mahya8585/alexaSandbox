'use strict';
var Alexa = require("alexa-sdk");

/**
 * 音声発話ヘルパー
 */
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

/**
 * SNSメール通知ヘルパー
 */
var aws = require('aws-sdk');
var sns = new aws.SNS({
    apiVersion: '2010-03-31',
    region: 'us-east-1'
});

function publishSns(message, subject) {
    sns.publish({
        Message: 'Hello, Master. \n\n' + message,
        Subject: subject,
        TopicArn: '【your AWS SNS(send Email) arn】'
    }, function(err, data) {
        if (err) console.log('mail send [fail]');
    });


}


/**
 * ようこそメッセージの発話
 */
function getWelcomeResponse(callback) {
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to the air conditioner Skill. ' +
        'Please order me thermoregulation.';

    const repromptText = 'Please order me thermoregulation.';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Launch Requestの実行function
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch start`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * 温度設定完了発話処理
 */
function createIntentResponse(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = 'Yes, Master. Please wait a moment.';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = 'Yes, Master. Please wait a moment.';

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Emailメッセージにslot変数を設定する
 */
function createEmailMessage(intent) {
    const degreeSlot = intent.slots.Degree;
    const raiseLowerSlot = intent.slots.RaiseLower;

    const errMsg = 'Sorry, I was not able to thermoregulate it. Please order it once again. \n e.g.) Raise 2 degrees. ';

    if (degreeSlot && raiseLowerSlot) {
        const raiseLower = raiseLowerSlot.value;
        const degree = degreeSlot.value;
        console.log('raiseLower : ' + raiseLower);
        console.log('degree : ' + degree);

        //上げ調節・下げ調節文言と表示温度の作成
        let rlStr = '';
        let settingTemperature = 0;
        if (raiseLower == 'raise') {
            rlStr = ' raised ';
            settingTemperature = 20 + Number(degree);

        } else
        if (raiseLower == 'lower') {
            rlStr = ' lowered ';
            settingTemperature = 20 - Number(degree);

        } else {
            console.log('[ERROR]degree : ' + degree + ' , raiseLower : ' + raiseLower + ' , msg: ' + errMsg);
            return errMsg;
        }
        console.log('rlStr : ' + rlStr);
        console.log('setting Tempature : ' + settingTemperature);

        //温度文言suffix
        let degreeStr = '';
        if (degree === 1) {
            degreeStr = ' degree ';
        } else {
            degreeStr = ' degrees ';
        }

        return "I" + rlStr + degree + degreeStr + 'of the air conditioner.\n' +
            'Current setting is ' + settingTemperature + ' degrees.';

    } else {
        return errMsg;
    }
}



/**
 * Intent処理
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent start`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    //TODO 複数Intentを設定する場合はここで分岐させる
    if (intentName === 'ThermoregulationIntent') {
        //作業受付完了の発声
        createIntentResponse(intent, session, callback);

        //SNS publish
        const message = createEmailMessage(intent);
        console.log('message : ' + message);
        const subject = "from Alexa Email";
        publishSns(message, subject);

        // } else if (intentName === 'WhatsMyColorIntent') {
        //     getColorFromSession(intent, session, callback);
        // } else if (intentName === 'AMAZON.HelpIntent') {
        //     getWelcomeResponse(callback);
        // } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        //     handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * メインハンドラ
 */
exports.handler = (event, context, callback) => {
    try {
        if (event.session.new) {
            console.log('[session started] air conditioner skill.');
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            console.log('[session ended] air conditioner skill.');
            callback();
        }
    } catch (err) {
        callback(err);
    }
};