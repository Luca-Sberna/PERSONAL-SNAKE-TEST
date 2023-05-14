import React, { useState } from "react";

const HighScores = () => {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  return (
    <>
      <h2>Top 10</h2>
      {highScores.length === 0 ? (
        <div>Ancora nessun record</div>
      ) : (
        <div>
          <ol>
            {highScores.map(
              (score, index) =>
                score.score !== 0 &&
                score.time !== 0 && (
                  <li key={index}>
                    {score.score} - {score.time}
                  </li>
                ),
            )}
          </ol>
        </div>
      )}
    </>
  );
};

export default HighScores;
