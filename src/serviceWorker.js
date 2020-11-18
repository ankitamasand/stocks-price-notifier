import { v4 as uuidv4 } from 'uuid';

export const register = (insertSubscription) => {
  if ('serviceWorker' in navigator) {
    const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`
    navigator.serviceWorker.register(swUrl)
      .then(() => {
        console.log('Service Worker registered');
        return navigator.serviceWorker.ready;
      })
      .then((serviceWorkerRegistration) => {
        getSubscription(serviceWorkerRegistration, insertSubscription);
        Notification.requestPermission();
      })
  }
}

const getSubscription = (serviceWorkerRegistration, insertSubscription) => {
  serviceWorkerRegistration.pushManager.getSubscription()
    .then ((subscription) => {
      const userId = uuidv4();
      if (!subscription) {
        const applicationServerKey = urlB64ToUint8Array('BPckX2iBQtnvw7__lAsUnZMUf7dC6D2eADxzlXN4pXbfqxOoi9VgNELiyaQ4vucNZCcd8Tvnd7MZVk5d30OFq1Y')
        serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        }).then (subscription => {
          insertSubscription({
            variables: {
              userId,
              subscription
            }
          });
          localStorage.setItem('serviceWorkerRegistration', JSON.stringify({
            userId,
            subscription
          }));
        })
      }
    })
}

const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
