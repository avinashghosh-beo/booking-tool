import React from "react";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  colorScheme?: "primary" | "secondary";
  showProgressStatus?: boolean;
  progressStatusTrailingText?: string;
  statusPlacement?: "left" | "right" | "bottom" | "top"; // need to handle bottom and top positionings as per requirements
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  step,
  totalSteps,
  colorScheme = "primary",
  showProgressStatus = false,
  progressStatusTrailingText = "",
  statusPlacement = "right",
}) => {
  const colors = {
    primary: {
      highlight: "bg-primary-600",
      dimmed: "bg-primary-200",
      text: "text-primary-700",
    },
    secondary: {
      highlight: "bg-warning-600",
      dimmed: "bg-warning-200",
      text: "text-warning-700",
    },
  };

  const containerAlignment = {
    right: "flex",
    left: "flex flex-row-reverse",
    bottom: "flex flex-row-reverse", // Modify based on future requirements
    top: "flex flex-row-reverse", // Modify based on future requirements
  };

  return (
    <div
      className={`items-center w-full gap-x-4 ${containerAlignment[statusPlacement]}`}
    >
      <div className={`w-full h-2 rounded-full ${colors[colorScheme].dimmed}`}>
        <div
          id="progress-bar"
          className={`h-2 transition-all duration-300 ease-out rounded-full ${colors[colorScheme].highlight}`}
          style={{ width: `${(step * 100) / totalSteps}%` }}
        ></div>
      </div>
      {showProgressStatus && (
        <div className="flex items-center justify-between text-primary-600 shrink-0">
          <span className={`mr-2 font-bold ${colors[colorScheme].text}`}>
            {step}/{totalSteps}{" "}
          </span>{" "}
          {progressStatusTrailingText}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
