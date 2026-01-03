import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSearchParams, useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("room");

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  
  // Refs to track signaling state and prevent collisions
  const makingOffer = useRef(false);
  const ignoreOffer = useRef(false);

  const [callStatus, setCallStatus] = useState("Connecting...");
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!roomId) return;

    const initCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        peerRef.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // Add tracks to the connection
        stream.getTracks().forEach((track) => peerRef.current.addTrack(track, stream));

        peerRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setCallStatus("Connected");
          }
        };

        peerRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { roomId, candidate: event.candidate });
          }
        };

        socket.emit("join-room", roomId);

        /* =====================================================
           ROBUST SIGNALING LOGIC (Perfect Negotiation)
        ===================================================== */

        socket.on("user-joined", async () => {
          try {
            makingOffer.current = true;
            const offer = await peerRef.current.createOffer();
            // Check if state changed before setting local description
            if (peerRef.current.signalingState !== "stable") return;
            
            await peerRef.current.setLocalDescription(offer);
            socket.emit("offer", { roomId, offer: peerRef.current.localDescription });
          } catch (err) {
            console.error("Offer Error:", err);
          } finally {
            makingOffer.current = false;
          }
        });

        socket.on("offer", async (offer) => {
          try {
            // Check if offer is valid
            if (!offer) return;

            const readyForOffer = !makingOffer.current && 
                                (peerRef.current.signalingState === "stable" || ignoreOffer.current);

            if (!readyForOffer) {
              ignoreOffer.current = true;
              return;
            }

            ignoreOffer.current = false;
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer: peerRef.current.localDescription });
          } catch (err) {
            console.error("Offer Handling Error:", err);
          }
        });

        socket.on("answer", async (answer) => {
          try {
            // Ensure answer exists and state is correct
            if (answer && peerRef.current.signalingState === "have-local-offer") {
              await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
          } catch (err) {
            console.error("Answer Handling Error:", err);
          }
        });

        socket.on("ice-candidate", async (candidate) => {
          try {
            if (candidate && peerRef.current.remoteDescription) {
              await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (err) {
            // Ignore candidates that arrive before remote description
          }
        });

      } catch (err) {
        setCallStatus("Camera Access Denied");
      }
    };

    initCall();

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (peerRef.current) peerRef.current.close();
    };
  }, [roomId]);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (callStatus === "Connected") {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const toggleMic = () => {
    if (streamRef.current) {
      const track = streamRef.current.getAudioTracks()[0];
      track.enabled = !track.enabled;
      setMicActive(track.enabled);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      track.enabled = !track.enabled;
      setVideoActive(track.enabled);
    }
  };

  return (
    <div style={{ height: "100vh", background: "#0f0f0f", color: "white", position: "relative", overflow: "hidden" }}>
      {/* UI Elements (Identical to your previous professional UI) */}
      <div style={{ position: "absolute", top: 20, width: "100%", padding: "0 20px", display: "flex", justifyContent: "space-between", zIndex: 10 }}>
        <div style={{ background: "rgba(0,0,0,0.5)", padding: "10px 20px", borderRadius: "30px" }}>
          {callStatus} | Room: {roomId}
        </div>
        <div style={{ background: "rgba(0,0,0,0.5)", padding: "10px 20px", borderRadius: "30px", fontWeight: "bold" }}>
          {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div style={{ height: "100%", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        
        <div style={{ position: "absolute", top: 80, right: 30, width: "240px", height: "150px", borderRadius: "15px", overflow: "hidden", border: "2px solid #444", background: "#222" }}>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: videoActive ? 'block' : 'none' }} />
          {!videoActive && <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="bi bi-camera-video-off fs-1"></i></div>}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "20px", background: "#1a1a1a", padding: "15px 40px", borderRadius: "50px" }}>
        <button onClick={toggleMic} style={{ background: micActive ? "#444" : "#d32f2f", color: "white", border: "none", width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer" }}>
          <i className={`bi bi-mic${micActive ? "-fill" : "-mute-fill"}`}></i>
        </button>
        <button onClick={toggleVideo} style={{ background: videoActive ? "#444" : "#d32f2f", color: "white", border: "none", width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer" }}>
          <i className={`bi bi-camera-video${videoActive ? "-fill" : "-off-fill"}`}></i>
        </button>
        <button onClick={() => navigate(-1)} style={{ background: "#d32f2f", color: "white", border: "none", padding: "0 30px", borderRadius: "25px", fontWeight: "bold", cursor: "pointer" }}>END SESSION</button>
      </div>
    </div>
  );
};

export default VideoCall;