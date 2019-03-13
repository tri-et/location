let map;
let markers = new Map();
let image = {
  url:
    "https://res.cloudinary.com/elitetech/image/upload/v1552448099/images_gnjmyz.jpg",
  size: new google.maps.Size(20, 32),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(0, 32)
};
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
          icon: {
            url:
              "https://res.cloudinary.com/elitetech/image/upload/v1552448099/images_gnjmyz.jpg",
            size: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
          },
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
