/** タッチデバイスか判断 */
function isTouchDevice() {
    return ('ontouchstart' in document) && ('orientation' in window)
}
console.log(isTouchDevice());

/** 操作説明を取得 */
function getHowToControll() {
    if (isTouchDevice()) {
        return '<h1>How to Play</h1>Tap : Open a cell<br>Long tap : Toggle a flag'
    } else {
        return '<h1>How to Play</h1>Left click : Open a cell<br>Right click : Toggle a flag'
    }
}

/**
 * イベント付加
 */
function addEventListeners() {
    if (isTouchDevice()) {
        canvas.addEventListener('touchstart', onTouchStart, false);
        canvas.addEventListener('touchend', onTouchEnd, false);
        canvas.addEventListener('touchmove', onTouchMove, false);
    } else {
        canvas.addEventListener('mousedown', onClick, false);
    }
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false); // 旗に割り当て
    canvas.addEventListener('onselectstart', function (e) { e.preventDefault(); }, false); // 長押し時、選択になる事を防ぐ
}

/**
 * イベント削除
 */
function removeEventListeners() {
    if (isTouchDevice()) {
        canvas.removeEventListener('touchstart', onTouchStart, false);
        canvas.removeEventListener('touchend', onTouchEnd, false);
        canvas.removeEventListener('touchmove', onTouchMove, false);
    } else {
        canvas.removeEventListener('mousedown', onClick, false);
    }
    canvas.removeEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
}

/**
 * クリック,タッチしたマス座標を取得
 */
function getPosition(e) {
    let x_window;
    let y_window;
    if (isTouchDevice()) {
        x_window = e.touches[0].clientX;
        y_window = e.touches[0].clientY;
    } else {
        x_window = e.clientX;
        y_window = e.clientY;
    }
    let rect = e.target.getBoundingClientRect();
    let x_canvas = ~~(x_window - rect.left);
    let y_canvas = ~~(y_window - rect.top);
    let x_cells = ~~(x_canvas / BLOCK_W);
    let y_cells = ~~(y_canvas / BLOCK_H);
    return { x: x_cells, y: y_cells, x_window: x_window, y_window: y_window };
}

/**
 * マウスがクリックされると発火
 */
function onClick(e) {
    e.preventDefault();
    let p = getPosition(e);
    // 左クリック時、開示
    if (e.button === 0) {
        openCell(p.x, p.y);
    }
    // 右クリック時、旗
    if (e.button === 2) {
        toggleFlag(p.x, p.y);
    }
}

/** タッチ長押しで使用 */
let count = 0;
let timer;
let position;
const HOLDTIME = 15;

/**
 * タッチ開始時
 * 一定時間を超えたら旗をトグルするタイマーをセット
 */
function onTouchStart(e) {
    position = getPosition(e);
    count = 0;
    timer = setInterval(() => {
        count++;
        if (count >= HOLDTIME) {
            toggleFlag(position.x, position.y);
            clearInterval(timer);
            popUp(position.x_window, position.y_window);
        }
    }, 10);
}

/**
 * タッチ終了時
 * 長押しでない場合は開示
 */
function onTouchEnd(e) {
    clearInterval(timer);
    if (count < HOLDTIME) {
        openCell(position.x, position.y);
    }
    count = 0;
    hidePopUp();
}

/**
 * タッチが要素外に出た時
 */
function onTouchMove(e) {
    clearInterval(timer);
    count = HOLDTIME; // onTouchEndで開示しないよう設定
}

/** タッチ長押しで旗を立てた事を明示するポップアップを表示
 *  @x 表示中の画面に対する絶対座標x
 *  @y 表示中の画面に対する絶対座標y
*/
function popUp(x_window, y_window) {
    let el = document.querySelector('#popup');
    let elHeight = el.getBoundingClientRect().height;
    let elWidth = el.getBoundingClientRect().width;
    el.style.top = (y_window + window.pageYOffset - elHeight - 20) + 'px';
    el.style.left = (x_window + window.pageXOffset - (elWidth / 2)) + 'px';
    el.className = 'active';
}

/** ポップアップを隠す */
function hidePopUp() {
    let el = document.querySelector('#popup');
    el.className = 'hidden';
}