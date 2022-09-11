export const checkRoomId = (id, roomName) => {
  if (id === "public-room") {
    return "public-room";
  } else {
    return roomName;
  }
};
