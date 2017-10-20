/**
 * JSON取得処理
 * @param {String} url JSONファイルURL
 * @return {Object} JSON型データ 
 */
function getJSON(url) {
    let result;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            result = JSON.parse(req.responseText);
        }
    };
    req.open('GET', url, false);
    req.send(null);

    return result;
}

/**
 * 扇風機ステータス書き換え処理
 * @param {boolean} switched 判定基準となるデータ
 * @param {Object} tag 書き換え対象タグ(Jquery記述) e.g.)$('#test')
 */
function rewriteSwitch(switched, tag) {
    if (switched) {
        tag.text('ON');
    } else {
        tag.text('OFF');
    }
}

/**
 * 温度ステータス書き換え処理
 * @param {number} temperature 判定基準となるデータ 
 * @param {Object} tag 書き換え対象タグ(Jquery記述) e.g.)$('#test') 
 */
function rewriteTemprature(temperature, tag) {
    if (temperature >= 0) {
        tag.text(temperature);
    } else {
        tag.text('-');
    }
}


/**
 * 各種値更新チェックエントリポイント
 * @param {Object} targetJson JSON型データ
 */
function statusUpdate(targetJson) {
    if (targetJson.switch) {
        rewriteSwitch(targetJson.switch.fan, $('#fan'));
    }

    if (targetJson.temperature) {
        let temperature = targetJson.temperature;
        rewriteTemprature(temperature, $('#temp'));
    }
}

/**
 * 初期実行処理
 */
$(window).on('load', function() {
    const jsonUrl = 'https://s3.amazonaws.com/alexa-xxx/json/status.json';

    //最初のJSON読み込み
    let operateJson = getJSON(jsonUrl);
    console.log(operateJson);

    //設定値の更新
    if (operateJson) {
        //各種設定値更新処理functionへ
        statusUpdate(operateJson);
    }

    //ポーリング
    $.PeriodicalUpdater('/path/to/service', {
            url: jsonUrl,
            minTimeout: 3000,
            maxTimeout: 3000,
            multiplier: 1, //リクエスト間隔の変更
            maxCalls: 0, //リクエスト回数(0:制限なし)
            type: 'json'
        },
        function(result) {
            //設定値の更新
            if (result) {
                //各種設定値更新処理functionへ
                statusUpdate(result);
            } else {
                console.log('no change status.');
            }
        });
});