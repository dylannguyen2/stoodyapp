import Button from "./Button";

interface StateButtonsProps {
  sessionCreateState: "name" | "stoody" | "shortBreak" | "longBreak" | "cycles" | "cached";
  hasCachedPreset: boolean;
  handlePrevClick: () => void;
  handleNextClick: () => void;
  handleStartSession: () => void;
}

export default function StateButtons({ sessionCreateState, hasCachedPreset, handlePrevClick, handleNextClick, handleStartSession }: StateButtonsProps) {
  return (
    <>
      {sessionCreateState === "name" && (
        <>
          {!hasCachedPreset ? (
            <Button
              text="Quick Start"
              onClick={handleStartSession}
              gradient="from-[#00C2FF] to-[#0077FF]"
              shadow="005bb5"
            />
          ) : (
            <Button
              text="Back"
              onClick={handlePrevClick}
              gradient="from-[#C18FFF] to-[#a770ff]"
              shadow="8054c7"
            />
          )}
          <Button
            text="Next"
            onClick={handleNextClick}
            gradient="from-[#C18FFF] to-[#a770ff]"
            shadow="8054c7"
          />
        </>
      )}
      {(sessionCreateState === "stoody" || sessionCreateState === "shortBreak" || sessionCreateState === "longBreak") && (
        <>
          <Button
            text="Back"
            onClick={handlePrevClick}
            gradient="from-[#C18FFF] to-[#a770ff]"
            shadow="8054c7"
          />
          <Button
            text="Next"
            onClick={handleNextClick}
            gradient="from-[#C18FFF] to-[#a770ff]"
            shadow="8054c7"
          />
        </>
      )}

      {sessionCreateState === "cycles" && (
        <>
        <Button
            text="Back"
            onClick={handlePrevClick}
            gradient="from-[#C18FFF] to-[#a770ff]"
            shadow="8054c7"
          />
        <Button 
          text="Quick Start"
          onClick={handleStartSession}
          gradient="from-[#00C2FF] to-[#0077FF]"
          shadow="005bb5"
        />
        </>
      )}
     </>
    )
}