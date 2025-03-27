import React from "react";

const HeaderSection = () => {
  return <div className="flex items-center gap-2 px-4 pb-4 border-b w-[500px] border-primary-200  mb-8">
  <div className="rounded-lg size-10 bg-primary-200"></div>
  <div>
    <p className="font-semibold text-md">Company Name</p>
    <div className="inline-flex items-center justify-center gap-2">
      <div className="rounded-full bg-success-500 size-2"></div>
      <span className="text-xs text-gray-600">Online</span>
    </div>
  </div>
</div>;
};

export default HeaderSection;
