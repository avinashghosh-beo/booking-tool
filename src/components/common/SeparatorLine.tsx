import React from "react";

interface SeparatorLineProps {
  containerStyles?: string;
  middleText?: string;
  paddingY?: number;
  colorScheme?: string;
}

const SeparatorLine: React.FC<SeparatorLineProps> = ({
  containerStyles = "",
  middleText = "",
  paddingY = 4,
  colorScheme = "gray",
}) => {
  return (
    <div
      className={`flex items-center gap-4 py-${paddingY} ${containerStyles}`}
    >
      {middleText ? (
        <>
          <hr className={`flex-grow border-t border-${colorScheme}-200`} />
          <span className={`text-${colorScheme}-500`}>{middleText}</span>
          <hr className={`flex-grow border-t border-${colorScheme}-200`} />
        </>
      ) : (
        <>
          <hr className={`flex-grow border-t border-${colorScheme}-200`} />
        </>
      )}
    </div>
  );
};

export default SeparatorLine;
