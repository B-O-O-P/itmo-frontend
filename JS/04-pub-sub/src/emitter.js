'use strict';

/**
 * Сделано дополнительное задание: реализованы методы several и through.
 */
const isExtraTaskSolved = true;

/**
 * Получение нового Emitter'а
 * @returns {Object}
 */
function getEmitter() {
  const events = {};

  return {
    /**
     * Возвращает все события в порядке их появления
     * @param event
     * @returns {Array}
     */
    getEvents: function(event) {
      const splittedEvents = event.split('.');

      return splittedEvents.reduce((accumulator, currentEvent) => {
        if (accumulator.length === 0) {
          return [currentEvent];
        }
        accumulator.unshift(`${accumulator[0]}.${currentEvent}`);

        return accumulator;
      }, []);
    },

    /**
     * Подписка на событие
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     */
    on: function(event, context, handler) {
      if (!{}.hasOwnProperty.call(events, event)) {
        events[event] = [];
      }

      events[event].push({ context, handler });

      return this;
    },

    /**
     * Отписка от события
     * @param {string} event
     * @param {Object} context
     */
    off: function(event, context) {
      Object.keys(events).forEach(eventToUnsubscribe => {
        if (eventToUnsubscribe === event || eventToUnsubscribe.startsWith(`${event}.`)) {
          events[eventToUnsubscribe] = events[eventToUnsubscribe].filter(
            person => person.context !== context
          );
        }
      });

      return this;
    },

    /**
     * Уведомление о событии
     * @param {string} event
     */
    emit: function(event) {
      const allOfEvent = this.getEvents(event);
      allOfEvent.forEach(emitThis => {
        if ({}.hasOwnProperty.call(events, emitThis)) {
          events[emitThis].forEach(person => {
            person.handler.call(person.context);
          });
        }
      });

      return this;
    },

    /**
     * Подписка на событие с ограничением по количеству отправляемых уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} times Сколько раз отправить уведомление
     */
    several: function(event, context, handler, times) {
      let callTimes = 0;
      const changedHandler =
        times > 0
          ? function() {
              if (callTimes < times) {
                handler.call(context);
                callTimes++;
              }
            }
          : handler;
      this.on(event, context, changedHandler);

      return this;
    },

    /**
     * Подписка на событие с ограничением по частоте отправки уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} frequency Как часто уведомлять
     */
    through: function(event, context, handler, frequency) {
      let callTimes = 0;
      const changedHandler =
        frequency > 0
          ? function() {
              if (callTimes % frequency === 0) {
                handler.call(context);
              }
              callTimes++;
            }
          : handler;
      this.on(event, context, changedHandler);

      return this;
    }
  };
}

module.exports = {
  getEmitter,

  isExtraTaskSolved
};
