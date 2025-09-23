import React from "react";
import cn from "clsx";
const AccessCheck = ({ active }) => {
  return (
    <div
      className={cn(
        " fixed top-0 left-0 right-0   h-full bg-[#000000c3] z-50 flex justify-center items-center  pointer-events-auto",
        active ? " scale-100" : "scale-0"
      )}
    >
      <div className="bg-red-500 w-[200px] h-[300px] p-3 ">
        проверка авторизации
      </div>
    </div>
  );
};

export default AccessCheck;
