self.addEventListener("push", event => {
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "https://github.com/lillyapp/habits/blob/main/3FC2E555-7142-43BE-83DE-E5ED7A123793.png",
      badge: "https://github.com/lillyapp/habits/blob/main/3FC2E555-7142-43BE-83DE-E5ED7A123793.png"
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/")
  );
});
