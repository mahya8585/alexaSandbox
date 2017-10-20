/**
 * 扇風機ON処理
 */
'use strict';
const S3Helper = require('../helper/S3Helper');


/**
 * 返却文言の作成を行う
 * @param {String} reply 扇風機ONの意志
 * @return Alexaに喋らせる文言
 */
function createMessage(reply) {
    let prefix = '';
    if (reply === 'yes' || reply === 'sure') {
        prefix = 'Ok, I set ';
    } else if (reply === 'no') {
        prefix = 'Ok, I do not set ';
    } else {
        return 'Sorry, I do not understand. bye.';
    }

    return prefix + 'the fan.';
}

/**
 * ステータスデータの更新
 * @param {String} reply 予約するか否か
 */
function rewriteStatusJson(reply) {
    let isReserved = false;
    if (reply === 'yes' || reply === 'sure') {
        isReserved = true;
    }

    //ステータスデータの更新
    S3Helper.getStatus().then(function(statusJson) {
        statusJson.switch.fan = isReserved;
        S3Helper.updateStatus(statusJson);

    }).catch(function(error) {
        console.log(error);
    });
}

/**
 * HeatShockCheckIntentのレスポンス処理を実行します。
 * 会話エントリポイント。
 */
function execute() {
    console.log('in ReservationIntent execute');
    let slots = this.event.request.intent.slots;
    let reply = slots.replyList.value;
    const responseText = createMessage(reply);

    //ダッシュボードデータの書き換え
    rewriteStatusJson(reply);

    // conversation stateの解除
    console.log(this.attributes.STATE);
    this.handler.state = null;
    console.log(this.attributes);

    //返却カード文言要調整
    this.emit(':tellWithCard', responseText, null, 'Is reserved the bathroom heater?',
        responseText, null);
}

module.exports.execute = execute;