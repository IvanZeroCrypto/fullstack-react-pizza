import React from "react";

const TextArea = ({ text, ...props }) => {
  return (
    <label>
      <h3 className="text-sm mb-[2px] font-medium">{text}:</h3>
      <textarea
        {...props}
        className="border border-[#EFEFEF] w-full px-5 py-2 rounded-xl resize-none  "
      ></textarea>
    </label>
  );
};

export default TextArea;
