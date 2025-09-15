import React, { useEffect, useState } from "react";
import Button from "../inputs/Button";

export default function FreshStartCard({
  onClick,
  cardWidth,
}: {
  onClick: () => void;
  cardWidth: number;
}) {
  const pad = Math.round(cardWidth * 0.04);
  const gap = Math.round(cardWidth * 0.035);

  const titleSize = 0.05 * cardWidth;
  const smallSize = 0.03 * cardWidth;
  const imgWidth = Math.round(cardWidth * 0.25);
  const imgMarginTop = Math.round(cardWidth * 0.01);

  const buttonWidth = 0.15 * cardWidth;

  return (
    <div
      style={{
        width: cardWidth,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        border: "1px solid #E0E0E0",
        padding: pad,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: gap,
        }}
      >
        <h1 style={{ fontSize: titleSize, fontWeight: 600, margin: 0 }}>Start Fresh</h1>
        <h2
          style={{
            fontSize: smallSize,
            margin: 0,
            fontFamily: "Gochi Hand, system-ui, sans-serif",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Create a new stoody session from scratch
        </h2>

        <img
          src="/plant.png"
          alt="Fresh Start Illustration"
          style={{ width: imgWidth, marginTop: imgMarginTop, display: "block" }}
        />
      </div>

      <div style={{ marginTop: Math.round(gap * 0.5), display: "flex", justifyContent: "flex-end", width: '100%' }}>
        <div style={{ minWidth: 120 }}>
          <Button
            text="Customise!"
            onClick={onClick}
            gradient="from-[#00C2FF] to-[#0077FF]"
            shadow="005bb5"
            width={buttonWidth}
          />
        </div>
      </div>
    </div>
  );
}