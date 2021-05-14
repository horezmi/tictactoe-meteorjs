import './index.html'
import './index.css'

Template.GameBoard.onCreated(function () {
    this.boardVar = new ReactiveVar([
        new Array(3).fill(' '),
        new Array(3).fill(' '),
        new Array(3).fill(' '),
    ]),
    this.isXVar = new ReactiveVar(true),
    this.isPlayingVar = new ReactiveVar(true),
    this.combo = [
        [[0,0], [0,1], [0,2]],
        [[1,0], [1,1], [0,2]],
        [[2,0], [2,1], [2,2]],
        
        [[0,0], [1,0], [2,0]],
        [[0,1], [1,1], [1,2]],
        [[0,2], [1,2], [2,2]],

        [[0,0], [1,1], [2,2]],
        [[2,0], [1,1], [0,2]],
    ];
});

function handleCalcWin(boards, combo) {
    for (let i = 0; i < combo.length; i++) {
        const [a, b, c] = combo[i]
        if (boards[a[0]][a[1]] && boards[a[0]][a[1]] ===  boards[b[0]][b[1]] && boards[a[0]][a[1]] === boards[c[0]][c[1]]) {
            return boards[a[0]][a[1]];
        }
    }
    return null;
};


Template.GameBoard.helpers({
    boards() {
        return Template.instance().boardVar.get();
    },
    whoIsPlaying() {
        if (Template.instance().isPlayingVar.get()) {
            if (Template.instance().isXVar.get())
                return 'Крестики'
            else 
                return 'Нолики'
        }
        else return 'Игра окончена'
    },
    whoWon() {
        const calcWin = handleCalcWin;
        const res = calcWin(Template.instance().boardVar.get(), Template.instance().combo);
        if (res === 'X') {
          Template.instance().isPlayingVar.set(false)
          return 'Крестики'
        }
        if (res === 'O') {
          Template.instance().isPlayingVar.set(false)
          return 'Нолики'
        }
    }
});

Template.GameBoard.events({
    'click .cell'(event, template) {
        const y = Number.parseInt(event.currentTarget.getAttribute('data-row-index'));
        const x = Number.parseInt(event.currentTarget.getAttribute('data-cell'));
        const board = template.boardVar.get();
        if (template.isPlayingVar.get()) {
            if (template.isXVar.get()) 
                board[y][x] = 'X';
            else 
                board[y][x] = 'O';

            template.boardVar.set(board);
            template.isXVar.set(!template.isXVar.get())
        }
    }
});
