import { useEffect, useRef } from "react";

interface VoiceWaveAnimationProps {
  isActive: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8", bar: "w-0.5", gap: "gap-0.5" },
  md: { container: "w-12 h-12", bar: "w-1", gap: "gap-1" },
  lg: { container: "w-20 h-20", bar: "w-1.5", gap: "gap-1.5" },
};

export function VoiceWaveAnimation({
  isActive,
  size = "md",
  className = "",
}: VoiceWaveAnimationProps) {
  const barsRef = useRef<HTMLDivElement[]>([]);
  const s = sizeMap[size];
  const barCount = size === "sm" ? 5 : size === "md" ? 7 : 11;

  useEffect(() => {
    if (!isActive) return;
    const bars = barsRef.current;
    let frame: number;
    let time = 0;

    const animate = () => {
      time += 0.05;
      bars.forEach((bar, i) => {
        if (!bar) return;
        const offset = i * 0.6;
        const height = Math.abs(Math.sin(time + offset)) * 0.7 + 0.3;
        const opacity = Math.abs(Math.sin(time + offset)) * 0.5 + 0.5;
        bar.style.transform = `scaleY(${height})`;
        bar.style.opacity = `${opacity}`;
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [isActive]);

  if (!isActive) {
    return (
      <div className={`flex items-center justify-center ${s.container} ${s.gap} ${className}`}>
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className={`${s.bar} rounded-full bg-muted-foreground/30`}
            style={{ height: `${30 + (i % 3) * 20}%`, transition: "all 0.3s ease" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${s.container} ${s.gap} ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) barsRef.current[i] = el;
          }}
          className={`${s.bar} rounded-full origin-center`}
          style={{
            height: "100%",
            background: "var(--gradient-hero)",
            transition: "transform 0.1s ease-out",
            transform: "scaleY(0.3)",
          }}
        />
      ))}
    </div>
  );
}

export function VoiceOrb({ isActive, className = "" }: { isActive: boolean; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {isActive && (
        <>
          <div
            className="absolute inset-0 rounded-full animate-pulse-ring bg-primary/20"
            style={{ animation: "pulse-ring 1.5s ease-out infinite" }}
          />
          <div
            className="absolute inset-2 rounded-full animate-pulse-ring bg-primary/15"
            style={{ animation: "pulse-ring 1.5s ease-out infinite 0.5s" }}
          />
        </>
      )}
      <div
        className={`relative w-16 h-16 rounded-full flex items-center justify-center ${isActive ? "animate-breathe" : ""}`}
        style={{
          background: isActive ? "var(--gradient-hero)" : "var(--gradient-sunset)",
          boxShadow: isActive ? "0 0 40px #d946ef/0.5" : "0 4px 24px -4px #f59e0b/0.4",
        }}
      >
        <VoiceWaveAnimation isActive={isActive} size="sm" />
      </div>
    </div>
  );
}
