'use strict';

/**
 * 伝言受付開始メッセージインテント
 * 会話エントリポイント。
 */
function execute() {
    console.log('in AcceptanceIntent execute');

    //conversationするためのステータスを設定
    this.handler.state = 'RECEIVE';

    let responseText = 'かしこまりました。メッセージをどうぞ';
    this.emit(':askWithCard', responseText, null, 'Acceptance',
        responseText, null);
}

module.exports.execute = execute;