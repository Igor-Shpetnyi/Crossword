import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";

const Crossword = () => {
  const tableSize = 10; // Розмір таблиці
  const maxAttempts = 5; // Максимальна кількість спроб для розміщення слова

  // Список українських слів для кросворду
  const words = useMemo(() => ["яблуко", "апельсин", "банан", "виноград", "диня"], []);

  // Унікальні кольори для кожного слова
  const colorClasses = useMemo(() => [
    "#ff6347", "#4682b4", "#32cd32", "#ffa500", "#8a2be2"
  ], []);

  const [table, setTable] = useState([]);
  const [highlightActive, setHighlightActive] = useState(true);

  // Ініціалізація пустої таблиці
  const initializeTable = useCallback(() => {
    return Array(tableSize)
      .fill(null)
      .map(() => Array(tableSize).fill(""));
  }, [tableSize]);

  // Заповнення пустих клітинок випадковими літерами
  const fillEmptyCells = useCallback((newTable) => {
    for (let y = 0; y < tableSize; y++) {
      for (let x = 0; x < tableSize; x++) {
        if (newTable[y][x] === "") {
          newTable[y][x] = {
            letter: String.fromCharCode(97 + Math.floor(Math.random() * 26)), // Випадкові літери
            color: "random-letter",
          };
        }
      }
    }
    return newTable;
  }, [tableSize]);

  // Перевірка, чи можна розмістити слово у вибраній позиції
  const canPlaceWord = useCallback((word, startX, startY, direction, newTable) => {
    if (direction === "horizontal" && startX + word.length > tableSize) return false;
    if (direction === "vertical" && startY + word.length > tableSize) return false;

    for (let i = 0; i < word.length; i++) {
      const currentCell =
        direction === "horizontal"
          ? newTable[startY]?.[startX + i]
          : newTable[startY + i]?.[startX];

      if (currentCell !== "" && currentCell.letter !== word[i]) {
        return false;
      }
    }
    return true;
  }, [tableSize]);

  // Розміщення слова в таблиці
  const placeWord = useCallback((word, colorClass, newTable) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < maxAttempts) {
      const startX = Math.floor(Math.random() * tableSize);
      const startY = Math.floor(Math.random() * tableSize);
      const direction = Math.random() > 0.5 ? "horizontal" : "vertical";

      if (canPlaceWord(word, startX, startY, direction, newTable)) {
        for (let i = 0; i < word.length; i++) {
          if (direction === "horizontal") {
            newTable[startY][startX + i] = { letter: word[i], color: colorClass };
          } else {
            newTable[startY + i][startX] = { letter: word[i], color: colorClass };
          }
        }
        placed = true;
      } else {
        attempts++;
      }
    }

    return placed;
  }, [tableSize, maxAttempts, canPlaceWord]);

  // Генерація таблиці зі словами
  const generateTableWithWords = useCallback(() => {
    let newTable = initializeTable();
    let failedAttempts = 0;

    for (let i = 0; i < words.length; i++) {
      const wordPlaced = placeWord(words[i], colorClasses[i], newTable);
      if (!wordPlaced) {
        failedAttempts++;
        if (failedAttempts >= maxAttempts) break; // Якщо не вдалося розмістити всі слова
      }
    }

    newTable = fillEmptyCells(newTable);
    setTable(newTable);
  }, [initializeTable, placeWord, fillEmptyCells, words, colorClasses]);

  useEffect(() => {
    generateTableWithWords();
  }, [generateTableWithWords]);

  // Функція для зміни стану підсвічування
  const toggleHighlight = () => {
    setHighlightActive((prevHighlightActive) => !prevHighlightActive);
  };

  return (
    <div>
      <h1>Знайди слова</h1>
      <table>
        <tbody>
          {table.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={highlightActive ? cell.color : "no-highlight"}>
                  {cell.letter}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={toggleHighlight}>
        {highlightActive ? "Вимкнути підсвічування" : "Увімкнути підсвічування"}
      </button>
    </div>
  );
};

export default Crossword;
