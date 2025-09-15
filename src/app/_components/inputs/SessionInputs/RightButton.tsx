import CircularButton from "../CircularButton";
import QuickStartIcon from "../../icons/QuickStartIcon";
import NextIcon from "../../icons/NextIcon";

interface StateButtonsProps {
  sessionCreateState: "name" | "stoody" | "shortBreak" | "longBreak" | "cycles" | "cached";
  handleNextClick: () => void;
  handleStartSession: () => void;
  size: number;
  arrowIconSize: number;
}

export default function RightButton({ sessionCreateState, handleNextClick, handleStartSession, size, arrowIconSize }: StateButtonsProps) {
  return (
    <>
      {(sessionCreateState === "name"
        || sessionCreateState === "stoody"
        || sessionCreateState === "shortBreak"
        || sessionCreateState === "longBreak") && (
        <>
          <CircularButton
            icon={<NextIcon width={arrowIconSize} height={arrowIconSize}/>}
            onClick={handleNextClick}
            gradient="from-[#C18FFF] to-[#a770ff]"
            shadow="8054c7"
            title="Next"
            size={size}
          />
        </>
      )}

      {sessionCreateState === "cycles" && (
        <>
          <CircularButton 
            icon={<QuickStartIcon width={arrowIconSize} height={arrowIconSize}/>}
            onClick={handleStartSession}
            gradient="from-[#00C2FF] to-[#0077FF]"
            shadow="005bb5"
            title="Let's Stoody!"
            size={size}
          />
        </>
      )}
     </>
    )
}