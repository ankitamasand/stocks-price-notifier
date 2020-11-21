const { createApolloFetch } = require('apollo-fetch');
const getConfig = require('./config');

const GRAPHQL_URL = getConfig('graphqlURL');
const fetch = createApolloFetch({
  uri: GRAPHQL_URL,
});

const insertStocksData = async (payload) => {
  const insertStockMutation = await fetch({
    query: `mutation insertStockData($objects: [stock_data_insert_input!]!) {
      insert_stock_data (objects: $objects) {
        returning {
          id
        }
      }
    }`,
    variables: {
      objects: payload,
    },
  });
  console.log('insertStockMutation', insertStockMutation);
};

module.exports = {
  insertStocksData
}