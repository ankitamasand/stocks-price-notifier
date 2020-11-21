const fetch = require('isomorphic-fetch');
const getConfig = require('./config');
const { insertStocksData } = require('./queries');

const symbols = [
  'NFLX',
  'MSFT',
  'AMZN',
  'W',
  'FB'
];

(async function getStocksData () {

  const apiConfig = getConfig('apiHostOptions');
  const { host, timeSeriesFunction, interval, key } = apiConfig;
  const insertStockDataPromises = [];

  symbols.forEach((symbol) => {
    fetch(`${host}query/?function=${timeSeriesFunction}&symbol=${symbol}&interval=${interval}&apikey=${key}`)
    .then((res) => res.json())
    .then((data) => {
      const timeSeries = data['Time Series (5min)'];
      const dataPoints = Object.keys(timeSeries).map((key) => {
        const dataPoint = timeSeries[key];
        return {
          symbol,
          high: dataPoint['2. high'],
          low: dataPoint['3. low'],
          open: dataPoint['1. open'],
          close: dataPoint['4. close'],
          volume: dataPoint['5. volume'],
          time: key
        }
      });
      insertStockDataPromises.push(insertStocksData(dataPoints));
    });
  })
  await Promise.all(insertStockDataPromises);
})()