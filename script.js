var _a, _b;
// 1. Variablen & Speicher für das Spielfeld
var initialBoard = [];
for (var i = 0; i < 9; i++) {
    initialBoard.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
}
var currentBoard = [];
var selectedCell = null;
var boardContainer = document.getElementById('sudoku-board');
var numberPad = document.getElementById('number-pad');
// 2. Prüft, ob eine Zahl an der Stelle erlaubt ist.
function isValid(board, row, col, num) {
    for (var i = 0; i < 9; i++) {
        // prüfe horizontale Reihe
        if (board[row][i] === num)
            return false;
        // prüfe vertikale Reihe
        if (board[i][col] === num)
            return false;
        // Prüfe den 3x3 Kasten
        var boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        var boxCol = 3 * Math.floor(col / 3) + i % 3;
        if (board[boxRow][boxCol] === num)
            return false;
    }
    return true;
}
// 3. Board wird nach Regel zufällig wieder befüllt
function fillBoard(board) {
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                // Zufällige Zahl von 1-9
                var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(function () { return Math.random() - 0.5; });
                for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
                    var num = numbers_1[_i];
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) {
                            return true;
                        }
                        // Sackgasse. Zurücksetzen
                        board[row][col] = 0;
                    }
                }
                return false; // Keine Zahl passt
            }
        }
    }
    return true; // Board ist fehlerfrei befüllt
}
// 4. Löscht zufällig Zahlen zum Rätseln
function createPuzzle() {
    var fullBoard = [];
    for (var i = 0; i < 9; i++) {
        fullBoard.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    fillBoard(fullBoard);
    initialBoard = JSON.parse(JSON.stringify(fullBoard));
    var kartenGeloescht = 45;
    while (kartenGeloescht > 0) {
        var row = Math.floor(Math.random() * 9);
        var col = Math.floor(Math.random() * 9);
        if (initialBoard[row][col] !== 0) {
            initialBoard[row][col] = 0;
            kartenGeloescht--;
        }
    }
    currentBoard = JSON.parse(JSON.stringify(initialBoard));
}
// 5. Spielfeld auf der Webseite zeichnen
function drawBoard() {
    if (!boardContainer)
        return;
    boardContainer.innerHTML = '';
    //Tastatur verbinden
    document.addEventListener('keydown', function (event) {
        // prüfen, ob spieler schon auf Kästchen geklickt hat
        if (!selectedCell)
            return;
        // Tastatur auslesen, die gedrückt wurde
        var key = event.key;
        //ist die gedrückt Taste eine Zahl zwischen 1-9
        if (key >= '1' && key <= '9') {
            var num = parseInt(key);
            var row = selectedCell.row, col = selectedCell.col;
            //Zahl in speicher-Array eintragen
            currentBoard[row][col] = num;
            //spielfeld neu zeichnen, damit man die Zahl sieht
            drawBoard();
            var index = row * 9 + col;
            if (boardContainer.children[index]) {
                boardContainer.children[index].classList.add('selected');
            }
        }
        //Backspace/Entfernen Taste Zahlen wieder löschen
        else if (key === 'Backspace' || key === 'Delete') {
            var row = selectedCell.row, col = selectedCell.col;
            currentBoard[row][col] = 0;
            drawBoard();
            var index = row * 9 + col;
            if (boardContainer.children[index]) {
                boardContainer.children[index].classList.add('selected');
            }
        }
    });
    var cell = document.createElement('div');
    cell.classList.add('sudoku-cell');
    cell.tabIndex = 0;
    var _loop_1 = function (r) {
        var _loop_2 = function (c) {
            var cell_1 = document.createElement('div');
            cell_1.classList.add('sudoku-cell');
            if (r === 2 || r === 5) {
                cell_1.style.borderBottom = "3px solid #a3b19b"; // Dickere Linie für 3x3 Boxen
            }
            var val = currentBoard[r][c];
            if (val !== 0) {
                cell_1.innerText = val.toString();
                if (initialBoard[r][c] !== 0) {
                    cell_1.classList.add('fixed'); // Unveränderbare Startzahlen
                }
            }
            // Klick-Event für Zelle
            cell_1.addEventListener('click', function () {
                if (initialBoard[r][c] !== 0)
                    return; // Fixe Zellen ignorieren
                document.querySelectorAll('.sudoku-cell').forEach(function (el) { return el.classList.remove('selected'); });
                selectedCell = { row: r, col: c };
                cell_1.classList.add('selected');
            });
            boardContainer.appendChild(cell_1);
        };
        for (var c = 0; c < 9; c++) {
            _loop_2(c);
        }
    };
    for (var r = 0; r < 9; r++) {
        _loop_1(r);
    }
}
// 6. Zahlen-Tastatur unten zeichnen
function drawNumberPad() {
    if (!numberPad)
        return;
    numberPad.innerHTML = '';
    var _loop_3 = function (i) {
        var col = document.createElement('div');
        col.classList.add('col-4', 'd-grid');
        var btn = document.createElement('button');
        btn.classList.add('btn', 'rounded-3', 'fw-bold');
        btn.innerText = i.toString();
        btn.addEventListener('click', function () {
            if (selectedCell) {
                var row = selectedCell.row, c = selectedCell.col;
                currentBoard[row][c] = i;
                drawBoard();
                var index = row * 9 + c;
                if (boardContainer.children[index]) {
                    boardContainer.children[index].classList.add('selected');
                }
            }
        });
        col.appendChild(btn);
        numberPad.appendChild(col);
    };
    for (var i = 1; i <= 9; i++) {
        _loop_3(i);
    }
}
// 7. Event-Listener für den Reset-Button
(_a = document.getElementById('btn-reset')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    createPuzzle(); // generiert neues Spielfeld
    selectedCell = null;
    drawBoard();
});
// Event-Listener für Überprüfen
(_b = document.getElementById('btn-check')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    alert("Go girl!");
});
// 8. Start-Aufrufe beim Laden der Seite
createPuzzle();
drawBoard();
drawNumberPad();
