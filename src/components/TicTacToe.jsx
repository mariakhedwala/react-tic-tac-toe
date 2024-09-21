import React from 'react'
import Board from './Board'
import { useState, useEffect } from 'react'
import GameOver from './GameOver'
import GameState from './GameState.js'
import ResetGame from './ResetGame'
import gameOverSoundAsset from '../sounds/game_over.wav'
import clickSoundAsset from '../sounds/click.wav'

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5

const playerX = "X"
const playerO = "O"
const winningCombinations = [
    //rows
    {combo: [0,1,2], strikeClass: "strike-row-1"},
    {combo: [3,4,5], strikeClass: "strike-row-2"},
    {combo: [6,7,8], strikeClass: "strike-row-3"},

    //columns
    {combo: [0,3,6], strikeClass: "strike-column-1"},
    {combo: [1,4,7], strikeClass: "strike-column-2"},
    {combo: [2,5,8], strikeClass: "strike-column-3"},

    //diagonal
    {combo: [0,4,8], strikeClass: "strike-diagonal-1"},
    {combo: [2,4,6], strikeClass: "strike-diagonal-2"},
]

const checkWinner = (tiles,setStrikeClass,setGameState) => {
    for(const {combo, strikeClass} of winningCombinations) {
        const tileValue1 = tiles[combo[0]];
        const tileValue2 = tiles[combo[1]];
        const tileValue3 = tiles[combo[2]];

        if(tileValue1 && tileValue2 && tileValue3 && tileValue1===tileValue2 && tileValue1===tileValue3) {
            setStrikeClass(strikeClass);
            if(tileValue1===playerX) setGameState(GameState.playerXWins);
            else setGameState(GameState.playerOWins);
            return;
        }

        const allTilesFilled = tiles.every(tile => tile!=null);
        if(allTilesFilled) setGameState(GameState.draw);
    }
}

const TicTacToe = () => {
    const [tiles, setTiles] = useState(Array(9).fill(null))
    const [playerTurn, setPlayerTurn] = useState(playerX);
    const [strikeClass, setStrikeClass] = useState();
    const [gameState, setGameState] = useState(GameState.inProgress)

    const handleTileClick = (index) => {
        if(gameState !== GameState.inProgress) return;

        if(tiles[index] !== null) return;
 
        const newTile = [...tiles];
        newTile[index] = playerTurn;
        setTiles(newTile);

        if(playerTurn === playerX) setPlayerTurn(playerO)
        else setPlayerTurn(playerX)
    }

    const handleReset = () => {
        setGameState(GameState.inProgress);
        setTiles(Array(9).fill(null))
        setPlayerTurn(playerX)
        setStrikeClass(null)
    }

    useEffect(()=>{
        checkWinner(tiles,setStrikeClass,setGameState);
    },[tiles])

    useEffect(()=>{
        if(tiles.some((tile)=>tile!==null)) clickSound.play()
    },[tiles])

    useEffect(()=>{
        if(gameState !== GameState.inProgress) gameOverSound.play()
    },[gameState])


  return (
    <div>
        <h1>Tic Tac Toe</h1>
        <Board strikeClass={strikeClass} playerTurn={playerTurn} tiles={tiles} onTileClick={handleTileClick} />
        <GameOver gameState={gameState} />
        <ResetGame gameState={gameState} onReset={handleReset} />
    </div>
  )
}

export default TicTacToe