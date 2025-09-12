import CircularButton from "../CircularButton";
import QuickStartIcon from "../../icons/QuickStartIcon";
import NextIcon from "../../icons/NextIcon";

interface StateButtonsProps {
  sessionCreateState: "name" | "stoody" | "shortBreak" | "longBreak" | "cycles" | "cached";
  handleNextClick: () => void;
  handleStartSession: () => void;
}

export default function RightButton({ sessionCreateState, handleNextClick, handleStartSession }: StateButtonsProps) {
  return (
    <>
      {(sessionCreateState === "name"
        || sessionCreateState === "stoody"
        || sessionCreateState === "shortBreak"
        || sessionCreateState === "longBreak") && (
        <>
          <CircularButton
            icon={<NextIcon />}
            onClick={handleNextClick}
            gradient="from-[#C18FFF] to-[#a770ff]"
            shadow="8054c7"
            title="Next"
          />
        </>
      )}

      {sessionCreateState === "cycles" && (
        <>
          <CircularButton 
            icon={<QuickStartIcon />}
            onClick={handleStartSession}
            gradient="from-[#00C2FF] to-[#0077FF]"
            shadow="005bb5"
            title="Let's Stoody!"
          />
        </>
      )}
     </>
    )
}