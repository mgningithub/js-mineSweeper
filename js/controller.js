canvas.addEventListener('mousedown', onClick, false);
canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false); // 旗機能割り振りのため右クリックメニュー非表示

/**
 * マウス動いている時、座標表示
 */
function onMove(e) {
    let rect = e.target.getBoundingClientRect();
    let CANVAS_X = ~~(e.clientX - rect.left);
    let CANVAS_Y = ~~(e.clientY - rect.top);
    let COL_X = ~~(CANVAS_X / BLOCK_W);
    let ROW_Y = ~~(CANVAS_Y / BLOCK_H);
    displayMessage(`X:${CANVAS_X} Y:${CANVAS_Y} / COLX:${COL_X} ROWY:${ROW_Y}`)
}

/**
 * マウスがクリックされると発火
 */
function onClick(e) {
    // 左クリック時、開示
    if (e.button === 0) {
        let rect = e.target.getBoundingClientRect();
        let CANVAS_X = ~~(e.clientX - rect.left);
        let CANVAS_Y = ~~(e.clientY - rect.top);
        let COL_X = ~~(CANVAS_X / BLOCK_W);
        let ROW_Y = ~~(CANVAS_Y / BLOCK_H);
        openCell(COL_X, ROW_Y);
    }
    // 右クリック時、旗
    if (e.button === 2) {
        let rect = e.target.getBoundingClientRect();
        let CANVAS_X = ~~(e.clientX - rect.left);
        let CANVAS_Y = ~~(e.clientY - rect.top);
        let COL_X = ~~(CANVAS_X / BLOCK_W);
        let ROW_Y = ~~(CANVAS_Y / BLOCK_H);
        toggleFlag(COL_X, ROW_Y);
    }
}