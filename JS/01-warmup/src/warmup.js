'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError(
      `Invalid input: Both arguments must be integer numbers, but found '${a}' and '${b}'.`
    );
  }

  return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
  if (typeof year !== 'number') {
    throw new TypeError(`Invalid input: Argument(${year}) must be an integer number.`);
  }
  if (!Number.isInteger(year) || year <= 0) {
    throw new RangeError(`Invalid input: Argument(${year}) must be non-negative integer number.`);
  }

  return Math.ceil(year / 100);
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
  if (typeof hexColor !== 'string') {
    throw new TypeError(`Invalid input: Argument(${hexColor}) must be a string.`);
  }
  if (!(hexColor.match(/^#[\da-fA-F]{3}$/) || hexColor.match(/^#[\da-fA-F]{6}$/))) {
    throw new RangeError(`Invalid input: 
Argument must be in HEX formant, but found \`${hexColor}\``);
  }

  const rgbColor = new Array(3);
  if (hexColor.length !== 4) {
    rgbColor[0] = parseInt(hexColor.substr(1, 2), 16);
    rgbColor[1] = parseInt(hexColor.substr(3, 2), 16);
    rgbColor[2] = parseInt(hexColor.substr(5, 2), 16);
  } else {
    rgbColor[0] = parseInt(hexColor[1].repeat(2), 16);
    rgbColor[1] = parseInt(hexColor[2].repeat(2), 16);
    rgbColor[2] = parseInt(hexColor[3].repeat(2), 16);
  }
  return `(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`;
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
  if (typeof n !== 'number') {
    throw new TypeError(`Argument(${n}) must be a number.`);
  }
  if (!Number.isInteger(n) || n <= 0) {
    throw new RangeError(`Invalid input: Argument(${n}) must be integer positive number.`);
  }

  let x = 0;
  let y = 1;
  for (let i = 0; i < n; i++) {
    const tmpY = x + y;
    x = y;
    y = tmpY;
  }
  return x;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0 || !matrix.every(Array.isArray)) {
    throw new TypeError('Invalid input: Argument must be two dimensional array.');
  }

  const n = matrix.length;
  const m = matrix[0].length;
  if (!matrix.every(array => array.length === m)) {
    throw new TypeError('Invalid input: Argument must be MxN size.');
  }

  const transposed = [];
  for (let i = 0; i < m; ++i) {
    transposed[i] = [];
    for (let j = 0; j < n; ++j) {
      transposed[i][j] = matrix[j][i];
    }
  }
  return transposed;
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
  if (typeof n !== 'number' || typeof targetNs !== 'number') {
    throw new TypeError(
      `Invalid input: Arguments must be numbers, but found \`${n}\` and \`${targetNs}\`.`
    );
  }
  if (!Number.isInteger(targetNs) || targetNs < 2 || targetNs > 36) {
    throw new RangeError(
      `Invalid input: Arguments \`targetNs\` must be in range [2,36], but found \`${targetNs}\`.`
    );
  }

  return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    throw new TypeError('Invalid input: Argument must be a string.');
  }

  const regexp = /^8-800-\d{3}-\d{2}-\d{2}$/;
  return regexp.test(phoneNumber);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Invalid input: Argument must be a string.');
  }

  const regexp = /:-\)|\(-:/g;
  return (text.match(regexp) || []).length;
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
  function checkLineWasWon(line) {
    for (let i = 0; i < line.length; ++i) {
      if (line[0] !== line[i]) {
        return false;
      }
    }
    return true;
  }

  let winX = false;
  let winO = false;
  const n = field.length;
  for (let i = 0; i < n; ++i) {
    if (checkLineWasWon(field[i])) {
      if (field[i][0] === 'x') {
        winX = true;
      } else {
        winO = true;
      }
    }
    if (checkLineWasWon([field[0][i], field[1][i], field[2][i]])) {
      if (field[0][i] === 'x') {
        winX = true;
      } else {
        winO = true;
      }
    }
  }
  const mainDiagonal = [field[0][0], field[1][1], field[2][2]];
  const sideDiagonal = [field[0][2], field[1][1], field[2][0]];

  if (checkLineWasWon(mainDiagonal)) {
    if (field[0][0] === 'x') {
      winX = true;
    } else {
      winO = true;
    }
  }
  if (checkLineWasWon(sideDiagonal)) {
    if (field[0][2] === 'x') {
      winX = true;
    } else {
      winO = true;
    }
  }
  if (winX && !winO) {
    return 'x';
  } else if (winO && !winX) {
    return 'o';
  } else {
    return 'draw';
  }
}

module.exports = {
  abProblem,
  centuryByYearProblem,
  colorsProblem,
  fibonacciProblem,
  matrixProblem,
  numberSystemProblem,
  phoneProblem,
  smilesProblem,
  ticTacToeProblem
};
