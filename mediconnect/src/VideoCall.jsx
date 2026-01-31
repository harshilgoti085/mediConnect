import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSearchParams, useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("room");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);

  const makingOffer = useRef(false);
  const polite = useRef(false);
  const ignoreOffer = useRef(false);

  const [callStatus, setCallStatus] = useState("Connecting...");
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        localVideoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pcRef.current = pc;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = e => {
          remoteVideoRef.current.srcObject = e.streams[0];
          setCallStatus("Connected");
        };

        pc.onicecandidate = e => {
          if (e.candidate) socket.emit("ice-candidate", { roomId, candidate: e.candidate });
        };

        // 🔥 PERFECT NEGOTIATION — OFFER CREATION
        pc.onnegotiationneeded = async () => {
          try {
            if (makingOffer.current) return;
            makingOffer.current = true;

            await pc.setLocalDescription(await pc.createOffer());
            socket.emit("offer", { roomId, offer: pc.localDescription });

          } catch (err) {
            console.error("Negotiation error:", err);
          } finally {
            makingOffer.current = false;
          }
        };

        socket.emit("join-room", roomId);

        socket.on("user-joined", () => {
          polite.current = true;
        });

        // 🔥 PERFECT NEGOTIATION — HANDLE OFFER
        socket.on("offer", async offer => {
          const pc = pcRef.current;
          if (!pc) return;

          try {
            const offerCollision =
              makingOffer.current || pc.signalingState !== "stable";

            ignoreOffer.current = !polite.current && offerCollision;
            if (ignoreOffer.current) {
              console.log("🚫 Ignoring offer collision");
              return;
            }

            if (offerCollision) {
              console.log("↩ Rolling back local description");
              await pc.setLocalDescription({ type: "rollback" });
            }

            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            if (pc.signalingState === "have-remote-offer") {
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              socket.emit("answer", { roomId, answer: pc.localDescription });
            }
          } catch (err) {
            console.error("Error handling offer:", err);
          }
        });

        // 🔥 HANDLE ANSWER SAFELY
        socket.on("answer", async answer => {
          const pc = pcRef.current;
          try {
            if (pc.signalingState === "have-local-offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } else {
              console.warn("⚠️ Ignored answer in state:", pc.signalingState);
            }
          } catch (err) {
            console.error("Error setting remote answer:", err);
          }
        });

        socket.on("ice-candidate", async candidate => {
          try {
            if (pcRef.current.remoteDescription) {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (err) {
            console.error("ICE candidate error", err);
          }
        });

      } catch (err) {
        console.error("Media error:", err);
        setCallStatus("Camera/Mic Blocked");
      }
    };

    start();

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      if (pcRef.current) pcRef.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [roomId]);

  useEffect(() => {
    let interval;
    if (callStatus === "Connected") {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const toggleMute = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  return (
    <div style={styles.page}>
      <video ref={remoteVideoRef} autoPlay playsInline style={styles.remoteVideo} />

      <div style={styles.header}>
        <div style={styles.statusBadge}>
          <div style={{
            ...styles.pulse,
            backgroundColor: callStatus === "Connected" ? "#4ade80" : "#facc15"
          }} />
          {callStatus} | {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
        </div>
      </div>

      <div style={styles.localContainer}>
        <video ref={localVideoRef} autoPlay muted playsInline style={{ ...styles.localVideo, opacity: isVideoOff ? 0 : 1 }} />
        {isVideoOff && <div style={styles.videoOffOverlay}>🚫</div>}
      </div>

      <div style={styles.footer}>
        <div style={styles.controlsBg}>
          <button onClick={toggleMute} style={{ ...styles.iconBtn, color: isMuted ? "#ff4d4d" : "white" }}>
            {isMuted ? "🔇" : "🎙️"}
          </button>

          <button onClick={() => navigate(-1)} style={styles.endCallBtn}>
            Hang Up
          </button>

          <button onClick={toggleVideo} style={{ ...styles.iconBtn, color: isVideoOff ? "#ff4d4d" : "white" }}>
            {isVideoOff ? "🙈" : "📹"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { height: "100vh", width: "100vw", backgroundColor: "#0a0a0a", position: "relative", overflow: "hidden" },
  remoteVideo: { position: "absolute", width: "100%", height: "100%", objectFit: "cover" },
  header: { position: "relative", zIndex: 10, padding: "20px" },
  statusBadge: { backgroundColor: "rgba(0,0,0,0.5)", color: "white", padding: "8px 16px", borderRadius: "20px", display: "flex", gap: "10px" },
  pulse: { width: "8px", height: "8px", borderRadius: "50%" },
  localContainer: { position: "absolute", top: "20px", right: "20px", width: "240px", height: "150px", borderRadius: "12px", overflow: "hidden" },
  localVideo: { width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" },
  videoOffOverlay: { position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", background: "#1a1a1a" },
  footer: { position: "absolute", bottom: "30px", width: "100%", display: "flex", justifyContent: "center" },
  controlsBg: { backgroundColor: "rgba(255,255,255,0.1)", padding: "12px 24px", borderRadius: "40px", display: "flex", gap: "25px" },
  iconBtn: { background: "none", border: "none", fontSize: "22px", cursor: "pointer" },
  endCallBtn: { backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "10px 24px", borderRadius: "25px", cursor: "pointer" }
};

export default VideoCall;
