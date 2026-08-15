/**
 * 変数名・関数名提案ツール
 * Version: v_05
 * 更新日: 2026-08-15
 * ノンプロ研 サポートツール
 */
const CONFIG = {
  DEFAULT_CONST_STYLE: 'UPPER_SNAKE'
};

/**
 * Webアプリケーションのエントリポイント
 * Index.htmlを読み込んで返します。
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('変数名・関数名提案ツール')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// プログラミングで一般的な用語対応表（文字数の長い順に定義）
// isVerb: true を付与することで関数名生成時の「動詞+名詞」自動並べ替えに使用
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
  { jp: 'チェック', en: 'check', short: 'check', isVerb: true },
  { jp: '取得する', en: 'get', short: 'get', isVerb: true },
  { jp: '設定する', en: 'set', short: 'set', isVerb: true },
  { jp: '送信する', en: 'send', short: 'send', isVerb: true },
  { jp: '作成する', en: 'create', short: 'create', isVerb: true },
  { jp: '削除する', en: 'delete', short: 'del', isVerb: true },
  { jp: '更新する', en: 'update', short: 'update', isVerb: true },
  { jp: '実行する', en: 'run', short: 'run', isVerb: true },
  { jp: '検索する', en: 'search', short: 'search', isVerb: true },

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
  { jp: 'コピー', en: 'copy', short: 'copy', isVerb: true },
  { jp: 'エラー', en: 'error', short: 'err' },
  { jp: 'マップ', en: 'map', short: 'map' },
  { jp: 'URL', en: 'url', short: 'url' },
  { jp: '検索', en: 'search', short: 'search', isVerb: true },
  
  // 2文字
  { jp: '範囲', en: 'range', short: 'range' },
  { jp: '配列', en: 'array', short: 'arr' },
  { jp: '宛先', en: 'recipient', short: 'to' },
  { jp: '件名', en: 'subject', short: 'subject' },
  { jp: '本文', en: 'body', short: 'body' },
  { jp: '送信', en: 'send', short: 'send', isVerb: true },
  { jp: '取得', en: 'get', short: 'get', isVerb: true },
  { jp: '設定', en: 'set', short: 'set', isVerb: true },
  { jp: '削除', en: 'delete', short: 'del', isVerb: true },
  { jp: '更新', en: 'update', short: 'update', isVerb: true },
  { jp: '名前', en: 'name', short: 'name' },
  { jp: '日付', en: 'date', short: 'date' },
  { jp: '時間', en: 'time', short: 'time' },
  { jp: '予定', en: 'event', short: 'event' },
  { jp: '件数', en: 'count', short: 'count' },
  { jp: '合計', en: 'total', short: 'total' },
  { jp: '平均', en: 'average', short: 'avg' },
  { jp: '最大', en: 'maximum', short: 'max' },
  { jp: '最小', en: 'minimum', short: 'min' },
  { jp: '判定', en: 'check', short: 'check', isVerb: true },
  { jp: '結果', en: 'result', short: 'res' },
  { jp: '数値', en: 'number', short: 'num' },
  { jp: '新規', en: 'new', short: 'new' },
  { jp: '作成', en: 'create', short: 'create', isVerb: true },
  { jp: '実行', en: 'run', short: 'run', isVerb: true },
  { jp: '警告', en: 'warning', short: 'warn' },
  { jp: 'ログ', en: 'log', short: 'log' },
  { jp: '一覧', en: 'list', short: 'list' },
  { jp: '辞書', en: 'dictionary', short: 'dict' },
  { jp: 'ID', en: 'id', short: 'id' },
  
  // 1文字
  { jp: '値', en: 'value', short: 'val' },
  { jp: '行', en: 'row', short: 'row' },
  { jp: '列', en: 'column', short: 'col' },
  { jp: '名', en: 'name', short: 'name' },
];

/**
 * 日本語の指示から適したキャメルケースの変数名または関数名を提案します。
 * 
 * @param {string} japaneseText 日本語の指示
 * @param {string} mode 生成モード ('variable' | 'function')
 * @return {object} 提案結果のオブジェクト
 */
