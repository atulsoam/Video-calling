/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import {useNavigate} from "react-router-dom"

const Lobby = () => {
  const [Name, setName] = useState("");
  const [Room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate()

    const HandleRoomJoin = (data)=>{
        const {Name,Room} = data
        navigate(`/room/${Room}`)
    }

  const HandleSubmit = (e) => {
    e.preventDefault();
    // console.log(Name, Room);
    socket.emit("room:join", { Name, Room });
  };
  useEffect(() => {
    socket.on("room:join", HandleRoomJoin);
    return () =>{socket.off("room:join",HandleRoomJoin)}
  }, [socket,HandleRoomJoin]);
  return (
    <div>
      <h1>Lobby screen</h1>
      <form onSubmit={HandleSubmit}>
        <label htmlFor="Name">Name : </label>
        <input
          type="text"
          name="Name"
          id="Name"
          value={Name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label htmlFor="Room">RoomId : </label>
        <input
          type="text"
          name="Room"
          id="Room"
          value={Room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
};
export default Lobby;
