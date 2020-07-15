'use strict';

const minutesInHour = 60;

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

function parseTime(time) {
  const regExpWithShortZone = /^(\d\d):(\d\d)\+(\d)$/;
  const regExpWithLongZone = /^(\d\d):(\d\d)\+(\d\d)$/;

  let parsed = regExpWithShortZone.exec(time);

  if (parsed === null) {
    parsed = regExpWithLongZone.exec(time);
  }

  return parsed;
}

function getHours(parsedDate) {
  return parseInt(parsedDate[1]);
}

function getMinutes(parsedDate) {
  return parseInt(parsedDate[2]);
}

function getTimeZone(parsedDate) {
  return parseInt(parsedDate[3]);
}

function formatToMinutes(hours, minutes) {
  return hours * minutesInHour + minutes;
}

function getTimeZoneDifference(currentTimeZone, targetTimeZone) {
  return (targetTimeZone - currentTimeZone) * 60;
}

function toTime(number) {
  const formatted = number.toString();

  return formatted.length === 1 ? `0${formatted}` : formatted;
}

function formatTime(parsedDate, targetTimeZone) {
  return (
    formatToMinutes(getHours(parsedDate), getMinutes(parsedDate)) +
    getTimeZoneDifference(getTimeZone(parsedDate), targetTimeZone)
  );
}

function formatSchedule(schedule, bankTimeZone) {
  const formattedSchedule = {};

  Object.keys(schedule).forEach(person => {
    formattedSchedule[person] = schedule[person].map(busyHours => {
      const [dayFrom, timeFrom] = busyHours.from.split(' ');
      const [dayTo, timeTo] = busyHours.to.split(' ');

      return {
        from: { day: dayFrom, time: formatTime(parseTime(timeFrom), bankTimeZone) },
        to: { day: dayTo, time: formatTime(parseTime(timeTo), bankTimeZone) }
      };
    });
  });

  return formattedSchedule;
}

function formatBankTime(workingHours) {
  const parsedBankTimeFrom = parseTime(workingHours.from);
  const parsedBankTimeTo = parseTime(workingHours.to);

  return {
    from: formatTime(parsedBankTimeFrom, getTimeZone(parsedBankTimeFrom)),
    to: formatTime(parsedBankTimeTo, getTimeZone(parsedBankTimeTo))
  };
}

function getBusyRanges(formattedSchedule, formattedBankTime) {
  const dayRanges = {};

  for (const day of weekDays) {
    dayRanges[day] = [];
  }

  Object.keys(formattedSchedule).forEach(person => {
    formattedSchedule[person].forEach(({ from, to }) => {
      if (from.day === to.day) {
        dayRanges[from.day].push({ from: from.time, to: to.time });
      } else {
        dayRanges[from.day].push({ from: from.time, to: formattedBankTime.to });
        dayRanges[to.day].push({ from: formattedBankTime.from, to: to.time });
      }
    });
  });

  const busyRanges = {};
  for (let i = 0; i < 3; ++i) {
    busyRanges[weekDays[i]] = dayRanges[weekDays[i]];
  }

  return busyRanges;
}

function isRangeFree(robberyRange, busyRange) {
  return (
    (robberyRange.from < busyRange.from && robberyRange.to <= busyRange.from) ||
    (robberyRange.from >= busyRange.to && robberyRange.to > busyRange.to)
  );
}

function isRangeFitDay(dayBusyRanges, robberyRange) {
  let isFree = true;
  for (const personRange of dayBusyRanges) {
    if (!isRangeFree(robberyRange, personRange)) {
      isFree = false;
      break;
    }
  }

  return isFree;
}

function getRobberyRanges(daysRanges, formattedBankTime, robberyDuration) {
  const robberyRanges = {};
  for (let i = 0; i < 3; ++i) {
    robberyRanges[weekDays[i]] = [];
  }

  for (let i = formattedBankTime.from; i <= formattedBankTime.to - robberyDuration; ++i) {
    const robberyRange = { from: i, to: i + robberyDuration };
    Object.keys(daysRanges).forEach(day => {
      if (daysRanges[day].length) {
        if (isRangeFitDay(daysRanges[day], robberyRange)) {
          robberyRanges[day].push(robberyRange);
        }
      } else {
        robberyRanges[day].push(robberyRange);
      }
    });
  }

  return robberyRanges;
}

function getClosestRobberyTime(robberyRanges) {
  for (const day of Object.keys(robberyRanges)) {
    if (robberyRanges[day].length) {
      return { day: day, range: robberyRanges[day][0] };
    }
  }

  return null;
}

function moveToNextRange(currentTime, robberyRanges) {
  const days = Object.keys(robberyRanges);
  const currentStart = currentTime.range.from + 30;
  const currentDay = currentTime.day;

  for (const day of days) {
    const filtered = robberyRanges[day].filter(range => range.from >= currentStart);
    if (filtered.length && day === currentDay) {
      return { day: currentDay, range: filtered[0] };
    } else if (days.indexOf(day) > days.indexOf(currentDay) && robberyRanges[day].length) {
      return { day: day, range: robberyRanges[day][0] };
    }
  }

  return currentTime;
}

/**
 * Флаг решения дополнительной задачи
 * @see README.md
 */
const isExtraTaskSolved = true;

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  const bankTimeZone = getTimeZone(parseTime(workingHours.from));
  const formattedSchedule = formatSchedule(schedule, bankTimeZone);
  const formattedBankTime = formatBankTime(workingHours);
  const daysRanges = getBusyRanges(formattedSchedule, formattedBankTime);
  const robberyRanges = getRobberyRanges(daysRanges, formattedBankTime, duration);
  let closestTime = getClosestRobberyTime(robberyRanges);

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() {
      for (const day of Object.keys(robberyRanges)) {
        if (robberyRanges[day].length) {
          return true;
        }
      }

      return false;
    },

    /**
     * Возвращает отформатированную строку с часами
     * для ограбления во временной зоне банка
     *
     * @param {string} template
     * @returns {string}
     *
     * @example
     * ```js
     * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
     * ```
     */
    format(template) {
      return closestTime !== null
        ? template
            .replace('%HH', toTime(parseInt(closestTime.range.from / 60)))
            .replace('%MM', toTime(parseInt(closestTime.range.from % 60)))
            .replace('%DD', closestTime.day)
        : '';
    },

    /**
     * Попробовать найти часы для ограбления позже [*]
     * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
     * @returns {boolean}
     */
    tryLater() {
      if (!this.exists()) {
        return false;
      }
      const nextTime = moveToNextRange(closestTime, robberyRanges);

      if (nextTime.day === closestTime.day && nextTime.range.from === closestTime.range.from) {
        return false;
      }

      closestTime = nextTime;

      return true;
    }
  };
}

module.exports = {
  getAppropriateMoment,

  isExtraTaskSolved
};
