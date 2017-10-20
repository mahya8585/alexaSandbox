'use strict';

var aws = require('aws-sdk');
aws.config.region = 'us-east-1';
var s3 = new aws.S3();
const bucketName = 'alexa-xxx';
const fileName = 'json/status.json';

/**
 * ステータスJSONを取得する
 * promise function
 * @return JSON型ステータス情報
 */
function getStatus() {
    console.log('get current status');
    const getParams = {
        Bucket: bucketName,
        Key: fileName
    }

    return new Promise(function(resolve, reject) {
        let resultJson;

        s3.getObject(getParams, function(err, data) {
            if (err) {
                console.error('S3 getObject ERROR!');
                console.log(err, err.stack);
                resultJson = JSON.parse('{}');

            } else {
                console.log('Successfully s3 getObject');
                resultJson = JSON.parse(data.Body.toString());
            }

            resolve(resultJson);
        });
    });
}

/**
 * JSONファイルをS3へアップロードする
 * @param {Object} json Json型ステータス情報 
 */
function updateStatus(json) {
    console.log('update json at s3 start');
    console.log(json);

    let updateParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: JSON.stringify(json),
        ContentType: 'application/json',
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