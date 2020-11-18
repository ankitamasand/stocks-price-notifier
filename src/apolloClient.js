import ApolloClient from 'apollo-boost';

const apolloClient = new ApolloClient({
  uri: 'https://stocks-app-101.herokuapp.com/v1/graphql'
});

export default apolloClient;