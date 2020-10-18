import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';
import styled from 'styled-components';
import { Chess } from 'chess.js';
// const { Chess } = require('chessjs')

const StyledBoard = styled.div`
    width: 400px;
    height: 400px;
    margin: 20px;
    display: grid;
    grid-template: repeat(8, 1fr) / repeat(8, 1fr);
    grid-gap: 1px;
`;

const colors = {
    BLACK: 'b',
    WHITE: 'w',
    NONE: "none"
};

export const Board = () => {
    const [board, setBoard] = useState([]);
    const [chosenTile, setChosenTile] = useState({ column: -1, row: -1 });
    const [color, setColor] = useState(colors.NONE);
    const [myTurn, setMyTurn] = useState(true);
    const [possibleMoves, setPossibleMoves] = useState([]);

    useEffect(() => {
        //TODO: Can I just send the entire chess object?
        socket
            .on('start', (board, color) => {
                console.log('what color am I:', color);
                switch (color) {
                    case colors.BLACK:
                        setColor(colors.BLACK);
                        setBoard([...board].reverse());
                        setMyTurn(false);
                        break;
                    case colors.WHITE:
                        setColor(colors.WHITE);
                        setBoard(board);
                        setMyTurn(true);
                        break;
                    default:
                        alert('Biip biip. Error. No comprende.');
                }
            })
            .on('successMove', (newBoard) => {
                console.log(newBoard)
                setBoard(color === colors.WHITE ? newBoard : [...newBoard].reverse());
                setMyTurn(false);
                setPossibleMoves([]);
            })
            .on('opponentMove', (newBoard) => {
                console.log('that was a move');
                console.log(newBoard)
                console.log("reversed", [...newBoard].reverse())
                console.log("COLOR:", color); 
                console.log("AM I WHITE: ", color === colors.WHITE)
                const reversedBoard = [...newBoard].reverse()
                setBoard(color === colors.WHITE ? newBoard : reversedBoard);
                setMyTurn(true);
            })
            .on('possibleMoves', (possibleMoves) => {
                setPossibleMoves(possibleMoves.map((move) => move.to));
            })
            .on('invalidMove', () => {
                alert('Server says: invalid move');
                setMyTurn(true);
            });
    }, []);

    const getColumnLetter = (column) => {
        //TODO: Switcheroo if black?
        if (color === colors.WHITE) {
            switch (column) {
                case 0:
                    return 'a';
                case 1:
                    return 'b';
                case 2:
                    return 'c';
                case 3:
                    return 'd';
                case 4:
                    return 'e';
                case 5:
                    return 'f';
                case 6:
                    return 'g';
                case 7:
                    return 'h';
            }
        } else {
            switch (column) {
                case 0:
                    return 'h';
                case 1:
                    return 'g';
                case 2:
                    return 'f';
                case 3:
                    return 'e';
                case 4:
                    return 'd';
                case 5:
                    return 'c';
                case 6:
                    return 'b';
                case 7:
                    return 'a';
            }
        }
    };

    const getRowFromIndex = (index) => {
        //If I'm black, it should already be correct if rendered right.
        if (color === colors.BLACK) {
            return index;
        }

        return 7 - index;
    };

    const getSquare = (column, row) => {
        return getColumnLetter(column) + (row + 1);
    };

    const choosePiece = (rowIndex, columnIndex) => {
        if (!myTurn) {
            console.log('not your turn');
            return false;
        }

        if(color === colors.BLACK) {
            console.log(rowIndex, columnIndex)
            console.log(board[rowIndex][columnIndex]);
        } 
        console.log(rowIndex, columnIndex)
        const piece = board[rowIndex][columnIndex];
        if (piece === null) {
            return false;
        }

        if (piece.color !== color) {
            //TODO: not my piece, do a notification
            console.log('not your piece');
            return false;
        }

        setChosenTile({ column: columnIndex, row: rowIndex });

        const square = getSquare(columnIndex, getRowFromIndex(rowIndex));
        socket.emit('choose', square);

        return true;
    };

    const doClick = (rowIndex, columnIndex) => {
        //HVis den piecen inneholder min egen, og jeg ikke har valgt en piece, velg piece

        if (!myTurn) {
            //TODO: do a small notification here.
            console.log('not your turn');
            return false;
        }
        let didChoosePiece = choosePiece(rowIndex, columnIndex);
        console.log('choosing piece again');
        if (didChoosePiece) {
            return;
        }

        //Reset chosen tile on every new turn
        if (chosenTile.column === -1) {
            return;
        }

        //Now i should have a chosen piece.
        //DO MOVE
        let tileInNotation = getTileInNotation(columnIndex, rowIndex);
        console.log();
        if (!possibleMoves.includes(tileInNotation)) {
            console.log('Not a valid move.');
            return;
        }

        console.log(chosenTile);
        console.log(columnIndex, rowIndex);
        console.log("from: ", getTileInNotation(chosenTile.column, chosenTile.row))
        console.log("to: ", tileInNotation)
        socket.emit('move', {
            from: getTileInNotation(chosenTile.column, chosenTile.row),
            to: tileInNotation,
        });
    };

    const getTileInNotation = (column, row) => {
        return getColumnLetter(column) + getRowFromIndex(row - 1);
    };

    const shouldBeColorX = (row, column) => {
        return (
            (row % 2 === 0 && column % 2 === 0) ||
            (row % 2 !== 0 && column % 2 !== 0)
        );
    };

    const getTileColor = (row, column) => {
        let tileInNotation = getTileInNotation(column, row);
        if (possibleMoves.includes(tileInNotation)) {
            return 'red';
        }
        return shouldBeColorX(row, column) ? 'grey' : 'silver';
    };
    console.log("My color is: ", color)
    return (
        <StyledBoard className="boardContainer">
            {board.map((row, rowIndex) => {
                return row.map((tile, columnIndex) => {
                    return (
                        <div
                            key={rowIndex + '-' + columnIndex}
                            style={{
                                backgroundColor: getTileColor(
                                    rowIndex,
                                    columnIndex
                                ),
                                color: tile?.color === 'b' ? 'black' : 'white',
                            }}
                            onClick={() => doClick(rowIndex, columnIndex)}
                        >
                            {tile?.type || ''}
                        </div>
                    );
                });
            })}
        </StyledBoard>
    );
};
