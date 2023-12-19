const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messageLocation = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sendLoc = document.querySelector("#send-location-1").innerHTML;
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();
socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    created: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("showLocation", (url) => {
  console.log(url);
  const html = Mustache.render(sendLoc, {
    username: url.username,
    url: url.url,
    created: moment(url.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;

  $messageFormButton.disabled = true;

  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.disabled = false;
    $messageFormInput.value = " ";
    $messageFormInput.focus();

    if (error) console.log(error);
  });
});

$messageLocation.addEventListener("click", () => {
  $messageLocation.disabled = true;
  if (!navigator.geolocation) {
    alert("ur browser not support ur geolocation");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        laltitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("ur location send it to every one");
        $messageLocation.disabled = false;
      }
    );
  });
});
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
