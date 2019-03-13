let map;
let markers = new Map();
document.addEventListener("DOMContentLoaded", () => {
  const socket = io("/");
  socket.on("trackerDisconnected", id => {
    if (markers.has(id)) {
      const maker = markers.get(id);
      maker.setMap(null);
      markers.delete(id);
    }
  });
  socket.on("locationUpdate", locations => {
    markers.forEach((marker, id) => {
      marker.setMap(null);
      markers.delete(id);
    });
    locations.forEach(([id, position]) => {
      if (position.lat && position.lng) {
        const marker = new google.maps.Marker({
          position,
          map,
          // icon: {
          //   url:
          //     "https://res.cloudinary.com/elitetech/image/upload/v1552449542/icons8-fiat-500-48_vpo4ts.png",
          //   size: new google.maps.Size(71, 71),
          //   origin: new google.maps.Point(0, 0),
          //   anchor: new google.maps.Point(17, 34),
          //   scaledSize: new google.maps.Size(30, 30)
          // },
          title: id
        });
        markers.set(id, marker);
      }
    });
  });
  setInterval(() => {
    socket.emit("requestLocations");
  }, 2000);
});
function initMap() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 15
      });
    },
    err => {
      console.error(err);
    }
  );
}
