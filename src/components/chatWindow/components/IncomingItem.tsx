import React from "react";

const IncomingItem = ({ data }) => {
  return (
    <div className="flex items-start w-full gap-2 px-4 pb-4 mb-4">
      <div className="rounded-lg size-8 bg-primary-200"></div>
      <div className="grid gap-2">
        <div className="px-4 py-2 rounded-lg bg-primary-100 w-max">
          <p className="">{data.text}</p>
        </div>
      </div>
    </div>
  );
};

export default IncomingItem;
