import { gql } from 'apollo-boost';

export const symbolsQuery = gql`
  query getSymbols($userId: uuid) {
    symbol {
      id
      company
      symbol_events(where: {user_id: {_eq: $userId}}) {
        id
        symbol
        trigger_type
        trigger_value
        user_id
      }
      stock_symbol_aggregate {
        aggregate {
          max {
            high
            volume
          }
          min {
            low
            volume
          }
        }
      }
    }
  }
`;

export const stocksDataQuery = gql`
  query getStocksData($symbol: String) {
    stock_data(order_by: {time: desc}, where: {symbol: {_eq: $symbol}}, limit: 25) {
      high
      low
      open
      close
      volume
      time
    }
  }
`;

export const subscriptionMutation = gql`
  mutation userSubscription($userId: uuid, $subscription: jsonb) {
    insert_user_subscription(objects: {id: $userId, subscription: $subscription}) {
      returning {
        id
      }
    }
  }
`;

export const eventsMutation = gql`
  mutation addEvent($symbol: String, $user_id: uuid, $triggerType: String, $triggerValue: numeric) {
    insert_events(objects: {symbol: $symbol, user_id: $user_id, trigger_type: $triggerType, trigger_value: $triggerValue}) {
      returning {
        id
      }
    }
  }
`;

export const updateEventsMutation = gql`
  mutation updateEvents($id: Int, $triggerType: String, $triggerValue: numeric) {
    update_events(where: {id: {_eq: $id}}, _set: {trigger_type: $triggerType, trigger_value: $triggerValue}) {
      returning {
        id
        trigger_type
        trigger_value
      }
    }
  }
`;

export const subscriptionListQuery = gql`
  query getSubscriptions($user_id: uuid) {
    events(where: {user_id: {_eq: $user_id}}) {
      symbol
    }
  }
`;
