import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 76px",
          background: "linear-gradient(125deg, #101a14 0%, #26382a 100%)",
          color: "#f0f0e5",
          fontFamily: "sans-serif",
          border: "2px solid #41533a",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 25, fontWeight: 700 }}>MARK HARVEY LEDUNA</div>
          <div style={{ fontSize: 18, letterSpacing: 3, color: "#caf274" }}>PORTFOLIO</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -4, lineHeight: 1.08 }}>
            Stories worth
          </div>
          <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -4, lineHeight: 1.08, color: "#caf274" }}>
            watching.
          </div>
          <div style={{ marginTop: 28, fontSize: 27, color: "#b7c1b4" }}>
            Video editing. AI production. Visual storytelling.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "1px solid #53624b",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <div>FROM AN IDEA TO THE FINAL FRAME</div>
          <div style={{ color: "#caf274" }}>EXPLORE MY WORK</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
