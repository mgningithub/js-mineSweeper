/*
 現在の盤面の状態を描画する処理
*/

const COLS = 10, ROWS = 20; // 横10、縦20マス
const canvas = document.getElementById('canvas-board');
const ctx = canvas.getContext('2d');
const W = 300, H = 600; // キャンバスサイズ
const BLOCK_W = W / COLS, BLOCK_H = H / ROWS; // マス幅

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
                case 2: ctx.fillStyle = 'yellow'; val = '🏴'; break; // 旗
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
                drawBlock(x, y, '💣');
            }
        }
    }
}

/**
 * メッセージ表示
 * @param msg メッセージ
 */
function displayMessage(msg) {
    document.getElementById('greetingOutput').innerHTML = msg;
}