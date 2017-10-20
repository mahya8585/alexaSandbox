'use strict';
const S3Helper = require('../helper/S3Helper');

/**
 * ステータスデータの更新
 */
function rewriteStatusJson() {
    //ステータスデータの更新
    S3Helper.getStatus().then(function(statusJson) {
        statusJson.tempereture = 35;
        S3Helper.updateStatus(statusJson);

    }).catch(function(error) {
        console.log(error);
    });
}


/**
 * TemperetureCheckIntentのレスポンス処理を実行します。
 * 会話エントリポイント。
 */
function execute() {
    console.log('in TemperetureCheckIntent execute');
    //ダッシュボードデータの書き換え
    rewriteStatusJson();

    //conversationするためのステータスを設定
    this.handler.state = 'SWITCH';

    let responseText = 'It is 35 degrees. Do you turn on the fan?';
    this.emit(':askWithCard', responseText, null, 'too hot',
        responseText, null);
}

module.exports.execute = execute;