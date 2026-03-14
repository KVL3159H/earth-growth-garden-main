import { useMemo } from "react";

interface TreeVisualizationProps {
  growthPercent: number; // 0-100
  isPulsing: boolean;
  eventName?: string;
}

const TreeVisualization = ({ growthPercent, isPulsing, eventName }: TreeVisualizationProps) => {
  const stage = useMemo(() => {
    if (growthPercent < 2) return 0;   // seed
    if (growthPercent < 10) return 1;  // sprout
    if (growthPercent < 25) return 2;  // small tree
    if (growthPercent < 50) return 3;  // forming banyan
    if (growthPercent < 80) return 4;  // dropping roots
    return 5;                          // full giant banyan
  }, [growthPercent]);

  const treeScale = 0.5 + (growthPercent / 100) * 1.5;
  const trunkHeight = Math.min(220, (growthPercent / 100) * 250);
  const trunkWidth = 10 + (growthPercent / 100) * 60; // Gets very thick
  const canopyScale = stage >= 2 ? Math.min(1.5, Math.max(0, (growthPercent - 15) / 60)) : 0;
  
  // A banyan tree has a much wider canopy
  const leafCount = Math.floor((growthPercent / 100) * 70);
  const rootLength = Math.min(100, (growthPercent / 100) * 120);

  // Aerial roots dropping from the canopy
  const aerialRootsCount = stage >= 4 ? Math.floor(((growthPercent - 50) / 50) * 15) : 0;

  const leaves = useMemo(() => {
    const result = [];
    for (let i = 0; i < leafCount; i++) {
      // Create a very wide ellipsoid canopy
      const angle = (i / leafCount) * Math.PI + Math.PI; // upper half circle
      const radiusX = 60 + (i % 8) * 20 + Math.sin(i * 1.5) * 40;
      const radiusY = 40 + (i % 5) * 15 + Math.cos(i) * 20;
      
      const x = Math.cos(angle) * radiusX;
      // Offset Y to be at the top of the trunk
      const y = -trunkHeight - 10 + Math.sin(angle) * radiusY;
      
      const size = 12 + (i % 4) * 5;
      const hue = 100 + (i % 7) * 15;
      const lightness = 25 + (i % 5) * 10;
      result.push({ x, y, size, hue, lightness, delay: (i % 10) * 0.1 });
    }
    return result;
  }, [leafCount, trunkHeight]);

  const aerialRoots = useMemo(() => {
    const result = [];
    for (let i = 0; i < aerialRootsCount; i++) {
      const x = -80 + (i * 12) + Math.sin(i) * 15;
      // Start from somewhere in the canopy
      const startY = -trunkHeight - 40 + (i % 3) * 10;
      // Drop down towards ground
      const length = 60 + (i % 5) * 30;
      result.push({ x, startY, length });
    }
    return result;
  }, [aerialRootsCount, trunkHeight]);

  return (
    <div className="relative w-full flex items-end justify-center" style={{ height: '500px' }}>
      <svg
        viewBox="-250 -400 500 450"
        className={`w-full max-w-4xl h-full ${isPulsing ? 'animate-sway' : ''}`}
        style={{ transition: 'all 0.8s ease-out', overflow: 'visible' }}
        preserveAspectRatio="xMidYMax meet"
      >
        <g style={{ transform: `scale(${treeScale})`, transformOrigin: '0px 0px', transition: 'transform 1s ease-out' }}>
          
          {/* Roots underground */}
          {stage >= 0 && (
            <g opacity={Math.min(1, growthPercent / 10)}>
              <path
                d={`M0,0 Q-${rootLength * 0.8},${rootLength * 0.4} -${rootLength * 1.5},${rootLength * 0.8}`}
                fill="none" stroke="hsl(25, 40%, 25%)" strokeWidth={trunkWidth * 0.3} strokeLinecap="round"
                style={{ transition: 'all 1s ease-out' }}
              />
              <path
                d={`M0,0 Q${rootLength},${rootLength * 0.5} ${rootLength * 1.8},${rootLength * 0.9}`}
                fill="none" stroke="hsl(25, 40%, 22%)" strokeWidth={trunkWidth * 0.25} strokeLinecap="round"
                style={{ transition: 'all 1s ease-out' }}
              />
              <path
                d={`M0,0 Q${rootLength * 0.2},${rootLength * 0.8} -${rootLength * 0.5},${rootLength * 1.2}`}
                fill="none" stroke="hsl(25, 40%, 28%)" strokeWidth={trunkWidth * 0.2} strokeLinecap="round"
                style={{ transition: 'all 1s ease-out' }}
              />
            </g>
          )}

          {/* Seed */}
          {stage === 0 && (
            <ellipse cx="0" cy="15" rx="12" ry="8" fill="hsl(25, 50%, 35%)" style={{ transition: 'all 0.5s ease-out' }} />
          )}

          {/* Trunk & Main Branches */}
          {stage >= 1 && (
            <g style={{ transition: 'all 0.8s ease-out' }}>
              {/* Main wide trunk typical of banyan */}
              <path
                d={`M-${trunkWidth/2},0 L${trunkWidth/2},0 L${trunkWidth*0.4},-${trunkHeight*0.8} L-${trunkWidth*0.4},-${trunkHeight*0.8} Z`}
                fill="hsl(25, 35%, 25%)"
              />
              {/* Left Branch */}
              <path
                d={`M-${trunkWidth*0.3},-${trunkHeight*0.6} Q-100,-${trunkHeight*0.7} -150,-${trunkHeight*0.9}`}
                fill="none" stroke="hsl(25, 35%, 25%)" strokeWidth={Math.max(4, trunkWidth * 0.6)} strokeLinecap="round"
              />
              {/* Right Branch */}
              <path
                d={`M${trunkWidth*0.3},-${trunkHeight*0.6} Q90,-${trunkHeight*0.75} 140,-${trunkHeight*0.85}`}
                fill="none" stroke="hsl(25, 35%, 25%)" strokeWidth={Math.max(4, trunkWidth * 0.5)} strokeLinecap="round"
              />
              {/* Center Branch */}
              <path
                d={`M0,-${trunkHeight*0.7} Q20,-${trunkHeight*0.9} 0,-${trunkHeight*1.1}`}
                fill="none" stroke="hsl(25, 35%, 25%)" strokeWidth={Math.max(4, trunkWidth * 0.4)} strokeLinecap="round"
              />
            </g>
          )}

          {/* Aerial Roots */}
          {stage >= 4 && (
            <g style={{ transition: 'all 1s ease-out' }}>
              {aerialRoots.map((root, i) => (
                <path
                  key={`root-${i}`}
                  d={`M${root.x},${root.startY} Q${root.x + (i%2===0?5:-5)},${root.startY + root.length*0.5} ${root.x},${root.startY + root.length}`}
                  fill="none"
                  stroke="hsl(25, 40%, 30%)"
                  strokeWidth={2 + (i % 3)}
                  strokeLinecap="round"
                  opacity={0.8}
                />
              ))}
            </g>
          )}

          {/* Canopy */}
          {canopyScale > 0 && (
            <g
              style={{
                transform: `scale(${canopyScale})`,
                transformOrigin: `0px ${-trunkHeight}px`,
                transition: 'transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)' // bouncier growth
              }}
            >
              {leaves.map((leaf, i) => (
                <ellipse
                  key={i}
                  cx={leaf.x}
                  cy={leaf.y}
                  rx={leaf.size}
                  ry={leaf.size * 0.7}
                  fill={`hsl(${leaf.hue}, ${50 + (i%20)}%, ${leaf.lightness}%)`}
                  opacity={0.9}
                  className="animate-leaf-appear mix-blend-multiply"
                  style={{ animationDelay: `${leaf.delay}s` }}
                />
              ))}
              
              {/* Event Name Text Overlay in the middle of canopy */}
              {eventName && growthPercent > 30 && (
                <text
                  x="0"
                  y={-trunkHeight - 40}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.95)"
                  className="font-display font-bold mix-blend-overlay drop-shadow-lg"
                  style={{ 
                    fontSize: `${16 + growthPercent * 0.3}px`,
                    opacity: (growthPercent - 30) / 40, // Fade in
                    transition: 'opacity 1s ease',
                    letterSpacing: '0.05em'
                  }}
                >
                  {eventName}
                </text>
              )}
            </g>
          )}

          {/* Pulse effect on contribute */}
          {isPulsing && (
            <circle
              cx="0" cy="0" r="15" fill="none" stroke="hsl(43, 96%, 60%)" strokeWidth="3"
              className="animate-pulse-grow"
            />
          )}
        </g>
      </svg>
    </div>
  );
};

export default TreeVisualization;
