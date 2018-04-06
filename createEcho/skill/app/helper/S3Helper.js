'use strict';

var aws = require('aws-sdk');
aws.config.region = 'us-east-1';
var s3 = new aws.S3();
const bucketName = 'alexa-ｘｘｘｘ';


/**
 * ステータスJSONを取得する
 * promise function
 * @param {String} fileName 取得先ファイル名
 * @return 取得メッセージ
 */
function getStatus(fileName) {
    console.log('get s3');
    const getParams = {
        Bucket: bucketName,
        Key: fileName
    }

    return new Promise(function(resolve, reject) {
        let resultText;

        s3.getObject(getParams, function(err, data) {
            if (err) {
                console.error('S3 getObject ERROR!');
                console.log(err, err.stack);
                resultText = '本文なし';

            } else {
                console.log('Successfully s3 getObject');
                resultText = data.Body.toString();
            }

            resolve(resultText);
        });
    });
}

/**
 * メッセージをS3へアップロードする
 * @param {String} message アップロードメッセージ
 * @param {String} fileName アップロード先ファイル名 
 */
function updateStatus(message, fileName) {
    console.log('upload at s3 start');
    console.log(message);

    let updateParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: message,
        ContentType: 'text/plain',
        ACL: 'public-read-write'
    };

    s3.upload(updateParams, function(err, data) {
        if (err) {
            console.error('Error uploading data: ', err);

        } else {
            console.log('Successfully uploaded data to ' + bucketName + '/' + fileName);
        }
    });
}


module.exports.getStatus = getStatus;
module.exports.updateStatus = updateStatus;