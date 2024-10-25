import { useEffect, useState } from "react";

function MemoryGame() {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [level, setLevel] = useState(4);
  const [slice, setSlice] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState(new Set());
  const [isGameOver, setIsGameOver] = useState(false);

  const handleStart = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setSeconds(60);
      setFlippedCards([]);
      setMatchedCards(new Set());
      setIsGameOver(false);
    }
  };

  function handleReset() {
    setSeconds(60);
    setIsActive(false);
    setFlippedCards([]);
    setMatchedCards(new Set());
    setIsGameOver(false);
  }

  useEffect(() => {
    let timer = null;
    if (isActive && seconds > 0) {
      timer = setTimeout(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      setIsGameOver(true);
    }
    return () => clearTimeout(timer);
  }, [seconds, isActive]);

  useEffect(() => {
    const arr = Array.from(
      { length: (level * level) / 2 },
      (_, index) => index + 1
    )
      .flatMap((n) => [n, n])
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index + 1, value }));

    setSlice(arr);
  }, [level]);

  const handleCardClick = (index) => {
    // Allow card flip even if game is not active
    if (flippedCards.length >= 2 || matchedCards.has(index)) {
      return;
    }

    // Only allow flipping if the game is active
    if (isActive) {
      setFlippedCards((prev) => [...prev, index]);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      if (slice[firstIndex].value === slice[secondIndex].value) {
        setMatchedCards((prev) =>
          new Set(prev).add(firstIndex).add(secondIndex)
        );
      }
      const timeout = setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [flippedCards, slice]);

  useEffect(() => {
    if (matchedCards.size === slice.length) {
      setIsActive(false);
      setIsGameOver(true);
    }
  }, [matchedCards, slice]);

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center flex-col gap-4">
      <h1>Memory Game 🃏</h1>
      <div>
        <span>Timer : </span>
        <span
          className={`${
            seconds < 10 && seconds !== 0
              ? "text-red-500 transition-opacity duration-1000 ease-in-out animate-fadeIn"
              : ""
          } ${seconds === 0 ? "text-red-500 font-semibold" : ""}`}
        >
          {`${seconds} s`}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {slice.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`bg-gray-300 border border-gray-300 px-4 text-center text-xl cursor-pointer h-12 flex justify-center items-center ${
              flippedCards.includes(index)
                ? "bg-blue-500"
                : matchedCards.has(index)
                ? "bg-green-500"
                : ""
            }`}
          >
            {flippedCards.includes(index) || matchedCards.has(index)
              ? card.value
              : "?"}
          </div>
        ))}
      </div>

      <div>
        <button
          className={`border-2 py-1 px-8 rounded-md ${
            isActive && seconds !== 0 ? "bg-red-500" : "bg-blue-500"
          } text-white font-semibold hover:${
            isActive && seconds !== 0 ? "bg-red-500" : "bg-blue-500"
          }`}
          onClick={handleStart}
        >
          {isActive && seconds !== 0 ? "Stop" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="border-2 py-1 px-8 rounded-md bg-gray-500 text-white font-semibold hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {isGameOver && (
        <div className="mt-4 text-lg font-semibold">
          {matchedCards.size === slice.length
            ? "Congratulations! You matched all cards!"
            : `${seconds <= 0 ? "Time's up! Game over!" : ""}`}
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
