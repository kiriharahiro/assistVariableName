# assistVariableName

## assistVariableName の概要
こちらはノンプロ研Slackチャンネル「#10_リーダブル変数メーカー」の一時代替アプリとして開発したものです。

### デプロイ方法
GoogleAppsScript にCode.gs、Index.htmlを貼り付け、デプロイします。

### アプリの実行方法
デプロイで生成された WebアプリのURLをブラウザに入力するとアプリが起動します。

### 使い方
日本語の関数名を入力してEnter または「英語の変数名を生成する」をクリックします。
<img width="1066" height="707" alt="2026-08-15_15h28_59" src="https://github.com/user-attachments/assets/3db6147b-053c-49b5-90e9-9dfad4e26715" />


アウトプットとして、4種類の英語変数名を表示します。
・通常変数
・Boolean (真偽値)
・配列・リスト
・定数 (SNAKE)
各変数名は右側のコピーアイコンクリックするとコピーされます。
<img width="1006" height="852" alt="2026-08-15_15h29_22" src="https://github.com/user-attachments/assets/3df5cc89-9fb4-4dcb-ab0e-c5d3875ca2fb" />


Google Apps Script（HtmlService）でホストされるWebアプリケーションです。
利用者が個別のAPIキー（Gemini API等）を用意することなく、完全に無料・登録不要で利用できます。
このアプリはGoogle純正の翻訳エンジン（LanguageApp.translate）を利用しつつ、プログラミングで頻出する用語（例: ss や lastRow）に対応するためのカスタム辞書エンジンを搭載しています。

詳細は仕様書.md をご覧ください。
