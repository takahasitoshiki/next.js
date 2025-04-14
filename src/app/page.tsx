"use client";
import React, { useState } from "react";
import "./globals.css";

type Cell = {
  id: number;
  isActive: boolean;
  time: number;
  checkUser: "user1" | "user2" | "";
};

const App = () => {
  const [cells, setCells] = useState<Cell[]>(
    Array.from({ length: 9 }, (_, index) => ({
      id: index,
      isActive: false,
      time: 0,
      checkUser: "",
    }))
  );

  const winPatterns = [
    [0, 1, 2], // 横
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // 縦
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // 斜め
    [2, 4, 6],
  ] as const;

  const [turn, setTurn] = useState(1);
  const [winnerMessage, setWinnerMessage] = useState<string | boolean>(false);

  const handleClick = (id: number) => {
    const clickedCell = cells.find((cell) => cell.id === id);
    if (!clickedCell || clickedCell.isActive) return;

    const newTurn = turn + 1;

    const updatedCells: Cell[] = cells.map((cell) => {
      // クリックされたセルをアクティブにする
      if (cell.id === id) {
        const user = newTurn % 2 === 0 ? "user1" : "user2";
        return { ...cell, isActive: true, time: newTurn, checkUser: user };
      }

      // 6ターン経っていたら非アクティブにする
      if (cell.isActive && newTurn - cell.time >= 7) {
        return { ...cell, isActive: false, time: 0 };
      }
      return cell;
    });
    console.log(updatedCells);

    // 現在のターンを更新
    checkWinner(updatedCells);
    setCells(updatedCells);
    setTurn(newTurn);
  };

  const checkWinner = (cells: Cell[]) => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const values = [cells[a], cells[b], cells[c]];

      if (values.every((cell) => cell.isActive && cell.checkUser === "user1")) {
        return setWinnerMessage("user 1");
      }
      if (values.every((cell) => cell.isActive && cell.checkUser === "user2")) {
        return setWinnerMessage("user 2");
      }
    }
    return false;
  };

  return (
    <>
      <h1 className="title">Click Game</h1>
      <h2 className="winner">
        {winnerMessage ? `Winner: ${winnerMessage}` : ""}
      </h2>
      <p className="description">
        Click on the squares to toggle them. The squares will become inactive
        after 7 turns.
      </p>
      <div className="grid_squares">
        {cells.map((cell) => (
          <button
            key={cell.id}
            className="squares"
            onClick={() => handleClick(cell.id)}
          >
            {!cell.isActive ? "" : cell.time % 2 === 1 ? "X" : "O"}
          </button>
        ))}
        {/* <p className="description">
          Click on the squares to toggle them. The squares will become inactive
          after 7 turns.
        </p>
        <input type="text" /> */}
      </div>
    </>
  );
};

export default App;
