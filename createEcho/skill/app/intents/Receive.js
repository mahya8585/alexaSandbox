'use strict';
const S3Helper = require('../helper/S3Helper');

/**
 * 伝言送付インテント
 */
function execute() {
    console.log('in ReceiveIntent execute');

    //conversationするためのステータスを解除
    this.handler.state = null;

    //メッセージの取得
    let message = this.event.request.intent.slots.any.value;

    //s3バックアップ送付
    S3Helper.updateStatus(message,'to-slack.txt');
    console.log('end S3 backup')

    //slack送付
    request.post('https://slack.com/api/chat.postMessage',
        {
            form: {
                token: 'xoxp-xxxxxxxxxxxxx',
                channel: '@maaya',
                username: 'おばぁちゃん',
                text: message
            }
        }
        , (error, response, body) => {
            console.log(error)
        }
    );
    console.log('end slack send')

    let responseText = 'メッセージを送付しました。お返事をお待ちください。';
    this.emit(':tellWithCard', responseText, null, 'Acceptance',
        responseText, null);
}

module.exports.execute = execute;