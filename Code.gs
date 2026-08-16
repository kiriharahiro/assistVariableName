/**
 * 変数名・関数名提案ツール
 * Version: v_06
 * 更新日: 2026-08-16
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
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// プログラミングで一般的な用語対応表（文字数の長い順に定義）
// isVerb: true を付与することで関数名生成時の「動詞+名詞」自動並べ替えに使用
// clShorts: IBM System i CLコマンドスタイルの標準3文字略号配列
// gas: GASでよく使われる標準関数・メソッドの慣用表現
const DICTIONARY = [
  // 15文字
  { jp: 'アクティブなスプレッドシート', en: 'activeSpreadsheet', short: 'ss', clShorts: ['ACT', 'SPS'], gas: 'activeSpreadsheet' },
  
  // 13文字
  { jp: 'アクティブスプレッドシート', en: 'activeSpreadsheet', short: 'ss', clShorts: ['ACT', 'SPS'], gas: 'activeSpreadsheet' },
  
  // 10文字
  { jp: 'アクセス権を付与する', en: 'grantAccessAuthority', short: 'grtAccAut', clShorts: ['GRT', 'ACC', 'AUT'], isVerb: true, gas: 'grantAccess' },
  { jp: 'アクティブなジョブ', en: 'activeJob', short: 'actJob', clShorts: ['ACT', 'JOB'] },
  { jp: 'アクティブジョブ', en: 'activeJob', short: 'actJob', clShorts: ['ACT', 'JOB'] },

  // 9文字
  { jp: 'アクティブなシート', en: 'activeSheet', short: 'sheet', clShorts: ['ACT', 'SHT'], gas: 'activeSheet' },
  { jp: 'プレゼンテーション', en: 'presentation', short: 'pres', clShorts: ['PRS'], gas: 'presentation' },
  { jp: 'スプールファイル', en: 'spooledFile', short: 'splf', clShorts: ['SPL', 'FIL'] },
  
  // 8文字
  { jp: 'アクティブシート', en: 'activeSheet', short: 'sheet', clShorts: ['ACT', 'SHT'], gas: 'activeSheet' },
  { jp: 'スプレッドシート', en: 'spreadsheet', short: 'ss', clShorts: ['SPS'], gas: 'spreadsheet' },
  { jp: 'メールアドレス', en: 'emailAddress', short: 'email', clShorts: ['EML', 'ADR'], gas: 'emailAddress' },
  { jp: 'ライブラリ', en: 'library', short: 'lib', clShorts: ['LIB'] },
  
  // 6文字
  { jp: 'オブジェクト', en: 'object', short: 'obj', clShorts: ['OBJ'] },
  { jp: 'インデックス', en: 'index', short: 'idx', clShorts: ['IDX'] },
  { jp: '添付ファイル', en: 'attachment', short: 'attachment', clShorts: ['ATT', 'FIL'] },
  { jp: '二次元配列', en: 'twoDimensionalArray', short: 'values', clShorts: ['ARR'], gas: 'values' },
  { jp: 'ドキュメント', en: 'document', short: 'doc', clShorts: ['DOC'], gas: 'document' },
  { jp: 'カレンダー', en: 'calendar', short: 'cal', clShorts: ['CAL'], gas: 'calendar' },
  { jp: 'メッセージ', en: 'message', short: 'msg', clShorts: ['MSG'], gas: 'message' },
  { jp: 'レスポンス', en: 'response', short: 'res', clShorts: ['RSP'] },
  { jp: 'リクエスト', en: 'request', short: 'req', clShorts: ['REQ'] },
  { jp: 'アクセス権', en: 'accessAuthority', short: 'accAut', clShorts: ['ACC', 'AUT'] },
  
  // 5文字
  { jp: 'セル範囲', en: 'range', short: 'range', clShorts: ['RNG'], gas: 'range' },
  { jp: 'データ範囲', en: 'dataRange', short: 'range', clShorts: ['DTA', 'RNG'], gas: 'dataRange' },
  { jp: '値リスト', en: 'values', short: 'values', clShorts: ['VAL', 'LST'], gas: 'values' },
  { jp: '開始時間', en: 'startTime', short: 'start', clShorts: ['STR', 'TIM'] },
  { jp: '終了時間', en: 'endTime', short: 'end', clShorts: ['END', 'TIM'] },
  { jp: '一時的', en: 'temporary', short: 'tmp', clShorts: ['TMP'] },
  { jp: '設定値', en: 'config', short: 'config', clShorts: ['CFG'] },
  { jp: 'オプション', en: 'options', short: 'options', clShorts: ['OPT'] },
  { jp: 'プロパティ', en: 'properties', short: 'props', clShorts: ['PRP'], gas: 'properties' },
  { jp: '表示する', en: 'display', short: 'dsp', clShorts: ['DSP'], isVerb: true, gas: 'display' },
  { jp: 'ディスク', en: 'disk', short: 'dsk', clShorts: ['DSK'] },
  { jp: 'スペース', en: 'space', short: 'spc', clShorts: ['SPC'] },
  { jp: '付与する', en: 'grant', short: 'grt', clShorts: ['GRT'], isVerb: true, gas: 'grant' },
  { jp: 'アクセス', en: 'access', short: 'acc', clShorts: ['ACC'] },
  { jp: '操作する', en: 'workWith', short: 'wrk', clShorts: ['WRK'], isVerb: true, gas: 'workWith' },
  { jp: '作業する', en: 'workWith', short: 'wrk', clShorts: ['WRK'], isVerb: true, gas: 'workWith' },
  { jp: '処理する', en: 'process', short: 'prc', clShorts: ['PRC'], isVerb: true, gas: 'process' },
  
  // 4文字
  { jp: '繰り返し', en: 'index', short: 'i', clShorts: ['IDX'] },
  { jp: 'フォルダ', en: 'folder', short: 'folder', clShorts: ['FLD'], gas: 'folder' },
  { jp: 'ユーザー', en: 'user', short: 'user', clShorts: ['USR'], gas: 'user' },
  { jp: 'カウンタ', en: 'counter', short: 'i', clShorts: ['CNT'] },
  { jp: 'ファイル', en: 'file', short: 'file', clShorts: ['FIL'], gas: 'file' },
  { jp: 'フォーム', en: 'form', short: 'form', clShorts: ['FRM'], gas: 'form' },
  { jp: 'テキスト', en: 'text', short: 'txt', clShorts: ['TXT'], gas: 'text' },
  { jp: 'スレッド', en: 'thread', short: 'thread', clShorts: ['TRD'], gas: 'thread' },
  { jp: 'レコード', en: 'record', short: 'record', clShorts: ['REC'] },
  { jp: 'ヘッダー', en: 'header', short: 'header', clShorts: ['HDR'] },
  { jp: '行データ', en: 'rowData', short: 'row', clShorts: ['ROW', 'DTA'], gas: 'rowData' },
  { jp: '列データ', en: 'columnData', short: 'col', clShorts: ['COL', 'DTA'], gas: 'columnData' },
  { jp: '文字列', en: 'string', short: 'str', clShorts: ['STR'] },
  { jp: 'チェック', en: 'check', short: 'check', clShorts: ['CHK'], isVerb: true, gas: 'check' },
  { jp: '取得する', en: 'get', short: 'get', clShorts: ['RTV'], isVerb: true, gas: 'get' },
  { jp: '設定する', en: 'set', short: 'set', clShorts: ['SET'], isVerb: true, gas: 'set' },
  { jp: '送信する', en: 'send', short: 'send', clShorts: ['SND'], isVerb: true, gas: 'send' },
  { jp: '作成する', en: 'create', short: 'create', clShorts: ['CRT'], isVerb: true, gas: 'create' },
  { jp: '削除する', en: 'delete', short: 'del', clShorts: ['DLT'], isVerb: true, gas: 'delete' },
  { jp: '更新する', en: 'update', short: 'update', clShorts: ['CHG'], isVerb: true, gas: 'update' },
  { jp: '変更する', en: 'change', short: 'change', clShorts: ['CHG'], isVerb: true, gas: 'change' },
  { jp: '実行する', en: 'run', short: 'run', clShorts: ['RUN'], isVerb: true, gas: 'run' },
  { jp: '検索する', en: 'search', short: 'search', clShorts: ['SRCH'], isVerb: true, gas: 'search' },
  { jp: '出力する', en: 'output', short: 'out', clShorts: ['OUT'], isVerb: true },
  { jp: '入力する', en: 'input', short: 'inp', clShorts: ['INP'], isVerb: true },
  { jp: '剥奪する', en: 'revoke', short: 'rvk', clShorts: ['RVK'], isVerb: true },
  { jp: '許可する', en: 'allow', short: 'alw', clShorts: ['ALW'], isVerb: true },
  { jp: 'ジョブ', en: 'job', short: 'job', clShorts: ['JOB'] },
  { jp: '操作', en: 'work', short: 'wrk', clShorts: ['WRK'], isVerb: true },
  { jp: '作業', en: 'work', short: 'wrk', clShorts: ['WRK'], isVerb: true },

  // 3文字
  { jp: '最終行', en: 'lastRow', short: 'lastRow', clShorts: ['LST', 'ROW'], gas: 'lastRow' },
  { jp: '最終列', en: 'lastColumn', short: 'lastColumn', clShorts: ['LST', 'COL'], gas: 'lastColumn' },
  { jp: 'シート', en: 'sheet', short: 'sheet', clShorts: ['SHT'], gas: 'sheet' },
  { jp: 'データ', en: 'data', short: 'data', clShorts: ['DTA'], gas: 'data' },
  { jp: '行番号', en: 'rowNumber', short: 'row', clShorts: ['ROW'], gas: 'row' },
  { jp: '列番号', en: 'columnNumber', short: 'col', clShorts: ['COL'], gas: 'column' },
  { jp: 'アクティブ', en: 'active', short: 'act', clShorts: ['ACT'] },
  { jp: '最終', en: 'last', short: 'lst', clShorts: ['LST'] },
  { jp: '下書き', en: 'draft', short: 'draft', clShorts: ['DFT'] },
  { jp: 'ラベル', en: 'label', short: 'label', clShorts: ['LBL'] },
  { jp: '見出し', en: 'header', short: 'header', clShorts: ['HDR'] },
  { jp: 'リスト', en: 'list', short: 'list', clShorts: ['LST'] },
  { jp: 'リンク', en: 'link', short: 'link', clShorts: ['LNK'] },
  { jp: 'フラグ', en: 'flag', short: 'flag', clShorts: ['FLG'] },
  { jp: 'コピー', en: 'copy', short: 'copy', clShorts: ['CPY'], isVerb: true, gas: 'copy' },
  { jp: 'エラー', en: 'error', short: 'err', clShorts: ['ERR'] },
  { jp: 'マップ', en: 'map', short: 'map', clShorts: ['MAP'] },
  { jp: 'URL', en: 'url', short: 'url', clShorts: ['URL'] },
  { jp: '検索', en: 'search', short: 'search', clShorts: ['SRCH'], isVerb: true, gas: 'search' },
  { jp: '表示', en: 'display', short: 'dsp', clShorts: ['DSP'], isVerb: true, gas: 'display' },
  { jp: '容量', en: 'capacity', short: 'cap', clShorts: ['CAP'] },
  { jp: '領域', en: 'area', short: 'area', clShorts: ['ARA'] },
  { jp: '権限', en: 'authority', short: 'aut', clShorts: ['AUT'] },
  { jp: '付与', en: 'grant', short: 'grt', clShorts: ['GRT'], isVerb: true, gas: 'grant' },
  
  // 2文字
  { jp: '範囲', en: 'range', short: 'range', clShorts: ['RNG'], gas: 'getRange' },
  { jp: '配列', en: 'array', short: 'arr', clShorts: ['ARR'] },
  { jp: '宛先', en: 'recipient', short: 'to', clShorts: ['RCT'] },
  { jp: '件名', en: 'subject', short: 'subject', clShorts: ['SBJ'] },
  { jp: '本文', en: 'body', short: 'body', clShorts: ['BDY'] },
  { jp: '送信', en: 'send', short: 'send', clShorts: ['SND'], isVerb: true, gas: 'send' },
  { jp: '取得', en: 'get', short: 'get', clShorts: ['RTV'], isVerb: true, gas: 'get' },
  { jp: '設定', en: 'set', short: 'set', clShorts: ['SET'], isVerb: true, gas: 'set' },
  { jp: '削除', en: 'delete', short: 'del', clShorts: ['DLT'], isVerb: true, gas: 'delete' },
  { jp: '更新', en: 'update', short: 'update', clShorts: ['CHG'], isVerb: true, gas: 'update' },
  { jp: '変更', en: 'change', short: 'change', clShorts: ['CHG'], isVerb: true, gas: 'change' },
  { jp: '名前', en: 'name', short: 'name', clShorts: ['NAM'], gas: 'getName' },
  { jp: '日付', en: 'date', short: 'date', clShorts: ['DAT'] },
  { jp: '時間', en: 'time', short: 'time', clShorts: ['TIM'] },
  { jp: '予定', en: 'event', short: 'event', clShorts: ['EVT'], gas: 'createEvent' },
  { jp: '件数', en: 'count', short: 'count', clShorts: ['CNT'] },
  { jp: '合計', en: 'total', short: 'total', clShorts: ['TOT'] },
  { jp: '平均', en: 'average', short: 'avg', clShorts: ['AVG'] },
  { jp: '最大', en: 'maximum', short: 'max', clShorts: ['MAX'] },
  { jp: '最小', en: 'minimum', short: 'min', clShorts: ['MIN'] },
  { jp: '判定', en: 'check', short: 'check', clShorts: ['CHK'], isVerb: true, gas: 'check' },
  { jp: '結果', en: 'result', short: 'res', clShorts: ['RST'] },
  { jp: '数値', en: 'number', short: 'num', clShorts: ['NUM'] },
  { jp: '新規', en: 'new', short: 'new', clShorts: ['NEW'] },
  { jp: '作成', en: 'create', short: 'create', clShorts: ['CRT'], isVerb: true, gas: 'create' },
  { jp: '実行', en: 'run', short: 'run', clShorts: ['RUN'], isVerb: true, gas: 'run' },
  { jp: '警告', en: 'warning', short: 'warn', clShorts: ['WRN'] },
  { jp: 'ログ', en: 'log', short: 'log', clShorts: ['LOG'] },
  { jp: '一覧', en: 'list', short: 'list', clShorts: ['LST'] },
  { jp: '辞書', en: 'dictionary', short: 'dict', clShorts: ['DCT'] },
  { jp: 'ID', en: 'id', short: 'id', clShorts: ['ID'] },
  
  // 1文字
  { jp: '値', en: 'value', short: 'val', clShorts: ['VAL'], gas: 'getValue' },
  { jp: '行', en: 'row', short: 'row', clShorts: ['ROW'], gas: 'getRow' },
  { jp: '列', en: 'column', short: 'col', clShorts: ['COL'], gas: 'getColumn' },
  { jp: '名', en: 'name', short: 'name', clShorts: ['NAM'], gas: 'getName' },
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
    const parsedClTokens = [];
    const parsedGasTokens = [];

    rawWords.forEach(word => {
      const tokenMatch = word.match(/__TOKEN_(\d+)__/);
      if (tokenMatch) {
        const index = parseInt(tokenMatch[1], 10);
        const item = matchedTokens[index];
        const isVerb = !!item.isVerb || checkIsVerbJp(word);

        parsedStandardTokens.push({ text: item.en, isVerb: isVerb });
        parsedShortTokens.push({ text: item.short, isVerb: isVerb });
        parsedGasTokens.push({ text: item.gas || item.en, isVerb: isVerb });

        // clShorts (3文字配列) を個別の3文字トークンとして展開追加
        const clList = item.clShorts || [getClShortFromWord(item.en)];
        clList.forEach(clCode => {
          parsedClTokens.push({ text: clCode, isVerb: isVerb });
        });
      } else {
        const isV = checkIsVerbFromWord(word) || checkIsVerbJp(word);
        if (/^[a-zA-Z0-9_]+$/.test(word)) {
          parsedStandardTokens.push({ text: word, isVerb: isV });
          parsedShortTokens.push({ text: word, isVerb: isV });
          parsedClTokens.push({ text: getClShortFromWord(word), isVerb: isV });
          parsedGasTokens.push({ text: word, isVerb: isV });
        } else {
          try {
            const translated = LanguageApp.translate(word, 'ja', 'en');
            const isVTrans = isV || checkIsVerbFromWord(translated);
            parsedStandardTokens.push({ text: translated, isVerb: isVTrans });
            parsedShortTokens.push({ text: translated, isVerb: isVTrans });
            parsedClTokens.push({ text: getClShortFromWord(translated), isVerb: isVTrans });
            parsedGasTokens.push({ text: translated, isVerb: isVTrans });
          } catch (e) {
            parsedStandardTokens.push({ text: word, isVerb: isV });
            parsedShortTokens.push({ text: word, isVerb: isV });
            parsedClTokens.push({ text: getClShortFromWord(word), isVerb: isV });
          }
        }
      }
    });

    // 関数モード（または動詞が含まれる場合）、動詞を先頭（Verb + Noun）に自動並べ替え
    let finalStandardWords = [];
    let finalShortWords = [];
    let finalClWords = [];
    let finalGasWords = [];

    if (isFunctionMode) {
      finalStandardWords = reorderTokensForFunction(parsedStandardTokens);
      finalShortWords = reorderTokensForFunction(parsedShortTokens);
      finalClWords = reorderTokensForFunction(parsedClTokens);
      finalGasWords = reorderTokensForFunction(parsedGasTokens);
    } else {
      finalStandardWords = parsedStandardTokens.map(t => t.text);
      finalShortWords = parsedShortTokens.map(t => t.text);
      finalClWords = parsedClTokens.map(t => t.text);
      finalGasWords = parsedGasTokens.map(t => t.text);
    }

    // 各スタイルの基本生成名
    let baseRecName = toCamelCase(finalShortWords.join(' '));
    let baseStdName = toCamelCase(finalStandardWords.join(' '));
    let base3x3Upper = toClStyleUpper(finalClWords);
    let base3x3Camel = toClStyleCamel(finalClWords);
    let baseGasName = buildGasStandardName(finalGasWords, input);

    const resultsList = [];

    if (isFunctionMode) {
      // --- 関数名モードのカテゴリ（指定の優先順序 4 ➔ 3 ➔ 2 ➔ 1）---
      // 1. GAS定番表現
      // 2. 英語組み合わせ関数名
      // 3. 3桁x3 キャメル記法
      // 4. 3桁x3 CL風 (大文字)
      const functionTypes = [
        { id: 'func_gas_standard', label: '1. GAS定番表現 (例: getActiveSheet)' },
        { id: 'func_standard', label: '2. 英語組み合わせ関数名 (例: getActiveSheet)' },
        { id: 'func_3x3_camel', label: '3. 3桁x3 キャメル記法 (例: rtvActSht)' },
        { id: 'func_3x3_upper', label: '4. 3桁x3 CL風 (大文字) (例: RTVACTSHT)' },
        { id: 'func_boolean', label: 'Boolean判定関数 (is... / has...)' },
        { id: 'func_handler', label: 'イベントハンドラ (on... / handle...)' },
        { id: 'func_private', label: '内部・ヘルパー関数 (_... / fetch...)' }
      ];

      functionTypes.forEach(t => {
        const suggestions = [];
        const addedNames = new Set();

        if (t.id === 'func_gas_standard') {
          if (baseGasName) {
            suggestions.push({ name: baseGasName });
            addedNames.add(baseGasName);
          }
          if (baseStdName && !addedNames.has(baseStdName)) {
            suggestions.push({ name: baseStdName });
            addedNames.add(baseStdName);
          }
        } else if (t.id === 'func_standard') {
          if (baseStdName && !addedNames.has(baseStdName)) {
            suggestions.push({ name: baseStdName });
            addedNames.add(baseStdName);
          }
          if (baseRecName && !addedNames.has(baseRecName)) {
            suggestions.push({ name: baseRecName });
            addedNames.add(baseRecName);
          }
        } else if (t.id === 'func_3x3_camel') {
          if (base3x3Camel && !addedNames.has(base3x3Camel)) {
            suggestions.push({ name: base3x3Camel });
            addedNames.add(base3x3Camel);
          }
        } else if (t.id === 'func_3x3_upper') {
          if (base3x3Upper && !addedNames.has(base3x3Upper)) {
            suggestions.push({ name: base3x3Upper });
            addedNames.add(base3x3Upper);
          }
        } else {
          let recName = applyFunctionTypeRules(baseRecName, t.id, input);
          let stdName = applyFunctionTypeRules(baseStdName, t.id, input);
          if (recName && !addedNames.has(recName)) {
            suggestions.push({ name: recName });
            addedNames.add(recName);
          }
          if (stdName && !addedNames.has(stdName)) {
            suggestions.push({ name: stdName });
            addedNames.add(stdName);
          }
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
 * 3桁コードから大文字のCLスタイル表現を作成します（例: RTVACTSHT）。
 */
