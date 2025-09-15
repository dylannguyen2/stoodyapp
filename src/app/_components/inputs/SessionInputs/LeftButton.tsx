import BackIcon from "../../icons/BackIcon";
import QuickStartIcon from "../../icons/QuickStartIcon";
import CircularButton from "../CircularButton";

interface StateButtonsProps {
  sessionCreateState: "name" | "stoody" | "shortBreak" | "longBreak" | "cycles" | "cached";
  hasCachedPreset: boolean;
  handlePrevClick: () => void;
  handleStartSession: () => void;
  size: number;
  arrowIconSize: number;
}

export default function LeftButton({ sessionCreateState, hasCachedPreset, handlePrevClick, handleStartSession, size, arrowIconSize }: StateButtonsProps) {
  return (
    <>
      {(sessionCreateState === "name" && !hasCachedPreset) && (
        <>
          <CircularButton
            icon={<QuickStartIcon width={arrowIconSize} height={arrowIconSize} />}
            onClick={handleStartSession}
            gradient="from-[#00C2FF] to-[#0077FF]"
            shadow="005bb5"
            title="Quick Start"
            size={size}
          />
        </>
      )}
      {(((sessionCreateState === "name" && hasCachedPreset)
        || sessionCreateState === "stoody"
        || sessionCreateState === "shortBreak"
        || sessionCreateState === "longBreak")
        || sessionCreateState === "cycles") && (
        <>
          <CircularButton
            icon={<BackIcon width={arrowIconSize} height={arrowIconSize} />}
            onClick={handlePrevClick}
            gradient="from-[#C18FFF] to-[#a770ff]"
            shadow="8054c7"
            title="Back"
            size={size}
          />
        </>
      )}
     </>
    )
}