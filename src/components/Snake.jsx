import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "react-bootstrap";
import HighScores from "./HighScores";

const Snake = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ]);
  const [direction, setDirection] = useState("right");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const snakeRef = useRef(null);

  //Funzione per gestire il click sul pulsante "Inizia partita"
  function handleStartClick() {
    setGameStarted(true);
  }

  //Funzione per controllare se la testa del serpente ha toccato il proprio corpo o i bordi del campo
  const checkCollision = useCallback(() => {
    const head = snake[snake.length - 1];
    for (let i = 0; i < snake.length - 1; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        return true;
      }
    }
    if (head[0] < 0 || head[0] > 9 || head[1] < 0 || head[1] > 9) {
      return true;
    }
    return false;
  }, [snake]);

  //Funzione per gestire il movimento del serpente
  const moveSnake = useCallback(() => {
    const head = snake[snake.length - 1];
    let newHead;
    switch (direction) {
      case "right":
        newHead = [head[0], head[1] + 1];
        break;
      case "down":
        newHead = [head[0] + 1, head[1]];
        break;
      case "left":
        newHead = [head[0], head[1] - 1];
        break;
      case "up":
        newHead = [head[0] - 1, head[1]];
        break;
      default:
        return;
    }
    const newSnake = [...snake, newHead];
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood([Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]);
      setScore(score + 1); // Incrementa il punteggio quando il serpente mangia il cibo
    } else {
      newSnake.shift();
    }
    setSnake(newSnake);
  }, [direction, food, score, snake]);

  //Funzione per salvare il punteggio
  const saveScore = useCallback(() => {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScores.push({ score, time });
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem("highScores", JSON.stringify(highScores.slice(0, 10)));
  }, [score, time]);

  //Effetto per gestire il movimento del serpente
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        moveSnake();
        if (checkCollision()) {
          setGameOver(true);
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [snake, direction, checkCollision, moveSnake, gameStarted, gameOver]);

  //Effetto per gestire il focus del gioco , per non dover perforza far cliccare all'utente il div del gioco
  //per ricevere i comandi di movimento
  useEffect(() => {
    if (snakeRef.current) snakeRef.current.focus();
  }, []);

  //Effetto per gestire l'aggiornamento del tempo ogni secondo
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver]);

  //Funzione per gestire la pressione dei tasti per cambiare direzione
  function handleKeyDown(event) {
    switch (event.keyCode) {
      case 37:
        if (direction !== "right") setDirection("left");
        break;
      case 38:
        if (direction !== "down") setDirection("up");
        break;
      case 39:
        if (direction !== "left") setDirection("right");
        break;
      case 40:
        if (direction !== "up") setDirection("down");
        break;
      default:
        return;
    }
  }

  //Funzione per riavviare il gioco
  function handleRestart() {
    setSnake([[0, 0]]);
    setFood([Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]);
    setDirection("right");
    setGameOver(false);
    setScore(0);
    setTime(0);
  }

  //Effetto per salvare lo score a fine game
  useEffect(() => {
    if (gameOver) {
      saveScore();
    }
  }, [gameOver, saveScore]);

  return (
    <>
      {!gameStarted ? (
        <>
          <Button onClick={handleStartClick}>Inizia partita</Button>
          <HighScores />
        </>
      ) : (
        <div
          className="Snake"
          tabIndex="0"
          onKeyDown={handleKeyDown}
          ref={snakeRef}
        >
          {/* Visualizza il punteggio e il tempo */}
          <div className="Score">
            Score: {score} Time: {time}
          </div>{" "}
          {/* Aggiungi pulsante per riavviare il gioco */}
          {gameOver ? (
            <>
              <div className="GameOver">Game Over</div>
              <Button onClick={handleRestart}>Restart</Button> <HighScores />
            </>
          ) : (
            <div className="Board">
              {Array.from({ length: 10 }).map((_, row) => (
                <div key={row} className="Row">
                  {Array.from({ length: 10 }).map((_, col) => (
                    <div
                      key={`${row}-${col}`}
                      className={`Cell ${
                        food[0] === row && food[1] === col ? "Food" : ""
                      } ${
                        snake.some((cell) => cell[0] === row && cell[1] === col)
                          ? "Snake"
                          : ""
                      }`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Snake;
