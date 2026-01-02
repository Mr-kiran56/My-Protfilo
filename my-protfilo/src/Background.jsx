import "./App.css";

function Background() {
  return (
    <>
      <div className="particles">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              "--size": `${20 + Math.random() * 80}px`,
              "--x": `${Math.random() * 100}%`,
              "--y": `${Math.random() * 100}%`,
              "--duration": `${12 + Math.random() * 18}s`,
              "--delay": `${Math.random() * 5}s`,
            }}
          ></span>
        ))}
      </div>
    </>
  );
}

export default Background;
