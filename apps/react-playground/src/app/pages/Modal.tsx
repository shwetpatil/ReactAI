export default function Modal() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "300px",
          position: "relative",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          ✖
        </button>

        <h2>Modal Title</h2>
        <p>This is a modal dialog.</p>
      </div>
    </div>
  );
}