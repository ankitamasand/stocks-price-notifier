export const transformSubscriptionsList = (subscriptionsList) => {
  return subscriptionsList.reduce((result, obj) => ({
    ...result,
    [obj.symbol]: {
      ...obj
    }
  }))
}