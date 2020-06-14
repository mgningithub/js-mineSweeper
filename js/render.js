/*
 現在の盤面の状態を描画する処理
*/
const canvas = document.getElementById('canvas-board');
const ctx = canvas.getContext('2d');

let COLS, ROWS // 横、縦マス
let BLOCK_W, BLOCK_H; // マス幅
let W, H; // キャンバスサイズ
let previousLevel; // 次回ゲーム用にレベルを記憶

/**
 * キャンバスサイズとマス数を定義
 */
function initCanvas() {
    let el = document.getElementById("level");
    let size = JSON.parse(el.value);
    // 次回ゲーム用にレベルを記憶
    previousLevel = el.value;
    // 横、縦マス
    COLS = size.x;
    ROWS = size.y;
    // マス幅
    BLOCK_W = 30;
    BLOCK_H = 30;
    // キャンバスサイズ
    W = COLS * BLOCK_W;
    H = ROWS * BLOCK_H;
    canvas.width = W;
    canvas.height = H;
}

/**
 * 盤面とマスを描画する
 */
function render() {
    ctx.clearRect(0, 0, W, H); // キャンバス初期化
    ctx.strokeStyle = 'Black';

    // マスを描画する
    for (let x = 0; x < COLS; ++x) {
        for (let y = 0; y < ROWS; ++y) {
            ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
        }
    }

    // 盤面を描画する
    for (let x = 0; x < COLS; ++x) {
        for (let y = 0; y < ROWS; ++y) {
            let val = ''
            switch (board[y][x].disp) {
                case 0: ctx.fillStyle = 'gray'; val = ''; break; // 未開示
                case 2: ctx.fillStyle = 'yellow'; val = '🚩'; break; // 旗
                default: // 開示済み
                    if (board[y][x].obj == bomb) {
                        ctx.fillStyle = colors[board[y][x].obj]; val = '💣'; break; // 爆弾
                    } else {
                        ctx.fillStyle = colors[board[y][x].obj]; val = ' ' + board[y][x].obj; break; // 周囲の爆弾の数
                    }
            }
            drawBlock(x, y, val); // マスを描画
        }
    }
}

/**
 * x, yの部分のマスを描画
 * @param x x座標
 * @param y y座標
 * @param val マス内の値
 */
function drawBlock(x, y, val) {
    ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeText(val, (BLOCK_W * x) + 8, (BLOCK_H * y) + 18);
    //ctx.strokeRect(board[y][x].obj, (BLOCK_W * x) + 8, (BLOCK_H * y) + 18); // デバッグ用、値表示
}

/**
 * 回答を描画
 */
function renderAnswer() {
    for (let x = 0; x < COLS; ++x) {
        for (let y = 0; y < ROWS; ++y) {
            if (board[y][x].obj == bomb && board[y][x].disp !== 1) {
                ctx.fillStyle = 'gray'; // 未開示の色
                drawBlock(x, y, '💣');
            }
        }
    }
}

/** 準備画面 */
function showMessageForPrepare() {
    let msg = '<h2>💣 Mine Sweeper 🚩</h2>'
    msg += '<select id="level" name="level" size="1" onChange="initCanvas()">';
    msg += `<option value='{ "x":10,  "y":10 }'>Easy (5 x 10)</option>`;
    msg += `<option value='{ "x":10,  "y":20 }' selected>Normal (10 x 20)</option>`;
    msg += `<option value='{ "x":12,  "y":50 }'>Hard (12 x 50)</option>`;
    msg += `<option value='{ "x":130, "y":130 }'>Very hard (130 x 130)</option>`; //mobile Safari の canvas 面積の制限は (288MB / 16,777,216px(4096px * 4096px 相当)) 
    msg += '</select>';
    msg += '  <button onclick="newGame()" class="btn-gradation">Game start</button>';
    document.getElementById('div-message').innerHTML = msg;
    document.getElementById('div-time').innerHTML = '';
    if (previousLevel) { document.getElementById('level').value = previousLevel; }
}

/** ゲーム中画面 */
function showMessageWhileGaming() {
    let msg = '<button onclick="prepareGame()" class="btn-gradation">Reset</button>';
    msg += (isTouchDevice()) ?
        '<p>(👆) Tap : Open a cell</p><p>((👆)) Long tap : Put up a flag</p>' :
        '<p>👈Left click : Open a cell</p><p>👉Right click : Put up a flag</p>';
    document.getElementById('div-message').innerHTML = msg;
    document.getElementById('div-time').innerHTML = `⏱ ${clearSecs} secs`;
}

/** 負け画面 */
function showMessageForLose() {
    let msg = '<h2>😫You lose !😢</h2>'
    msg += '<button onclick="prepareGame()" class="btn-gradation">Try again</button>';
    document.getElementById('div-message').innerHTML = msg;
}

/** 勝ち画面 */
function showMessageForWin() {
    let msg = '<h2>😎You win !👍</h2>'
    msg += '<button onclick="prepareGame()" class="btn-gradation">New game</button>';
    document.getElementById('div-message').innerHTML = msg;
}
