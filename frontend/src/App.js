import React, { useState, useEffect } from 'react';
import './style.css';

const wordsList = [
  'світло', 'машина', 'будинок', 'дерево', 'знання',
  'любов', 'сонце', 'комп\'ютер', 'кіт', 'собака',
  'дорога', 'школа', 'літак', 'море', 'гора',
  'книга', 'стіл', 'вікно', 'квітка', 'зірка'
];

const getRandomLetter = () => {
  const letters = 'абвгґдежзийклмнопрстуфхцчшщьюя';
  return letters[Math.floor(Math.random() * letters.length)];
};

const generateEmptyGrid = (size) => {
  return Array(size).fill(null).map(() => Array(size).fill(''));
};

const WordSearch = () => {
  const gridSize = 15;
  const [grid, setGrid] = useState(generateEmptyGrid(gridSize));
  const [highlightedCells, setHighlightedCells] = useState([]);

  const getRandomColor = () => {
    const colors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFDEAD', '#DDA0DD', '#FFA07A'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const canPlaceWord = (grid, word, x, y, isVertical) => {
    if (isVertical) {
      if (y + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[y + i][x] !== '' && grid[y + i][x] !== word[i]) return false;
      }
    } else {
      if (x + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[y][x + i] !== '' && grid[y][x + i] !== word[i]) return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, x, y, isVertical, color) => {
    const newGrid = [...grid];
    const wordCells = [];

    if (isVertical) {
      for (let i = 0; i < word.length; i++) {
        newGrid[y + i][x] = word[i];
        wordCells.push({ x, y: y + i, color });
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        newGrid[y][x + i] = word[i];
        wordCells.push({ x: x + i, y, color });
      }
    }

    return { newGrid, wordCells };
  };

  const fillEmptyCells = (grid) => {
    return grid.map(row => row.map(cell => (cell === '' ? getRandomLetter() : cell)));
  };

  useEffect(() => {
    let newGrid = generateEmptyGrid(gridSize);
    let newHighlightedCells = [];

    wordsList.forEach((word) => {
      let placed = false;
      let attempts = 0;
      const wordColor = getRandomColor();
      while (!placed && attempts < 100) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        const isVertical = Math.random() < 0.5;
        if (canPlaceWord(newGrid, word, x, y, isVertical)) {
          const { newGrid: updatedGrid, wordCells } = placeWord(newGrid, word, x, y, isVertical, wordColor);
          newGrid = updatedGrid;
          newHighlightedCells = [...newHighlightedCells, ...wordCells];
          placed = true;
        }
        attempts++;
      }
    });

    newGrid = fillEmptyCells(newGrid);
    setGrid(newGrid);
    setHighlightedCells(newHighlightedCells);
  }, []);

  const getCellStyle = (x, y) => {
    const cell = highlightedCells.find(cell => cell.x === x && cell.y === y);
    return cell ? { backgroundColor: cell.color } : {};
  };

  return (
    <div className="word-search-container">
      <h1>СловоШукач</h1>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="grid-cell"
                style={getCellStyle(cellIndex, rowIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordSearch;
