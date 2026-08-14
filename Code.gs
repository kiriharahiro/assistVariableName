/**
 * GAS変数名提案ツール
 * Version: v_03 (凍結版 / Stable Release)
 * 更新日: 2026-08-15
 * ノンプロ研 初心者GAS講座 サポートツール
 */
const CONFIG = {
  // 定数の表記スタイル: 'UPPER_SNAKE' (e.g. CONST_NAME) または 'CAMEL_CASE' (e.g. camelCase)
  DEFAULT_CONST_STYLE: 'UPPER_SNAKE'
};

/**
 * Webアプリケーションのエントリポイント
 * Index.htmlを読み込んで返します。
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('GAS変数名提案ツール')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// GASの一般的な用語対応表（文字数の長い順に定義）
const DICTIONARY = [
  // 15文字
  { jp: 'アクティブなスプレッドシート', en: 'activeSpreadsheet', short: 'ss' },
  
  // 13文字
  { jp: 'アクティブスプレッドシート', en: 'activeSpreadsheet', short: 'ss' },
  
  // 9文字
  { jp: 'アクティブなシート', en: 'activeSheet', short: 'sheet' },
  { jp: 'プレゼンテーション', en: 'presentation', short: 'pres' },
  
  // 8文字
  { jp: 'アクティブシート', en: 'activeSheet', short: 'sheet' },
  { jp: 'スプレッドシート', en: 'spreadsheet', short: 'ss' },
  { jp: 'メールアドレス', en: 'emailAddress', short: 'email' },
  
  // 6文字
  { jp: 'オブジェクト', en: 'object', short: 'obj' },
  { jp: 'インデックス', en: 'index', short: 'idx' },
  { jp: '添付ファイル', en: 'attachment', short: 'attachment' },
  { jp: '二次元配列', en: 'twoDimensionalArray', short: 'values' },
  { jp: 'ドキュメント', en: 'document', short: 'doc' },
  { jp: 'カレンダー', en: 'calendar', short: 'cal' },
  { jp: 'メッセージ', en: 'message', short: 'msg' },
  { jp: 'レスポンス', en: 'response', short: 'res' },
  { jp: 'リクエスト', en: 'request', short: 'req' },
  
  // 5文字
  { jp: 'セル範囲', en: 'range', short: 'range' },
  { jp: '値リスト', en: 'values', short: 'values' },
  { jp: '開始時間', en: 'startTime', short: 'start' },
  { jp: '終了時間', en: 'endTime', short: 'end' },
  { jp: '一時的', en: 'temporary', short: 'tmp' },
  { jp: '設定値', en: 'config', short: 'config' },
  { jp: 'オプション', en: 'options', short: 'options' },
  { jp: 'プロパティ', en: 'properties', short: 'props' },
  
  // 4文字
  { jp: '繰り返し', en: 'index', short: 'i' },
  { jp: 'フォルダ', en: 'folder', short: 'folder' },
  { jp: 'ユーザー', en: 'user', short: 'user' },
  { jp: 'カウンタ', en: 'counter', short: 'i' },
  { jp: 'ファイル', en: 'file', short: 'file' },
  { jp: 'フォーム', en: 'form', short: 'form' },
  { jp: 'テキスト', en: 'text', short: 'txt' },
  { jp: 'スレッド', en: 'thread', short: 'thread' },
  { jp: 'レコード', en: 'record', short: 'record' },
  { jp: 'ヘッダー', en: 'header', short: 'header' },
  { jp: '行データ', en: 'rowData', short: 'row' },
  { jp: '列データ', en: 'columnData', short: 'col' },
  { jp: '文字列', en: 'string', short: 'str' },
  { jp: 'チェック', en: 'check', short: 'check' },
  
  // 3文字
  { jp: '最終行', en: 'lastRow', short: 'lastRow' },
  { jp: '最終列', en: 'lastColumn', short: 'lastColumn' },
  { jp: 'シート', en: 'sheet', short: 'sheet' },
  { jp: 'データ', en: 'data', short: 'data' },
  { jp: '行番号', en: 'rowNumber', short: 'row' },
  { jp: '列番号', en: 'columnNumber', short: 'col' },
  { jp: '下書き', en: 'draft', short: 'draft' },
  { jp: 'ラベル', en: 'label', short: 'label' },
  { jp: '見出し', en: 'header', short: 'header' },
  { jp: 'リスト', en: 'list', short: 'list' },
  { jp: 'リンク', en: 'link', short: 'link' },
  { jp: 'フラグ', en: 'flag', short: 'flag' },
  { jp: 'コピー', en: 'copy', short: 'copy' },
  { jp: 'エラー', en: 'error', short: 'err' },
  { jp: 'マップ', en: 'map', short: 'map' },
  { jp: 'URL', en: 'url', short: 'url' },
  
  // 2文字
  { jp: '範囲', en: 'range', short: 'range' },
  { jp: '配列', en: 'array', short: 'arr' },
  { jp: '宛先', en: 'recipient', short: 'to' },
  { jp: '件名', en: 'subject', short: 'subject' },
  { jp: '本文', en: 'body', short: 'body' },
  { jp: '送信', en: 'send', short: 'send' },
  { jp: '取得', en: 'get', short: 'get' },
  { jp: '設定', en: 'set', short: 'set' },
  { jp: '削除', en: 'delete', short: 'del' },
  { jp: '更新', en: 'update', short: 'update' },
  { jp: '名前', en: 'name', short: 'name' },
  { jp: '日付', en: 'date', short: 'date' },
  { jp: '時間', en: 'time', short: 'time' },
  { jp: '予定', en: 'event', short: 'event' },
  { jp: '件数', en: 'count', short: 'count' },
  { jp: '合計', en: 'total', short: 'total' },
  { jp: '平均', en: 'average', short: 'avg' },
  { jp: '最大', en: 'maximum', short: 'max' },
  { jp: '最小', en: 'minimum', short: 'min' },
  { jp: '判定', en: 'result', short: 'status' },
  { jp: '結果', en: 'result', short: 'res' },
  { jp: '数値', en: 'number', short: 'num' },
  { jp: '新規', en: 'new', short: 'new' },
  { jp: '作成', en: 'create', short: 'create' },
  { jp: '実行', en: 'run', short: 'run' },
  { jp: '警告', en: 'warning', short: 'warn' },
  { jp: 'ログ', en: 'log', short: 'log' },
  { jp: '一覧', en: 'list', short: 'list' },
  { jp: '辞書', en: 'dictionary', short: 'dict' },
  { jp: 'ID', en: 'id', short: 'id' },
  
  // 1文字
  { jp: '値', en: 'value', short: 'val' },
  { jp: '行', en: 'row', short: 'row' },
  { jp: '列', en: 'column', short: 'col' },
];

/**
 * 日本語の指示からGASに適したキャメルケースの変数名を提案します。
 * すべての変数タイプ（通常変数const/let、配列、真偽値、定数）の結果を一括で返します。
 * フロントエンドから非同期で呼び出されます。
 * 
 * @param {string} japaneseText 日本語の指示
 * @return {object} 提案結果のオブジェクト
 */
