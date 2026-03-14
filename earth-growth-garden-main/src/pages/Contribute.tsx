import { useState, useEffect } from "react";
import ContributeButton from "@/components/ContributeButton";
import { TreeDeciduous } from "lucide-react";
import { io } from "socket.io-client";

// Connect to the local socket.io server. Assuming it runs on the same host but port 3001
const socket = io(`http://${window.location.hostname}:3001`);

const Contribute = () => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [stats, setStats] = useState({ contributions: 0, participants: 0 });

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setIsConnected(false);
    });

    socket.on("state-update", (newState) => {
      setStats(newState);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("state-update");
    };
  }, []);

  const handleContribute = () => {
    socket.emit("contribute");
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 300);
  };

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-screen px-4 pattern-grid-lg"
      style={{
        background: "linear-gradient(180deg, hsl(20, 30%, 22%) 0%, hsl(15, 35%, 15%) 100%)",
      }}
    >
      <div className="absolute top-8 text-center text-soil-surface opacity-80 z-0">
        <TreeDeciduous className="w-16 h-16 mx-auto mb-2 opacity-50" />
        <h2 className="text-2xl font-display font-medium text-soil-foreground/90">
          Grow the Banyan Tree!
        </h2>
        <p className="font-body text-soil-foreground/70 mt-1">
          Tap the button below as many times as you like.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,44,44,0.6)]'}`} />
          <span className="text-xs uppercase tracking-widest font-semibold opacity-60">
            {isConnected ? 'Network Connected' : 'Connecting to Tree...'}
          </span>
        </div>
      </div>

      <div className="z-10 scale-[1.5] xs:scale-[2]">
        <ContributeButton onContribute={handleContribute} />
      </div>

      <div className="absolute bottom-8 text-center z-10 w-full px-4">
        <div className="bg-soil-surface/30 backdrop-blur-md rounded-2xl py-3 px-6 inline-block shadow-xl border border-soil-surface/40">
           <div className="flex gap-8 justify-center items-center font-body text-soil-foreground/90">
             <div className="text-center">
                <p className="text-xs uppercase tracking-wider opacity-60 font-semibold mb-1">Total Taps</p>
                <p className="text-2xl font-bold font-display">{stats.contributions}</p>
             </div>
             <div className="h-8 w-px bg-soil-surface/30"></div>
             <div className="text-center">
                <p className="text-xs uppercase tracking-wider opacity-60 font-semibold mb-1">Participants</p>
                <p className="text-2xl font-bold font-display">{stats.participants}</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
