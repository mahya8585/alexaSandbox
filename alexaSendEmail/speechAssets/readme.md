# speech assets についての設定メモ

## IntentSchema.json RaiseLowerについて

RaiseLowerは以下の文言のどちらかが設定される想定で作成しています。

- Raise
- Lower

typeで指定している `RaiseLowerList` はCustom Slot Typesで自作しています。    
Custom Slot Typesでは以下のように設定してください。

- Enter Type
  - RaiseLowerList
- Enter Values
  - Raise
  - Lower

