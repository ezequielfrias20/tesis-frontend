import Peer from "peerjs";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "./PeerReducer";
import { addPeerAction, removePeerAction } from "./PeerActions";
import { getQoSStats, metrics } from "../utils/collectQoS";
import toast from "react-hot-toast";

const WS = process.env.REACT_APP_API_URL;

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export const RoomProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState("");
  const [isCollectingData, setIsCollectingData] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [callPeerConnection, setCallPeerConnection] = useState<any | null>(
    null
  );

  const enterRoom = ({ roomId }: any) => {
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log("[participants] ", { participants });
  };
  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };

  const toggleCamera = () => {
    if (stream) {
      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setCameraOn(!cameraOn);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setMicOn(!micOn);
    }
  };
  const switchScreen = (stream: MediaStream) => {
    setStream(stream);
    setScreenSharingId(me?.id ?? "");
  };
  const shareScreen = () => {
    if (screenSharingId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(switchScreen);
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then(switchScreen);
    }
  };

  const handleCollectData = () => {
    if (!callPeerConnection?.call) {
      return toast.error("No existe un Peer para recopilar datos!");
    }
  
    if (!isCollectingData) {
      toast.success("Recolectando datos!");
      
      // Pasamos la función correctamente sin ejecutarla inmediatamente
      intervalRef.current = setInterval(() => {
        if (callPeerConnection?.call && callPeerConnection?.roomId) {
          metrics(callPeerConnection.call, callPeerConnection.roomId);
        }
      }, 5000); // Recolecta estadísticas cada 5 segundos
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      toast.success("Datos recopilados exitosamente!");
    }
  
    setIsCollectingData(!isCollectingData);
  };

  // console.log(dataQoS);
  useEffect(() => {
    const meId = uuidV4();
    // Id que Peer le asigna a cada usuario
    var peer = new Peer(meId, {
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }, // STUN
          {
            urls: "turn:your-turn-server.com",
            username: "user",
            credential: "pass",
          }, // TURN
        ],
      },
    });
    setMe(peer);
    try {
      // Funcion para acceder a la camara y microfono
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }
    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-joined");
      me?.disconnect();
    };
  }, [ws]);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    ws.on("user-joined", ({ peerId, roomId }) => {
      console.log("[user-joined]: ", { peerId });
      setTimeout(() => {
        const call = me.call(peerId, stream);
        call.on("stream", (peerStream) => {
          console.log("Recibiendo Video del anfitrion...");
          dispatch(addPeerAction(peerId, peerStream));
          setCallPeerConnection({ call: call.peerConnection, roomId } as any);
          // toast.success("Recolectando datos!")
          // metrics(call.peerConnection, () => {
          //   setIsCollectingData(false);
          //   newMetrics = false;
          // }, roomId);
          // getQoSStats(call.peerConnection);
        });
      }, 2000);
    });

    me.on("call", (call) => {
      console.log("Recibiendo llamada...");
      call.answer(stream);
      console.log("[call]: ", call);
      call.on("stream", (peerStream: MediaStream) => {
        console.log("Recibiendo Video del anfitrion...");
        dispatch(addPeerAction(call.peer, peerStream));
        // metrics(call.peerConnection, setDataQoS);
      });
    });

    return () => {
      ws.off("user-joined");
    };
  }, [ws, me, stream]);

  const values = useMemo(
    () => ({
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
      handleCollectData
    }),
    [
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
    ]
  );

  return <RoomContext.Provider value={values}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
  return useContext(RoomContext);
};
