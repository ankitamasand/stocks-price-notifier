function showNotification (event) {
  const eventData = event.data.json();
  const { title, body } = eventData
  self.registration.showNotification(title, { body });
}

self.addEventListener('push', (event) => {
  event.waitUntil(showNotification(event));
});