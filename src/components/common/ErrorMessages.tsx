import React, { useMemo } from "react";
import { GhostAccordion } from "./Accordion";

interface ErrorMessagesProps {
  errors: string[];
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errors }) => {
  const filteredArray = useMemo(() => {
    let result = errors.filter((item) => typeof item === "string");
    return result;
  }, [errors]);

  return (
    <GhostAccordion open={filteredArray.length !== 0}>
      {filteredArray.map((item, index) => (
        <div key={index} className="text-danger-500">
          *{item}
        </div>
      ))}
    </GhostAccordion>
  );
};

export default ErrorMessages;
