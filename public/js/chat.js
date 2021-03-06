const socket = io();
socket.on("message", welcome => {
  console.log(welcome);
});

document.querySelector("#message-form").addEventListener("submit", e => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, sk => {
    console.log(sk);
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geo is not supported");
  }
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  });
});
