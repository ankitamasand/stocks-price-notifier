const config = {
  databaseOptions: {
    user: '<DATABASE_USER>',
    password: '<DATABASE_PASSWORD>',
    host: '<DATABASE_HOST>',
    port: 5432,
    database: '<DATABASE_NAME>',
    ssl: true,
  },
  apiHostOptions: {
    host: 'https://www.alphavantage.co/',
    key: '<API_KEY>',
    timeSeriesFunction: 'TIME_SERIES_INTRADAY',
    interval: '5min'
  }
};

const getConfig = (key) => {
  return config[key];
};

module.exports = getConfig;