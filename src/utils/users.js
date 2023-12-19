const users = [];
const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) {
    return {
      erro: "username and room are required",
    };
  }
  const existUser = users.find(
    (user) => user.username == username && user.room == room
  );

  if (existUser) {
    return {
      error: "this user in used",
    };
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id == id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }

  return {
    error: "can t find this user",
  };
};
addUser({
  id: 22,
  username: "sleh",
  room: "tunsia",
});
addUser({
  id: 25,
  username: "hassen",
  room: "rades",
});
const getUser = (id) => {
  const user = users.find((user) => user.id == id);
  if (!user) {
    return {
      error: "you cant find this user",
    };
  }
  return user;
};
const getUsersInRoom = (room) => {
  room = room.trim();
  return users.filter((user) => user.room == room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
