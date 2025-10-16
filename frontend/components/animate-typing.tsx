export const AnimatedTyping = () => {
  return (
    <>
      <style>{`
        @keyframes ext-typing-dot {
          0% { transform: translateY(0); opacity: 0.35 }
          30% { transform: translateY(-4px); opacity: 1 }
          60% { transform: translateY(0); opacity: 0.65 }
          100% { transform: translateY(0); opacity: 0.35 }
        }
      `}</style>

      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#ffffff",
          opacity: 0.35,
          display: "inline-block",
          animation: "ext-typing-dot 1s infinite",
          animationTimingFunction: "ease-in-out",
        }}
      />
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#ffffff",
          opacity: 0.35,
          display: "inline-block",
          animation: "ext-typing-dot 1s infinite",
          animationTimingFunction: "ease-in-out",
          animationDelay: "0.15s",
        }}
      />
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#ffffff",
          opacity: 0.35,
          display: "inline-block",
          animation: "ext-typing-dot 1s infinite",
          animationTimingFunction: "ease-in-out",
          animationDelay: "0.30s",
        }}
      />
    </>
  );
};
