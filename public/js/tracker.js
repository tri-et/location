document.addEventListener("DOMContentLoaded", () => {
  const socket = io("/");
  const positionOptions = {
    enableHighAccuracy: true,
    maximumAge: 0
  };

  setInterval(() => {
    console.log("tick");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        socket.emit("updateLocation", { lat, lng });
      },
      err => {
        console.error(err);
      },
      positionOptions
    );
  }, 2000);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js", { scope: "./" })
    .then(registration => {
      console.log("service worker Registered", registration);
    });
}
