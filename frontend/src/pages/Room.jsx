/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import Peer from "../services/Peer";
import { data } from "react-router-dom";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [stream, setMystream] = useState(null);
  const [Remotestream, setRemotestream] = useState(null);

  const HandleUserjoin = (data) => {
    const { Name, id } = data;
    console.log(`User joined ${(Name, id)}`);
    setRemoteSocketId(id);
  };
  const HandleIncommingCall = async (data) => {
    const { from, offer } = data;
    setRemoteSocketId(from);
    console.log(from, offer);
    const stram = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMystream(stram);
    const answer = await Peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, answer });
  };
  const HandleSendStream = async () => {
    // e.preventDefault();
    for (const track of stream.getTracks()) {
      Peer.peer.addTrack(track, stream);
    }
  };
  const HandleCallAccepted = async (data) => {
    const { from, answer } = data;
    console.log("call accedpted", from, answer);
    Peer.setLocalDescriptions(answer);
    HandleSendStream();
  };

  const HandleNego = async () => {
    const offer = await Peer.getOffer();
    socket.emit("peer:nego:needed", { to: remoteSocketId, offer });
  };
  useEffect(() => {
    Peer.peer.addEventListener("negotiationneeded", HandleNego);
    return () => {
      Peer.peer.removeEventListener("negotiationneeded", HandleNego);
    };
  }, [HandleNego]);

  useEffect(() => {
    Peer.peer.addEventListener("track", (ev) => {
      const remotestram = ev.streams;
      setRemotestream(remotestram[0]);
    });
  }, []);
  const HandleNegoIncommign = async (data) => {
    const { from, offer } = data;
    const ans = await Peer.getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans });
  };
  const HandleNegofinal = async (data) => {
    const { from, ans } = data;
    await Peer.setLocalDescriptions(ans);
  };

  useEffect(() => {
    socket.on("user:joined", HandleUserjoin);
    socket.on("incomming:call", HandleIncommingCall);
    socket.on("call:accepted", HandleCallAccepted);
    socket.on("peer:nego:needed", HandleNegoIncommign);
    socket.on("peer:nego:final", HandleNegofinal);
    return () => {
      socket.off("user:joined", HandleUserjoin);
      socket.off("incomming:call", HandleIncommingCall);
      socket.off("call:accepted", HandleCallAccepted);
      socket.off("peer:nego:needed", HandleNegoIncommign);
      socket.off("peer:nego:final", HandleNegofinal);
    };
  }, [socket, HandleUserjoin, HandleIncommingCall, HandleCallAccepted]);
  const HandleUserCall = async () => {
    const stram = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const offer = await Peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMystream(stram);
  };

  return (
    <div>
      <h1>Room screen</h1>
      <h4>{remoteSocketId ? "connected" : "No One is room"}</h4>
      {stream && <button onClick={HandleSendStream}>Send Stream</button>}
      {stream && (
        <>
          <h1>my screen</h1>

          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={stream}
          />
        </>
      )}
      {Remotestream && (
        <>
          <h1>Remotestream screen</h1>

          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={Remotestream}
          />
        </>
      )}
      {remoteSocketId ? <button onClick={HandleUserCall}>Call</button> : <></>}
    </div>
  );
};
export default Room;