function suggestVariableName(japaneseText) {
  if (!japaneseText || japaneseText.trim() === '') {
    throw new Error('日本語を入力してください。');
  }

  const input = japaneseText.trim();

  try {
    // 1. 全体翻訳ベース（説明的・詳細な名前のベース）
    let fullTranslation = '';
    try {
      fullTranslation = LanguageApp.translate(input, 'ja', 'en');
    } catch (e) {
      fullTranslation = input; // 翻訳失敗時は入力をそのまま
    }

    // 2. 辞書マッチングと個別翻訳による解析
    let workingText = input;
    const matchedTokens = [];

    // 辞書に一致する部分をプレースホルダーに置換
    DICTIONARY.forEach((item, index) => {
      const regex = new RegExp(item.jp, 'g');
      if (regex.test(workingText)) {
        workingText = workingText.replace(regex, ` __TOKEN_${index}__ `);
        matchedTokens[index] = item;
      }
    });

    // 助詞（の、を、に、が、は、と、で、から、など）や不要な記号を除去・スペースに置換
    workingText = workingText.replace(/[のをおにはとでから]/g, ' ');
    workingText = workingText.replace(/[、。，．・_-\s]+/g, ' ');

    // 単語に分解
    const rawWords = workingText.split(' ').filter(word => word.trim() !== '');

    // 各単語を処理（プレースホルダーは辞書データに戻し、日本語は翻訳する）
    const parsedStandardWords = [];
    const parsedShortWords = [];

    rawWords.forEach(word => {
      const tokenMatch = word.match(/__TOKEN_(\d+)__/);
      if (tokenMatch) {
        const index = parseInt(tokenMatch[1], 10);
        const item = matchedTokens[index];
        parsedStandardWords.push(item.en);
        parsedShortWords.push(item.short);
      } else {
        // 辞書にない日本語単語の処理
        if (/^[a-zA-Z0-9_]+$/.test(word)) {
          parsedStandardWords.push(word);
          parsedShortWords.push(word);
        } else {
          try {
            const translated = LanguageApp.translate(word, 'ja', 'en');
            parsedStandardWords.push(translated);
            parsedShortWords.push(translated);
          } catch (e) {
            parsedStandardWords.push(word);
            parsedShortWords.push(word);
          }
        }
      }
    });

    // 3. 基本となるキャメルケース候補の組み立て

    // --- 推奨（GAS慣習）の基本名 ---
    let baseRecName = '';
    const hasLastRow = parsedShortWords.includes('lastRow');
    const hasLastColumn = parsedShortWords.includes('lastColumn');
    
    if (hasLastRow && parsedShortWords.length > 1 && parsedShortWords[parsedShortWords.length - 1] === 'lastRow') {
      baseRecName = 'lastRow';
    } else if (hasLastColumn && parsedShortWords.length > 1 && parsedShortWords[parsedShortWords.length - 1] === 'lastColumn') {
      baseRecName = 'lastColumn';
    } else {
      baseRecName = toCamelCase(parsedShortWords.join(' '));
    }

    // --- 標準的な基本名 ---
    let baseStdName = toCamelCase(parsedStandardWords.join(' '));

    // 4. 各変数タイプごとの候補リストを作成
    const types = [
      { id: 'variable_const', label: '通常変数 (const)', prefix: 'const' },
      { id: 'variable_let', label: '通常変数 (let)', prefix: 'let' },
      { id: 'boolean', label: 'Boolean (真偽値)', prefix: 'let' },
      { id: 'array', label: '配列・リスト', prefix: 'const' },
      { id: 'constant_snake', label: '定数 (SNAKE)', prefix: 'const' }
    ];

    const resultsList = [];

    types.forEach(t => {
      let recName = applyVarTypeRules(baseRecName, t.id, input);
      let stdName = applyVarTypeRules(baseStdName, t.id, input);

      const suggestions = [];
      const addedNames = new Set();

      if (recName && !addedNames.has(recName)) {
        suggestions.push({
          name: recName,
          type: '推奨（GAS慣習）',
          reason: 'GASで一般的に使われる、シンプルで直感的な名前です。',
          prefix: t.prefix
        });
        addedNames.add(recName);
      }

      if (stdName && !addedNames.has(stdName)) {
        suggestions.push({
          name: stdName,
          type: '標準的',
          reason: '言葉の意味をそのままキャメルケースにした名前です。',
          prefix: t.prefix
        });
        addedNames.add(stdName);
      }

      if (suggestions.length === 0) {
        suggestions.push({
          name: 'variableName',
          type: 'フォールバック',
          reason: '変換できませんでした。一般的な変数名です。',
          prefix: t.prefix
        });
      }

      resultsList.push({
        id: t.id,
        label: t.label,
        prefix: t.prefix,
        suggestions: suggestions
      });
    });

    return {
      success: true,
      originalText: input,
      results: resultsList
    };

  } catch (error) {
    return {
      success: false,
      error: error.message || 'エラーが発生しました。'
    };
  }
}

