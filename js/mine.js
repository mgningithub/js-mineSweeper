/** 盤面情報 */
var board = [];
/** 爆弾のobj値 */
var bomb = 9

// obj値について。0～8が周囲の爆弾の数。9が爆弾。数値は下記のマス色に対応。

/** マス色 */
var colors = ['white', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'red'];

/**
 * ランダムな値を生成
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 盤面を初期化
 */
function init() {
    // 爆弾を設置
    for (let y = 0; y < ROWS; ++y) {
        board[y] = [];
        for (let x = 0; x < COLS; ++x) {
            if (getRandomIntInclusive(0, 10) == 1) {
                board[y][x] = { "obj": bomb, "disp": 0, "scanned": 0 }
            } else {
                board[y][x] = { "obj": 0, "disp": 0, "scanned": 0 }
            }
        }
    }
    // 数字を設置
    for (let y = 0; y < ROWS; ++y) {
        for (let x = 0; x < COLS; ++x) {
            if (board[y][x].obj !== bomb) {
                let counter = 0;
                for (let iy = y - 1; iy <= y + 1; iy++) {
                    for (let ix = x - 1; ix <= x + 1; ix++) {
                        if (!(typeof board[iy] == 'undefined') &&
                            !(typeof board[iy][ix] == 'undefined') &&
                            board[iy][ix].obj == bomb) {
                            counter++;
                        }
                    }
                }
                board[y][x].obj = counter;
            }
        }
    }
}

/**
 * マス開示
 * @param x x座標
 * @param y y座標
 */
function openCell(x, y) {
    // 未開示マス
    if (board[y][x].disp == 0) {
        // 爆弾クリック時
        if (board[y][x].obj == bomb) {
            board[y][x].disp = 1;
            render();
            lose();
            return false;
        } else {
            fill(x, y);
            render();
        }
    }
    // 旗
    if (board[y][x].disp == 2) {
        board[y][x].disp = 0;
    }
    render();
    checkWin();
}

/**
 * 旗のオンオフ
 * @param x x座標
 * @param y y座標
 */
function toggleFlag(x, y) {
    if (board[y][x].disp == 0) {
        board[y][x].disp = 2;
    } else if (board[y][x].disp == 2) {
        board[y][x].disp = 0;
    }
    render();
    checkWin();
}

/**
 * 連続する0範囲を開示
 * @param x 起点のx座標
 * @param y 起点のy座標
 */
function fill(x, y) {
    // 走査済みにする。しないと下から上に走査が戻ってしまう。
    board[y][x].scanned = 1;

    // 0の場合、周囲を開示
    if (board[y][x].obj == 0) {
        // 周囲を開示
        for (let iy = y - 1; iy <= y + 1; iy++) {
            for (let ix = x - 1; ix <= x + 1; ix++) {
                if (!(typeof board[iy] == 'undefined') &&
                    !(typeof board[iy][ix] == 'undefined') &&
                    board[iy][ix].obj !== bomb) {
                    board[iy][ix].disp = 1;
                }
            }
        }
        // 0に隣接する0マスを再帰で開示
        let scan = function (tmpx, tmpy) {
            if (!(typeof board[tmpy] == 'undefined') &&
                !(typeof board[tmpy][tmpx] == 'undefined') &&
                (board[tmpy][tmpx].scanned == 0)) {
                fill(tmpx, tmpy);
            }
        }
        for (let iy = y - 1; iy <= y + 1; iy++) {
            for (let ix = x - 1; ix <= x + 1; ix++) {
                scan(ix, iy);
            }
        }
    } else {
        board[y][x].disp = 1;
        // 再帰時でも0の周りを走査しているので爆弾が出る事はない。開示のみでOK。
    }
}

/** 負け */
function lose() {
    canvas.removeEventListener('mousedown', onClick, false);
    canvas.removeEventListener('mousemove', onMove, false);
    canvas.removeEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
    displayMessage('You lose !<br>Push F5 to restart.')
    renderAnswer();
}

/** クリア判定 */
function checkWin() {
    let win = true;
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if ((board[y][x].obj == bomb && board[y][x].disp !== 2) ||
                (board[y][x].obj !== bomb && board[y][x].disp !== 1)) {
                win = false;
            }
        }
    }

    if (win) {
        canvas.removeEventListener('mousedown', onClick, false);
        canvas.removeEventListener('mousemove', onMove, false);
        canvas.removeEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
        displayMessage('You win !')
        snowfall();
    }
}

/** ゲーム開始 */
function newGame() {
    init();
    render();
}

newGame();