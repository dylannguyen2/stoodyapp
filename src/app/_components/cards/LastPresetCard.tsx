import React, { useEffect, useState } from "react";
import StoodyIcon from "../icons/StoodyIcon";
import ShortBreakIcon from "../icons/ShortBreakIcon";
import EditIcon from "../icons/EditIcon";
import StoodentIcon from "../icons/StoodentIcon";
import LongBreakIcon from "../icons/LongBreakIcon";
import CycleIcon from "../icons/CycleIcon";
import Button from "../inputs/Button";
interface LastPresetCardProps {
  name: string;
  stoody: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  onClick: () => void;
  onEdit: () => void;
  cardWidth: number;
}
export default function LastPresetCard({
  name,
  stoody,
  shortBreak,
  longBreak,
  cycles,
  onClick,
  onEdit,
  cardWidth,
}: LastPresetCardProps) {


  const cardHeight = 1/3 * cardWidth;
  const pad = 0.05 * cardWidth;
  const titleSize = 0.05 * cardWidth;
  const smallSize = 0.03 * cardWidth;
  const iconSize = 0.05 * cardWidth;
  const rowGap = 0.12 * cardHeight;

  const textStyle: React.CSSProperties = { fontSize: smallSize, color: "#374151" };
  const titleStyle: React.CSSProperties = { fontSize: titleSize, fontWeight: 600 };
  const iconWrapper: React.CSSProperties = { width: iconSize, height: iconSize, display: "inline-flex", alignItems: "center", justifyContent: "center" };

  const buttonWidth = 0.15 * cardWidth;

  return (
    <div
      style={{
        width: cardWidth,
        // height: cardHeight,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        border: "1px solid #E0E0E0",
        padding: pad,
        boxSizing: "border-box",
      }}
    >
      {/* Title + edit button container */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: rowGap, position: "relative" }}>
        <h1 style={titleStyle}>Last Used Preset</h1>

        <button
          aria-label="Edit preset"
          onClick={onEdit}
          style={{ position: "absolute", right: 0, padding: pad, color: "#4B5563", cursor: "pointer", background: "transparent", border: "none" }}
        >
          <EditIcon width={Math.round(iconSize*0.9)} height={Math.round(iconSize*0.9)} />
        </button>
      </div>

      {/* Name */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: rowGap, gap: 8, alignItems: "center" }}>
        <div style={iconWrapper}>
          <StoodentIcon width={iconSize} height={iconSize} />
        </div>
        <div style={{ ...textStyle }}>{name}</div>
      </div>

      {/* Details row */}
      <div style={{ display: "flex", flexDirection: "column", gap: rowGap, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: rowGap, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={iconWrapper}><StoodyIcon width={iconSize} height={iconSize} /></div>
            <span style={textStyle}>{stoody}-min</span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={iconWrapper}><ShortBreakIcon width={iconSize} height={iconSize} /></div>
            <span style={textStyle}>{shortBreak}-min</span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={iconWrapper}><LongBreakIcon width={iconSize} height={iconSize} /></div>
            <span style={textStyle}>{longBreak}-min</span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={iconWrapper}><CycleIcon width={iconSize} height={iconSize} /></div>
            <span style={textStyle}>{cycles} cycles</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: rowGap, display: "flex", justifyContent: "flex-end", width: '100%' }}>
        <div style={{ minWidth: 120 }}>
          <Button
            text="Quick Start"
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