function toClStyleUpper(words) {
  if (!words || words.length === 0) return '';
  return words.map(w => w.toUpperCase().replace(/[^A-Z0-9]/g, '')).join('');
}

/**
 * 3桁コードからキャメル記法を作成します（例: rtvActSht）。
 */
function toClStyleCamel(words) {
  if (!words || words.length === 0) return '';
  return words.map((w, index) => {
    const clean = w.replace(/[^a-zA-Z0-9]/g, '');
    if (!clean) return '';
    const lower = clean.toLowerCase();
    if (index === 0) {
      return lower;
    }
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join('');
}

/**
 * GASの標準的・定着した関数名を構築します。
 */
function buildGasStandardName(gasWords, inputJp) {
  if (!gasWords || gasWords.length === 0) return '';
  const rawJoined = gasWords.join(' ');
  return toCamelCase(rawJoined);
}

/**
 * 単語からIBM System i CL風の3桁略称コードを取得します。
 */
function getClShortFromWord(word) {
  if (!word) return 'UNK';
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');

  const map = {
    display: 'DSP', show: 'DSP', print: 'PRT', output: 'OUT', input: 'INP',
    disk: 'DSK', space: 'SPC', capacity: 'CAP', area: 'ARA',
    create: 'CRT', delete: 'DLT', change: 'CHG', update: 'CHG', retrieve: 'RTV', get: 'RTV',
    set: 'SET', send: 'SND', receive: 'RCV', remove: 'RMV', insert: 'INS', select: 'SLT',
    search: 'SRCH', find: 'SRCH', check: 'CHK', work: 'WRK', copy: 'CPY',
    grant: 'GRT', revoke: 'RVK', allow: 'ALW', assign: 'ASN',
    access: 'ACC', authority: 'AUT', permission: 'AUT',
    system: 'SYS', program: 'PGM', library: 'LIB', file: 'FIL', folder: 'FLD',
    user: 'USR', job: 'JOB', object: 'OBJ', message: 'MSG', record: 'REC',
    table: 'TBL', row: 'ROW', column: 'COL', value: 'VAL', list: 'LST',
    error: 'ERR', config: 'CFG', log: 'LOG', document: 'DOC', email: 'EML',
    active: 'ACT', sheet: 'SHT', spreadsheet: 'SPS', range: 'RNG'
  };

  if (map[clean]) return map[clean];
  if (clean.length <= 3) return clean.toUpperCase();
  return clean.slice(0, 3).toUpperCase();
}

/**
 * 単語が一般的な動詞であるか判定します。
 */
function checkIsVerbFromWord(word) {
  if (!word) return false;
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  const verbList = [
    'display', 'show', 'print', 'output', 'input', 'create', 'delete', 'update',
    'change', 'retrieve', 'get', 'set', 'send', 'receive', 'remove', 'insert',
    'select', 'search', 'find', 'run', 'check', 'copy', 'work', 'grant', 'revoke', 'allow', 'assign'
  ];
  return verbList.includes(clean);
}

/**
 * 日本語表現が動詞的動作・指示であるか判定します。
 */
function checkIsVerbJp(word) {
  if (!word) return false;
  return /(する|取得|設定|送信|作成|削除|更新|変更|実行|検索|表示|操作|作業|処理|付与|剥奪|許可|追加|移動|複写|コピー|チェック|出力|入力)$/.test(word.trim());
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
