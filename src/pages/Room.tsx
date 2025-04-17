import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRoom } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../context/PeerReducer";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";

const Room = () => {
  const { id } = useParams();
  const {
    ws,
    me,
    stream,
    peers,
    shareScreen,
    isCollectingData,
    toggleCamera,
    toggleMic,
    cameraOn,
    micOn,
    handleCollectData,
  } = useRoom();

  const [totalPeers, setTotalPeers] = useState<any[]>([]);

  useEffect(() => {
    if (me) ws.emit("join-room", { roomId: id, peerId: me._id });
  }, [id, ws, me]);

  useEffect(() => {
    setTotalPeers(Object.values(peers as PeerState));
  }, [peers]);

  // Calcular el número total de streams (incluye el propio)
  const totalStreams = totalPeers.length + 1;

  // Determinar las clases de columnas y filas basadas en el número total de streams
  const getGridClasses = () => {
    if (totalStreams === 1) return "grid-cols-1 grid-rows-1";
    if (totalStreams === 2) return "grid-cols-2 grid-rows-1";
    if (totalStreams <= 4) return "grid-cols-2 grid-rows-2";
    if (totalStreams <= 6) return "grid-cols-3 grid-rows-2";
    if (totalStreams <= 9) return "grid-cols-3 grid-rows-3 rounded-lg";
    return "grid-cols-4 grid-rows-3";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Sala de Videollamada</h1>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
            {totalPeers.length}{" "}
            {totalPeers.length === 1 ? "participante" : "participantes"}
          </span>
        </div>
      </header>
      <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
        <div
          className={`relative bg-gray-800 rounded-lg overflow-hidden ${
            true ? "border-2 border-red-500" : ""
          }`}
        >
          <VideoPlayer stream={stream} />
        </div>
        {totalPeers.map((stream, index) => (
          <div
            key={index}
            className="relative bg-gray-800 rounded-lg overflow-hidden"
          >
            <VideoPlayer key={stream._id} stream={stream.stream} />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
              Participante {index + 1}
            </div>
          </div>
        ))}
      </main>
      <div className="flex justify-center w-full flex-row gap-4 pb-6">
        <button
          onClick={toggleCamera}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition"
        >
          {!cameraOn ? <VideocamOffOutlinedIcon /> : <VideocamOutlinedIcon />}
        </button>
        <button
          onClick={toggleMic}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition"
        >
          {!micOn ? <MicOffOutlinedIcon /> : <MicNoneOutlinedIcon />}
        </button>
        <button
          onClick={handleCollectData}
          className={
            "p-2 text-white rounded-full hover:bg-gray-600 transition " +
            `${isCollectingData ? "bg-red-400" : "bg-gray-800"}`
          }
        >
          {<PostAddOutlinedIcon />}
        </button>
        {/* <footer className="bg-gray-800 p-4 flex justify-center space-x-6">
          <button
            onClick={() => setVideoMuted(!videoMuted)}
            className={`flex flex-col items-center justify-center p-3 rounded-full ${
              videoMuted ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {videoMuted ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              )}
            </svg>
            <span className="text-xs mt-1">
              {videoMuted ? "Encender cámara" : "Apagar cámara"}
            </span>
          </button>

          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className={`flex flex-col items-center justify-center p-3 rounded-full ${
              audioMuted ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {audioMuted ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              )}
            </svg>
            <span className="text-xs mt-1">
              {audioMuted ? "Encender micrófono" : "Apagar micrófono"}
            </span>
          </button>
          <button
            onClick={() => setCollectingData(!collectingData)}
            className={`flex flex-col items-center justify-center p-3 rounded-full ${
              collectingData ? "bg-green-500" : "bg-gray-700 hover:bg-gray-600"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <span className="text-xs mt-1">
              {collectingData ? "Detener recolección" : "Recolectar datos"}
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
              />
            </svg>
            <span className="text-xs mt-1">Finalizar llamada</span>
          </button>
        </footer> */}
      </div>
    </div>
  );
};

export default Room;
