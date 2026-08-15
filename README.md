# assistVariableName

## assistVariableName の概要
こちらはノンプロ研Slackチャンネル「#10_リーダブル変数メーカー」の一時代替アプリとして開発したものです。

### デプロイ方法
GoogleAppsScript にCode.gs、Index.htmlを貼り付け、デプロイします。

### アプリの実行方法
デプロイで生成された WebアプリのURLをブラウザに入力するとアプリが起動します。

### 使い方
日本語の関数名を入力してEnter または「英語の変数名を生成する」をクリックすると、4種類の英語変数名を表示します。
・通常変数
・Boolean (真偽値)
・配列・リスト
・定数 (SNAKE)
各変数名は右側のコピーアイコンクリックするとコピーされます。

Google Apps Script（HtmlService）でホストされるWebアプリケーションです。
利用者が個別のAPIキー（Gemini API等）を用意することなく、完全に無料・登録不要で利用できます。
このアプリはGoogle純正の翻訳エンジン（LanguageApp.translate）を利用しつつ、プログラミングで頻出する用語（例: ss や lastRow）に対応するためのカスタム辞書エンジンを搭載しています。

詳細は仕様書.md をご覧ください。
