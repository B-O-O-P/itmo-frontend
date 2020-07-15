'use strict';

global.fetch = require('node-fetch');

function isForecastPlanned(first, second) {
  if (first === 'sunny') {
    return second === 'clear' || second === 'partly-cloudy';
  } else if (first === 'cloudy') {
    return second === 'cloudy' || second === 'overcast';
  }

  return false;
}

function getWeather(geoid) {
  return global
    .fetch(`https://api.weather.yandex.ru/v1/forecast?hours=false&limit=7&geoid=${geoid}`)
    .then(response => response.json());
}

/**
 * @typedef {object} TripItem Город, который является частью маршрута.
 * @property {number} geoid Идентификатор города
 * @property {number} day Порядковое число дня маршрута
 */

class TripBuilder {
  /**
   * Конструктор, создающий пустой план поездки
   */
  constructor(geoids) {
    this.geoids = geoids;
    this.forecastPlan = [];
    this.maxStay = 7;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества солнечных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `clear`;
   * * `partly-cloudy`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  sunny(daysCount) {
    this.forecastPlan = this.forecastPlan.concat(Array(daysCount).fill('sunny'));

    return this;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества пасмурных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `cloudy`;
   * * `overcast`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  cloudy(daysCount) {
    this.forecastPlan = this.forecastPlan.concat(Array(daysCount).fill('cloudy'));

    return this;
  }

  /**
   * Метод, добавляющий условие максимального количества дней.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  max(daysCount) {
    this.maxStay = daysCount;

    return this;
  }

  /**
   * Метод, возвращающий Promise с планируемым маршрутом.
   * @returns {Promise<TripItem[]>} Список городов маршрута
   */
  build() {
    return new Promise((resolve, reject) => {
      Promise.all(this.geoids.map(geoid => getWeather(geoid)))
        .then(data => {
          const cityWithForecasts = data.map(forecastWithJson => ({
            geoid: forecastWithJson['info']['geoid'],
            forecasts: forecastWithJson['forecasts'].map(
              day => day['parts']['day_short']['condition']
            )
          }));

          const buildPlan = visitedCities => {
            if (visitedCities.length === this.forecastPlan.length) {
              return visitedCities;
            }

            const currentDay = visitedCities.length;

            const visitCity = cityId => {
              if (
                isForecastPlanned(
                  this.forecastPlan[currentDay],
                  cityWithForecasts.find(cityOnPath => cityOnPath.geoid === cityId).forecasts[
                    currentDay
                  ]
                )
              ) {
                return buildPlan(visitedCities.concat([{ geoid: cityId, day: currentDay + 1 }]));
              }

              return null;
            };

            const lastCityId = visitedCities.length
              ? visitedCities[visitedCities.length - 1].geoid
              : null;

            if (lastCityId !== null) {
              const lastCityDays = visitedCities.filter(visited => visited.geoid === lastCityId)
                .length;

              if (lastCityDays < this.maxStay) {
                const tryLast = visitCity(lastCityId);
                if (tryLast) {
                  return tryLast;
                }
              }
            }

            const availableCities = this.geoids.filter(city =>
              visitedCities.every(visited => visited.geoid !== city)
            );

            for (const nextCity of availableCities) {
              const tryCity = visitCity(nextCity);

              if (tryCity) {
                return tryCity;
              }
            }

            return null;
          };

          const tryPlan = buildPlan([]);

          if (tryPlan) {
            resolve(tryPlan);
          } else {
            reject(new Error('Не могу построить маршрут!'));
          }
        })
        .catch(error => reject(error));
    });
  }
}

/**
 * Фабрика для получения планировщика маршрута.
 * Принимает на вход список идентификаторов городов, а
 * возвращает планировщик маршрута по данным городам.
 *
 * @param {number[]} geoids Список идентификаторов городов
 * @returns {TripBuilder} Объект планировщика маршрута
 * @see https://yandex.ru/dev/xml/doc/dg/reference/regions-docpage/
 */
function planTrip(geoids) {
  return new TripBuilder(geoids);
}

module.exports = {
  planTrip
};
