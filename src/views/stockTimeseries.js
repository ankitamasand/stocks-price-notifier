import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Chart from '../components/chart';
import Loader from '../components/loader';
import { stocksDataQuery } from '../queries';

const StockTimeseries = ({ symbol }) => {
  const { data, loading, error } = useQuery(stocksDataQuery, {
    variables: {
      symbol
    }
  });
  if (loading) return <Loader />
  if (error) return <p>Something went wrong while fetching the data!</p>

  const getDataPoints = (type) => {
    const values = [];
    data.stock_data.map((dataPoint) => {
      let value = dataPoint[type];
      if (type === 'time') {
        value = new Date(dataPoint['time']).toLocaleString('en-US');
      }
      values.push(value);
    });
    return values;
  }

  const chartOptions = {
    title: {
      text: `${symbol} Timeseries`
    },
    subtitle: {
      text: 'Intraday (5min) open, high, low, close prices & volume'
    },
    yAxis: {
      title: {
        text: '#'
      }
    },
    xAxis: {
      title: {
        text: 'Time'
      },
      categories: getDataPoints('time')
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },
    series: [
      {
        name: 'high',
        data: getDataPoints('high')
      }, {
        name: 'low',
        data: getDataPoints('low')
      }, {
        name: 'open',
        data: getDataPoints('open')
      },
      {
        name: 'close',
        data: getDataPoints('close')
      },
      {
        name: 'volume',
        data: getDataPoints('volume')
      }
    ]
  }

  if (data) return (
    <Chart options={chartOptions}/>
  );
  return null;
}

export default StockTimeseries;