function suggestVariableName(japaneseText, mode = 'variable') {
  if (!japaneseText || japaneseText.trim() === '') {
    throw new Error('日本語を入力してください。');
  }

  const input = japaneseText.trim();
  const isFunctionMode = (mode === 'function');

  try {
    let workingText = input;
    const matchedTokens = [];

    // 辞書に一致する部分をプレースホルダーに置換
    DICTIONARY.forEach((item, index) => {
      if (workingText.includes(item.jp)) {
        const escaped = item.jp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        workingText = workingText.replace(new RegExp(escaped, 'g'), ` __TOKEN_${index}__ `);
        matchedTokens[index] = item;
      }
    });

    // 助詞（の、を、に、が、は、と、で、から、など）や不要な記号を除去
    workingText = workingText.replace(/[のをおにはとでから]/g, ' ');
    workingText = workingText.replace(/[、。，．・\-\s]+/g, ' ');

    const rawWords = workingText.split(' ').filter(word => word.trim() !== '');

    const parsedStandardTokens = [];
    const parsedShortTokens = [];

    rawWords.forEach(word => {
      const tokenMatch = word.match(/__TOKEN_(\d+)__/);
      if (tokenMatch) {
        const index = parseInt(tokenMatch[1], 10);
        const item = matchedTokens[index];
        parsedStandardTokens.push({ text: item.en, isVerb: !!item.isVerb });
        parsedShortTokens.push({ text: item.short, isVerb: !!item.isVerb });
      } else {
        if (/^[a-zA-Z0-9_]+$/.test(word)) {
          parsedStandardTokens.push({ text: word, isVerb: false });
          parsedShortTokens.push({ text: word, isVerb: false });
        } else {
          try {
            const translated = LanguageApp.translate(word, 'ja', 'en');
            parsedStandardTokens.push({ text: translated, isVerb: false });
            parsedShortTokens.push({ text: translated, isVerb: false });
          } catch (e) {
            parsedStandardTokens.push({ text: word, isVerb: false });
            parsedShortTokens.push({ text: word, isVerb: false });
          }
        }
      }
    });

    // 関数モード（または動詞が含まれる場合）、動詞を先頭（Verb + Noun）に自動並べ替え
    let finalStandardWords = [];
    let finalShortWords = [];

    if (isFunctionMode) {
      finalStandardWords = reorderTokensForFunction(parsedStandardTokens);
      finalShortWords = reorderTokensForFunction(parsedShortTokens);
    } else {
      finalStandardWords = parsedStandardTokens.map(t => t.text);
      finalShortWords = parsedShortTokens.map(t => t.text);
    }

    // 基本名（短縮形および標準形）
    let baseRecName = toCamelCase(finalShortWords.join(' '));
    let baseStdName = toCamelCase(finalStandardWords.join(' '));

    const resultsList = [];

    if (isFunctionMode) {
      // --- 関数名モードのカテゴリ ---
      const functionTypes = [
        { id: 'func_standard', label: '通常関数 (Verb + Noun)' },
        { id: 'func_boolean', label: 'Boolean判定関数 (is... / has...)' },
        { id: 'func_handler', label: 'イベントハンドラ (on... / handle...)' },
        { id: 'func_private', label: '内部・ヘルパー関数 (_... / fetch...)' }
      ];

      functionTypes.forEach(t => {
        let recName = applyFunctionTypeRules(baseRecName, t.id, input);
        let stdName = applyFunctionTypeRules(baseStdName, t.id, input);

        const suggestions = [];
        const addedNames = new Set();

        if (recName && !addedNames.has(recName)) {
          suggestions.push({ name: recName });
          addedNames.add(recName);
        }

        if (stdName && !addedNames.has(stdName)) {
          suggestions.push({ name: stdName });
          addedNames.add(stdName);
        }

        if (suggestions.length === 0) {
          suggestions.push({ name: 'doProcess' });
        }

        resultsList.push({
          id: t.id,
          label: t.label,
          suggestions: suggestions
        });
      });

    } else {
      // --- 変数名モードのカテゴリ ---
      const variableTypes = [
        { id: 'variable', label: '通常変数' },
        { id: 'boolean', label: 'Boolean (真偽値)' },
        { id: 'array', label: '配列・リスト' },
        { id: 'constant_snake', label: '定数 (SNAKE)' }
      ];

      variableTypes.forEach(t => {
        let recName = applyVarTypeRules(baseRecName, t.id, input);
        let stdName = applyVarTypeRules(baseStdName, t.id, input);

        const suggestions = [];
        const addedNames = new Set();

        if (recName && !addedNames.has(recName)) {
          suggestions.push({ name: recName });
          addedNames.add(recName);
        }

        if (stdName && !addedNames.has(stdName)) {
          suggestions.push({ name: stdName });
          addedNames.add(stdName);
        }

        if (suggestions.length === 0) {
          suggestions.push({ name: 'variableName' });
        }

        resultsList.push({
          id: t.id,
          label: t.label,
          suggestions: suggestions
        });
      });
    }

    return {
      success: true,
      mode: mode,
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
 * 動詞トークンを先頭に並べ替えます（Verb + Noun 構造の構築）。
 * 
 * @param {Array} tokens [{ text: string, isVerb: boolean }]
 * @return {Array} 並べ替え後の文字列配列
 */
function reorderTokensForFunction(tokens) {
  if (!tokens || tokens.length === 0) return [];
  const verbs = tokens.filter(t => t.isVerb);
  const nouns = tokens.filter(t => !t.isVerb);

  if (verbs.length > 0) {
    return [...verbs.map(v => v.text), ...nouns.map(n => n.text)];
  }
  return tokens.map(t => t.text);
}

/**
 * 文字列をキャメルケース（lowerCamelCase）に変換します。
 */
function toCamelCase(str) {
  if (!str) return '';

  let cleanStr = str.replace(/['’]/g, '');
  cleanStr = cleanStr.replace(/[^a-zA-Z0-9]/g, ' ');

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
      
    case 'variable':
    default:
      return name;
  }
}

/**
 * 関数タイプに応じた命名規則を適用します。
 */
function applyFunctionTypeRules(name, type, originalJp) {
  if (!name) return '';

  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

  switch (type) {
    case 'func_boolean':
      if (name.startsWith('is') || name.startsWith('has') || name.startsWith('can') || name.startsWith('check')) {
        return name;
      }
      const hasKeywords = /[ある持含存在得]/;
      const prefix = hasKeywords.test(originalJp) ? 'has' : 'is';
      return prefix + capitalized;

    case 'func_handler':
      if (name.startsWith('on') || name.startsWith('handle')) {
        return name;
      }
      return 'on' + capitalized;

    case 'func_private':
      if (name.startsWith('_')) {
        return name;
      }
      return '_' + name;

    case 'func_standard':
    default:
      return name;
  }
}

/**
 * キャメルケースの文字列を大文字スネークケースに変換します。
 */
function toUpperSnakeCase(str) {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/_+/g, '_')
    .toUpperCase()
    .replace(/^_/, '');
}

/**
 * キャメルケースの文字列の最後の単語を複数形に変換します。
 */
function toPlural(str) {
  if (!str) return '';

  const words = str.split(/(?=[A-Z])/);
  if (words.length === 0) return '';

  const lastIndex = words.length - 1;
  const lastWord = words[lastIndex];

  words[lastIndex] = makeWordPlural(lastWord);

  return words.join('');
}

/**
 * 単一の英単語を複数形に変換します。
 */
function makeWordPlural(word) {
  const lower = word.toLowerCase();
  
  if (lower === 'ss') return 'ss';
  if (lower === 'child') return word.replace(/child/i, match => match === 'child' ? 'children' : 'CHILDREN');
  if (lower === 'person') return word.replace(/person/i, match => match === 'person' ? 'people' : 'PEOPLE');
  if (lower === 'index') return word.replace(/index/i, match => match === 'index' ? 'indices' : 'INDICES');

  if (lower.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(lower.charAt(lower.length - 2))) {
    return word.slice(0, -1) + (word.charAt(word.length - 1) === 'y' ? 'ies' : 'IES');
  }

  if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('z') || lower.endsWith('ch') || lower.endsWith('sh')) {
    return word + (word === word.toUpperCase() ? 'ES' : 'es');
  }

  return word + (word === word.toUpperCase() ? 'S' : 's');
}

/**
 * 真偽値（Boolean）用の変数名に変換します。
 */
function toBooleanName(str, originalJp) {
  if (!str) return '';

  const lower = str.toLowerCase();
  if (lower.startsWith('is') || lower.startsWith('has')) {
    return str;
  }

  const hasKeywords = /[ある持含存在得]/;
  const isHasWord = ['data', 'value', 'file', 'error', 'folder', 'permission', 'access', 'token', 'result', 'list', 'event'].some(w => lower.includes(w));

  const useHas = hasKeywords.test(originalJp) || isHasWord;
  const prefix = useHas ? 'has' : 'is';

  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return prefix + capitalized;
}
