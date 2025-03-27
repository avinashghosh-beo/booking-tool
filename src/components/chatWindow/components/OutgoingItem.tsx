import React from "react";

const OutgoingItem = ({ data }) => {
  return (
    <div className="flex items-start justify-end w-full gap-2 px-4 pb-4 mb-4">
      <div className="grid gap-2 justify-items-end">
        <div className="px-4 py-2 text-white rounded-lg bg-primary-600 w-max">
          <p className="">{data.text}</p>
        </div>
      </div>
      <div className="rounded-lg size-8 bg-primary-200"></div>
    </div>
  );
};

export default OutgoingItem;
