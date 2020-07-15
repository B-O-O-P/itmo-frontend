'use strict';

const friendsCompare = (first, second) => first.name.localeCompare(second.name);

function getGuestList(friends, circleLimit = Infinity) {
  let currentCircle = friends.filter(friend => friend.best).sort(friendsCompare);
  let currentLevel = circleLimit;
  const usedNames = new Set();
  const guestList = [];

  while (currentCircle.length > 0 && currentLevel-- > 0) {
    guestList.push(...currentCircle);
    guestList.forEach(friend => usedNames.add(friend.name));
    const nextNames = currentCircle
      .reduce((acc, next) => acc.concat(next.friends), [])
      .filter(name => !usedNames.has(name));

    currentCircle = friends.filter(friend => nextNames.includes(friend.name)).sort(friendsCompare);
  }

  return guestList;
}

/**
 * @typedef {Object} Friend
 * @property {string} name Имя
 * @property {'male' | 'female'} gender Пол
 * @property {boolean} best Лучший ли друг?
 * @property {string[]} friends Список имён друзей
 */

/**
 * Итератор по друзьям
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 */
function Iterator(friends, filter) {
  if (!(filter instanceof Filter)) {
    throw new TypeError('filter should be an instance of Filter');
  }

  this.orderedFriends = getGuestList(friends, this.maxLevel).filter(filter.isSuitable);
}

Iterator.prototype.done = function() {
  return !this.orderedFriends.length;
};

Iterator.prototype.next = function() {
  return (this.done() ? null : this.orderedFriends.shift());
};

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 * @param {Number} maxLevel Максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
  this.maxLevel = maxLevel;
  Iterator.call(this, friends, filter);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
  this.isSuitable = () => true;
}

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
  const maleFilter = Object.create(Filter.prototype);

  maleFilter.isSuitable = friend => friend.gender === 'male';

  return maleFilter;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
  const femaleFilter = Object.create(Filter.prototype);

  femaleFilter.isSuitable = friend => friend.gender === 'female';

  return femaleFilter;
}

module.exports = {
  Iterator,
  LimitedIterator,
  Filter,
  MaleFilter,
  FemaleFilter
};
