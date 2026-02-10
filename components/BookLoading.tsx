"use client";

export default function BookLoading() {
  return (
    <div className="empty-state" style={{ padding: "60px 20px" }}>
      <div style={{ marginBottom: "16px" }}>
        <div
          className="animate-book-flip"
          style={{
            width: "64px",
            height: "80px",
            margin: "0 auto",
            background: "linear-gradient(135deg, rgba(17,89,63,0.2) 0%, rgba(26,122,87,0.2) 100%)",
            borderRadius: "8px",
            border: "2px solid rgba(17,89,63,0.3)",
          }}
        />
      </div>
      <p style={{ color: "#666", fontSize: "14px" }}>책을 찾는 중...</p>
    </div>
  );
}
