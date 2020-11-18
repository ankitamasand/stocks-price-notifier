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

(function getStocksData () {

  const apiConfig = getConfig('apiHostOptions');
  const { host, timeSeriesFunction, interval, key } = apiConfig;

  symbols.forEach((symbol) => {
    fetch(`${host}query/?function=${timeSeriesFunction}&symbol=${symbol}&interval=${interval}&apikey=${key}`)
    .then((res) => res.json())
    .then((data) => {
      const timeSeries = data['Time Series (5min)'];
      Object.keys(timeSeries).map((key) => {
        const dataPoint = timeSeries[key];
        const payload = [
          symbol,
          dataPoint['2. high'],
          dataPoint['3. low'],
          dataPoint['1. open'],
          dataPoint['4. close'],
          dataPoint['5. volume'],
          key,
        ];
        insertStocksData(payload);
      });
    });
  })
})()