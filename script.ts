// 1. Variablen & Speicher für das Spielfeld
let initialBoard: number[][] = [];
for (let i = 0; i < 9; i++) {
    initialBoard.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
}
let currentBoard: number[][] = [];
let selectedCell: {row: number, col: number} | null = null;

const boardContainer = document.getElementById('sudoku-board') as HTMLDivElement;
const numberPad = document.getElementById('number-pad') as HTMLDivElement;

// 2. Prüft, ob eine Zahl an der Stelle erlaubt ist.
function isValid(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        // prüfe horizontale Reihe
        if (board[row][i] === num) return false;
        // prüfe vertikale Reihe
        if (board[i][col] === num) return false;

        // Prüfe den 3x3 Kasten
        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + i % 3 ;
        if (board[boxRow][boxCol] === num) return false;
    }
    return true;
}

// 3. Board wird nach Regel zufällig wieder befüllt
function fillBoard(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                // Zufällige Zahl von 1-9
                const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

                for (let num of numbers) {
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
function createPuzzle(): void {

    let fullBoard: number[][] = [];
    for (let i = 0; i < 9; i++) {
        fullBoard.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    fillBoard(fullBoard);

    initialBoard = JSON.parse(JSON.stringify(fullBoard));

    let kartenGeloescht = 45;
    while (kartenGeloescht > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (initialBoard[row][col] !== 0) {
            initialBoard[row][col] = 0;
            kartenGeloescht--;
        }
    }

    currentBoard = JSON.parse(JSON.stringify(initialBoard));
}

// 5. Spielfeld auf der Webseite zeichnen
function drawBoard(): void {
    if (!boardContainer) return;
    boardContainer.innerHTML = '';

    //Tastatur verbinden

    document.addEventListener('keydown', (event) => {
        // prüfen, ob spieler schon auf Kästchen geklickt hat
        if (!selectedCell) return;
        // Tastatur auslesen, die gedrückt wurde
        const key = event.key;
        //ist die gedrückt Taste eine Zahl zwischen 1-9
        if (key >= '1' && key <= '9'){
        const num = parseInt(key);
        const { row, col } = selectedCell;

        //Zahl in speicher-Array eintragen
        currentBoard[row][col] = num;
        //spielfeld neu zeichnen, damit man die Zahl sieht
        drawBoard();

        const index = row * 9 + col;
        if (boardContainer.children[index]) {
            boardContainer.children[index].classList.add('selected');
        }
        }
     //Backspace/Entfernen Taste Zahlen wieder löschen
     else if (key === 'Backspace' || key === 'Delete') {
       const { row, col } = selectedCell;
       currentBoard[row][col] = 0;
       drawBoard();

       const index = row * 9 + col;
       if (boardContainer.children[index]) {
        boardContainer.children[index].classList.add('selected');
       }
     }
    });

    const cell= document.createElement('div');
    cell.classList.add('sudoku-cell');
    cell.tabIndex = 0;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.classList.add('sudoku-cell');

            if (r === 2 || r === 5) {
                cell.style.borderBottom = "3px solid #a3b19b"; // Dickere Linie für 3x3 Boxen
            }

            const val = currentBoard[r][c];
            if (val !== 0) {
                cell.innerText = val.toString();
                if (initialBoard[r][c] !== 0) {
                    cell.classList.add('fixed'); // Unveränderbare Startzahlen
                }
            }

            // Klick-Event für Zelle
            cell.addEventListener('click', () => {
                if (initialBoard[r][c] !== 0) return; // Fixe Zellen ignorieren

                document.querySelectorAll('.sudoku-cell').forEach(el => el.classList.remove('selected'));
                selectedCell = { row: r, col: c };
                cell.classList.add('selected');


            });


            boardContainer.appendChild(cell);
        }
    }
}

// 6. Zahlen-Tastatur unten zeichnen
function drawNumberPad(): void {
    if (!numberPad) return;
    numberPad.innerHTML = '';

    for (let i = 1; i <= 9; i++) {
        const col = document.createElement('div');
        col.classList.add('col-4', 'd-grid');

        const btn = document.createElement('button');
        btn.classList.add('btn', 'rounded-3', 'fw-bold');
        btn.innerText = i.toString();

        btn.addEventListener('click', () => {
            if (selectedCell) {
                const { row, col: c } = selectedCell;
                currentBoard[row][c] = i;
                drawBoard();

                const index = row * 9 + c;
                if (boardContainer.children[index]) {
                    boardContainer.children[index].classList.add('selected');
                }
            }
        });

        col.appendChild(btn);
        numberPad.appendChild(col);
    }
}

// 7. Event-Listener für den Reset-Button
document.getElementById('btn-reset')?.addEventListener('click', () => {
    createPuzzle(); // generiert neues Spielfeld
    selectedCell = null;
    drawBoard();
});

// Event-Listener für Überprüfen
document.getElementById('btn-check')?.addEventListener('click', () => {
    alert("Go girl!");
});

// 8. Start-Aufrufe beim Laden der Seite
createPuzzle();
drawBoard();
drawNumberPad();