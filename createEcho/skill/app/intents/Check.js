/**
 * 伝言確認インテント
 */
'use strict';
const S3Helper = require('../helper/S3Helper');


function execute() {
    console.log('in CheckIntent execute');

    const responseText = createMessage(reply);

    //TODO S3データの取得

    //TODO 返却文言の作成

    //返却カード文言要調整
    this.emit(':tellWithCard', responseText, null, 'check message',
        responseText, null);
}

module.exports.execute = execute;