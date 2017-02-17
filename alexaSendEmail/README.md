# 手順

- SNSのtopicを作成する
  - 設定するsubscriptionはEmailを想定しています。

- Lambda -> SNSのIAM Roleを設定する
  - 以下はポリシー設定例

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish"
            ],
            "Resource": "arn:aws:sns:us-east-1:999999999:xxxxxxxx"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

- Lambda function(Alexa Skill Adupter)を作成する
  - 本コードのsrc配下で `npm i` する
  - function publishSnsにAWS SNSのarnを設定する
  - 以下をzipする
    - node_modules
    - index.js
  - Lambda Funcionを作成し、上記zipをアップロードする

- AlexaのCustom Skillを作成する
  - Amazon.com developer(U.S) からalexa custom skillを作成する
  - 作成したAlexa custom skillにLambda functionの arnを設定する
  - Intent SchemaやUtterancesの設定は本コードの `speechAssets` ディレクトリを参照(カスタマイズOK)

- Echosim.ioなりAstlaなりから「アレクサ、温度1度上げて」という(英語で)
  - Alexa, Start raise 2 degrees
  - などなどUtterancesの文章を参考に
