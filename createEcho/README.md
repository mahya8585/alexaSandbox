# Alexaを使って音声<->slackでやり取りをするシステム

ばーちゃんと私のためのスキル。   
スキルのアーキはほかにも応用できるはず・・・たぶん・・・

- 「Alexa, maayaに伝言して」
  - でメッセージをLambdaで受け取る
  - 受け取ったメッセージをslackに送付

- slackでメッセージ送付コマンドを打つ
  - コマンド発動、s3にメッセージを配置
  - ラズパイ側