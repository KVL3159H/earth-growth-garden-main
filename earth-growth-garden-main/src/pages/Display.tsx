import { useState, useEffect } from "react";
import TreeVisualization from "@/components/TreeVisualization";
import StatCard from "@/components/StatCard";
import MilestoneToast from "@/components/MilestoneToast";
import { Users, Sprout } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { io } from "socket.io-client";

const MAX_CONTRIBUTIONS = 10; // Updated to 10 as per user request

const MILESTONES: Record<number, string> = {
  10: "First sprout! 🌿",
  50: "Growing strong! 🌱",
  100: "New leaves unlocked! 🍃",
  200: "Branches forming! 🌳",
  500: "Aerial roots dropping! 🪢",
  800: "Giant Banyan emerging! 🎋",
  1000: "Majestic Banyan tree achieved! 🎊",
};

// Connect to the local socket.io server.
const socketUrl = `http://${window.location.hostname}:3001`;
const socket = io(socketUrl);

const Display = () => {
  const [state, setState] = useState({ contributions: 0, participants: 0 });
  const [isPulsing, setIsPulsing] = useState(false);
  const [milestone, setMilestone] = useState<string | null>(null);
  const [milestoneKey, setMilestoneKey] = useState(0);
  const [networkIp, setNetworkIp] = useState(window.location.hostname); // Fallback to hostname
  
  // We dynamically fetch the server's LAN IP so the QR code can be scanned by other devices.
  const contributeUrl = `http://${networkIp}:${window.location.port || '8080'}/contribute`;

  useEffect(() => {
    // Fetch the correct LAN IP from our backend
    fetch(`http://${window.location.hostname}:3001/api/server-info`)
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setNetworkIp(data.ip);
        }
      })
      .catch(err => console.error("Could not fetch server IP:", err));
      
    socket.on("state-update", (newState) => {
      setState((prev) => {
        // Did we hit a new milestone?
        const newKeys = Object.keys(MILESTONES).map(Number).filter(k => k > prev.contributions && k <= newState.contributions);
        if (newKeys.length > 0) {
          setMilestone(MILESTONES[Math.max(...newKeys)]);
          setMilestoneKey((k) => k + 1);
        }

        if (newState.contributions > prev.contributions) {
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 500); // Pulse effect
        }

        return newState;
      });
    });

    return () => {
      socket.off("state-update");
    };
  }, []);

  const growthPercent = Math.min(100, (state.contributions / MAX_CONTRIBUTIONS) * 100);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      <MilestoneToast key={milestoneKey} message={milestone} />

      {/* Sky / Above Ground Area */}
      <div
        className="relative flex-1 flex flex-col"
        style={{
          minHeight: "75vh",
          background: "linear-gradient(180deg, hsl(190, 60%, 92%) 0%, hsl(130, 60%, 97%) 100%)",
        }}
      >
        {/* Floating stat cards */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-4">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Live Participants"
            value={state.participants}
          />
          <StatCard
            icon={<Sprout className="w-6 h-6" />}
            label="Total Contributions"
            value={state.contributions}
          />
        </div>

        {/* QR Code section */}
        <div className="absolute top-6 right-6 z-10 flex flex-col items-center bg-white/80 backdrop-blur border border-white p-4 rounded-xl shadow-lg">
           <p className="font-display font-bold text-soil-foreground/80 mb-3 text-lg">Scan to Grow!</p>
           <div className="bg-white p-2 rounded-lg">
             <QRCodeSVG value={contributeUrl} size={150} />
           </div>
           <p className="font-body text-xs mt-3 text-soil-foreground/60 w-[150px] text-center">Join the network and tap to contribute.</p>
        </div>

        {/* Title */}
        <div className="absolute top-10 left-0 right-0 text-center z-10 pointer-events-none">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tighter drop-shadow-md">
            The Digital Banyan
          </h1>
          <p className="text-muted-foreground font-body text-lg mt-2 drop-shadow-sm font-medium">
            RITDC Tech Fest 2026
          </p>
        </div>

        {/* Tree area */}
        <div className="flex-1 flex items-end justify-center px-4 pb-0 relative z-0">
          <div className="w-full max-w-4xl" style={{ marginBottom: "-2px" }}>
            <TreeVisualization growthPercent={growthPercent} isPulsing={isPulsing} eventName="RITDC Tech Fest" />
          </div>
        </div>

        {/* Grass / horizon line */}
        <div className="relative h-8 z-[1]">
          <svg viewBox="0 0 1200 40" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,20 Q100,5 200,18 Q300,30 400,15 Q500,5 600,20 Q700,32 800,14 Q900,5 1000,22 Q1100,30 1200,16 L1200,40 L0,40 Z"
              fill="hsl(120, 35%, 35%)"
            />
          </svg>
        </div>
      </div>

      {/* Soil / Underground Area */}
      <div
        className="relative flex flex-col items-center gap-6 px-4 py-8"
        style={{
          minHeight: "25vh",
          background: "linear-gradient(180deg, hsl(20, 30%, 22%) 0%, hsl(15, 35%, 15%) 100%)",
        }}
      >
        <div className="text-center text-soil-surface/60 font-display mt-8 scale-150 opacity-50">
           Root Network Active
        </div>

        {/* Decorative soil dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-soil-surface"
              style={{
                width: 4 + (i % 4) * 3,
                height: 4 + (i % 4) * 3,
                left: `${(i * 11.3) % 100}%`,
                top: `${10 + (i * 7.7) % 80}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Display;
