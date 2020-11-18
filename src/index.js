import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, useMutation } from '@apollo/react-hooks';
import App from './App';
import apolloClient from './apolloClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { subscriptionMutation } from './queries';

const Wrapper = () => {
  const [insertSubscription] = useMutation(subscriptionMutation);
  useEffect(() => {
    serviceWorker.register(insertSubscription);
  }, [])
  return (
    <App />
  )
}

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Wrapper />
  </ApolloProvider>,
  document.getElementById('root')
);