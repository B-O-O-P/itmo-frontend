'use strict';

/**
 * Если вы решили сделать дополнительное задание и реализовали функцию importFromDsv,
 * то выставьте значение переменной isExtraTaskSolved в true.
 */
const isExtraTaskSolved = true;

/**
 * Телефонная книга
 */
let phoneBook = [];

function validatePhone(phone) {
  const phoneRegex = /^\d{10}$/;

  return typeof phone === 'string' && phoneRegex.test(phone);
}

function validateName(name) {
  return typeof name === 'string' && name.length !== 0;
}

function validateEmail(email) {
  return typeof email === 'string' || email === undefined;
}

function validateContact(phone, name, email) {
  return validatePhone(phone) && validateName(name) && validateEmail(email);
}

function matchQuery(query, contact) {
  if (query === '*') {
    return true;
  }
  if (contact.name.includes(query) || contact.phone.includes(query)) {
    return true;
  }

  return contact.email !== undefined && contact.email.includes(query);
}

/**
 * Добавление записи в телефонную книгу
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function add(phone, name, email) {
  if (!validateContact(phone, name, email)) {
    return false;
  }
  if (phoneBook.includes(value => value.phone === phone)) {
    return false;
  }
  phoneBook.push({ phone: phone, name: name, email: email });

  return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function update(phone, name, email) {
  if (!validateContact(phone, name, email)) {
    return false;
  }

  const foundValueIndex = phoneBook.findIndex(contact => contact.phone === phone);
  if (foundValueIndex === -1) {
    return false;
  }
  phoneBook[foundValueIndex] = { phone, name, email };

  return true;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {string} query
 * @returns {string[]}
 */
function find(query) {
  if (typeof query !== 'string' || query.length === 0) {
    return [];
  }
  const result = [];

  for (const contact of phoneBook) {
    if (matchQuery(query, contact)) {
      let queryResult = contact.name;
      const queryPhone = `+7 (${contact.phone.slice(0, 3)}) ${contact.phone.slice(
        3,
        6
      )}-${contact.phone.slice(6, 8)}-${contact.phone.slice(8, 10)}`;
      queryResult = `${queryResult}, ${queryPhone}`;
      queryResult = `${queryResult}${contact.email ? `, ${contact.email}` : ''}`;
      result.push(queryResult);
    }
  }

  return result.sort();
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {string} query
 * @returns {number}
 */
function findAndRemove(query) {
  if (typeof query !== 'string' || query.length === 0) {
    return 0;
  }

  const sizeBeforeDelete = phoneBook.length;
  phoneBook = phoneBook.filter(contact => {
    return !matchQuery(query, contact);
  });

  return sizeBeforeDelete - phoneBook.length;
}

/**
 * Импорт записей из dsv-формата
 * @param {string} dsv
 * @returns {number} Количество добавленных и обновленных записей
 */
function importFromDsv(dsv) {
  if (typeof dsv !== 'string') {
    return 0;
  }
  let importedCounter = 0;

  for (const contactLine of dsv.split('\n')) {
    const splittedContact = contactLine.split(';');
    const name = splittedContact[0];
    const phone = splittedContact[1];
    const email = splittedContact[2];
    if (add(phone, name, email) || update(phone, name, email)) {
      importedCounter++;
    }
  }

  return importedCounter;
}

module.exports = {
  add,
  update,
  find,
  findAndRemove,
  importFromDsv,

  isExtraTaskSolved
};
