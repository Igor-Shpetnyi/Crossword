import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

const App = () => {
    const words = useMemo(() => [
        "яблуко", "дім", "дерево", "книга", "вода",
        "вітер", "сонце", "місяць", "миша", "хмара",
        "гроза", "річка", "гори", "небо", "море",
        "квітка", "пташка", "зірка", "зима", "осінь"
    ], []);

    const tableSize = 15;
    const maxAttempts = 50;

    const [table, setTable] = useState([]);
    const [highlightEnabled, setHighlightEnabled] = useState(true);
    const [wordCount, setWordCount] = useState('');

    const colorClasses = useMemo(() => [
        'color-1', 'color-2', 'color-3', 'color-4', 'color-5',
        'color-6', 'color-7', 'color-8', 'color-9', 'color-10',
        'color-11', 'color-12', 'color-13', 'color-14', 'color-15',
        'color-16', 'color-17', 'color-18', 'color-19', 'color-20'
    ], []);

    const clearTable = () => {
        const newTable = Array.from({ length: tableSize }, () => Array(tableSize).fill(''));
        setTable(newTable);
    };

    const placeWord = useCallback((word, colorClass) => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < maxAttempts) {
            const startX = Math.floor(Math.random() * tableSize);
            const startY = Math.floor(Math.random() * tableSize);
            const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

            const canPlaceWord = (word, startX, startY, direction) => {
                if (direction === 'horizontal' && startX + word.length > tableSize) return false;
                if (direction === 'vertical' && startY + word.length > tableSize) return false;

                for (let i = 0; i < word.length; i++) {
                    let currentCell;
                    if (direction === 'horizontal') {
                        currentCell = table[startY][startX + i];
                    } else {
                        currentCell = table[startY + i][startX];
                    }
                    if (currentCell !== '' && currentCell !== word[i]) return false;
                }
                return true;
            };

            if (canPlaceWord(word, startX, startY, direction)) {
                const newTable = [...table];
                for (let i = 0; i < word.length; i++) {
                    if (direction === 'horizontal') {
                        newTable[startY][startX + i] = { letter: word[i], color: colorClass };
                    } else {
                        newTable[startY + i][startX] = { letter: word[i], color: colorClass };
                    }
                }
                setTable(newTable);
                placed = true;
            } else {
                attempts++;
            }
        }
        return placed;
    }, [table, maxAttempts, tableSize]);

    const fillEmptyCells = useCallback(() => {
        const alphabet = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
        const newTable = table.map(row =>
            row.map(cell => (cell === '' ? alphabet[Math.floor(Math.random() * alphabet.length)] : cell))
        );
        setTable(newTable);
    }, [table]);

    const generateTableWithWords = useCallback(() => {
        clearTable();
        const wordList = [...words];
        let success = false;

        while (!success) {
            clearTable();
            success = true;
            for (let i = 0; i < wordList.length; i++) {
                const colorClass = colorClasses[i % colorClasses.length];
                if (!placeWord(wordList[i], colorClass)) {
                    success = false;
                    break;
                }
            }
            if (success) {
                setWordCount(`Всього в кросворді ${wordList.length} слів`);
            }
        }
        fillEmptyCells();
    }, [words, colorClasses, placeWord, fillEmptyCells]);

    useEffect(() => {
        generateTableWithWords();
    }, [generateTableWithWords]);

    const toggleHighlight = () => {
        setHighlightEnabled(!highlightEnabled);
    };

    return (
        <div>
            <h1>Зможеш знайти всі слова?</h1>
            <div id="wordCount">{wordCount}</div>
            <table>
                <tbody>
                    {table.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}
                                    className={cell.color ? cell.color : ''}
                                    style={{
                                        fontWeight: cell.color && highlightEnabled ? 'bold' : 'normal',
                                        backgroundColor: highlightEnabled && cell.color ? '' : 'transparent'
                                    }}>
                                    {cell.letter ? cell.letter : ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={toggleHighlight}>
                {highlightEnabled ? 'Вимкнути підсвічування' : 'Увімкнути підсвічування'}
            </button>
        </div>
    );
};

export default App;