/**
 * 文字列をキャメルケース（lowerCamelCase）に変換します。
 * 
 * @param {string} str 変換対象の文字列
 * @return {string} キャメルケース化された文字列
 */
function toCamelCase(str) {
  if (!str) return '';

  // 記号（アポストロフィなど）の除去と、スペースやハイフンでの分割
  let cleanStr = str.replace(/['’]/g, ''); // アポストロフィは除去 (e.g. spreadsheet's -> spreadsheets)
  cleanStr = cleanStr.replace(/[^a-zA-Z0-9]/g, ' '); // 英数字以外はスペースに変換

  const words = cleanStr.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return '';

  return words.map((word, index) => {
    const lower = word.toLowerCase();
    if (index === 0) {
      return lower;
    }
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join('');
}

/**
 * 変数タイプに応じた命名規則を適用します。
 * 
 * @param {string} name 元のキャメルケースの変数名
 * @param {string} type 変数タイプ ('constant', 'variable', 'array', 'boolean')
 * @param {string} originalJp 元の日本語テキスト
 * @return {string} 変換後の変数名
 */
function applyVarTypeRules(name, type, originalJp) {
  if (!name) return '';
  
  switch (type) {
    case 'constant_snake':
      return toUpperSnakeCase(name);
      
    case 'array':
      return toPlural(name);
      
    case 'boolean':
      return toBooleanName(name, originalJp);
      
    case 'variable_const':
    case 'variable_let':
    default:
      return name; // 通常変数はそのままキャメルケース
  }
}

/**
 * キャメルケースの文字列を大文字スネークケースに変換します。
 * 例: activeSheetId -> ACTIVE_SHEET_ID
 * 
 * @param {string} str キャメルケース文字列
 * @return {string} 大文字スネークケース文字列
 */
function toUpperSnakeCase(str) {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, '_$1') // 大文字の前にアンダースコアを挿入
    .replace(/_+/g, '_')        // 重複したアンダースコアを1つに
    .toUpperCase()              // すべて大文字に変換
    .replace(/^_/, '');         // 先頭のアンダースコアを除去
}

/**
 * キャメルケースの文字列の最後の単語を複数形に変換します。
 * 
 * @param {string} str キャメルケース文字列
 * @return {string} 複数形化された文字列
 */
function toPlural(str) {
  if (!str) return '';

  // キャメルケースを大文字の区切りで分割して単語リストを作成
  // 例: activeSheetId -> ['active', 'Sheet', 'Id']
  const words = str.split(/(?=[A-Z])/);
  if (words.length === 0) return '';

  const lastIndex = words.length - 1;
  const lastWord = words[lastIndex];

  // 最後の単語を複数形にする
  words[lastIndex] = makeWordPlural(lastWord);

  return words.join('');
}

/**
 * 単一の英単語を複数形に変換します（大文字小文字の状態を維持）。
 * 
 * @param {string} word 単語
 * @return {string} 複数形化された単語
 */
function makeWordPlural(word) {
  const lower = word.toLowerCase();
  
  // GAS特有の慣習や例外
  if (lower === 'ss') return 'ss'; // GASのスプレッドシート略称は複数の場合も ss のままにする
  if (lower === 'child') return word.replace(/child/i, match => match === 'child' ? 'children' : 'CHILDREN');
  if (lower === 'person') return word.replace(/person/i, match => match === 'person' ? 'people' : 'PEOPLE');
  if (lower === 'index') return word.replace(/index/i, match => match === 'index' ? 'indices' : 'INDICES');

  // y で終わる単語 (子音 + y の場合のみ ies に変換)
  // 例: property -> properties, key -> keys
  if (lower.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(lower.charAt(lower.length - 2))) {
    return word.slice(0, -1) + (word.charAt(word.length - 1) === 'y' ? 'ies' : 'IES');
  }

  // s, x, z, ch, sh で終わる単語は es を追加
  if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('z') || lower.endsWith('ch') || lower.endsWith('sh')) {
    return word + (word === word.toUpperCase() ? 'ES' : 'es');
  }

  // それ以外は s を追加
  return word + (word === word.toUpperCase() ? 'S' : 's');
}

/**
 * 真偽値（Boolean）用の変数名に変換します（is~ または has~）。
 * 
 * @param {string} str 元の変数名（キャメルケース）
 * @param {string} originalJp 元の日本語テキスト
 * @return {string} 変換後の真偽値名
 */
function toBooleanName(str, originalJp) {
  if (!str) return '';

  const lower = str.toLowerCase();
  // すでに is または has で始まっている場合はそのまま
  if (lower.startsWith('is') || lower.startsWith('has')) {
    return str;
  }

  // has を使用するかの判定条件:
  // 1. 日本語に「ある」「持」「含」「存在」「得」などが含まれる場合
  // 2. 変数名に特定の所有を表す単語が含まれる場合
  const hasKeywords = /[ある持含存在得]/;
  const isHasWord = ['data', 'value', 'file', 'error', 'folder', 'permission', 'access', 'token', 'result', 'list', 'event'].some(w => lower.includes(w));

  const useHas = hasKeywords.test(originalJp) || isHasWord;
  const prefix = useHas ? 'has' : 'is';

  // 最初の文字を大文字にする
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return prefix + capitalized;
}
