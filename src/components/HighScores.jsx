import React, { useEffect, useState } from "react";

const HighScores = ({ updateHighScores }) => {
  const [highScores, setHighScores] = useState(
    JSON.parse(localStorage.getItem("highScores")) || [],
  );

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "highScores") {
        const newHighScores = JSON.parse(event.newValue) || [];
        setHighScores(newHighScores);
        updateHighScores(newHighScores);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [updateHighScores]);

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
