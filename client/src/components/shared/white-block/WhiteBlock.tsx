import React, { FC } from "react";
import cn from "clsx";
interface IWhiteBlockProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const WhiteBlock: FC<IWhiteBlockProps> = ({ title, children, className }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl pt-[20px] pb-[20px] px-[25px] mb-10",
        className
      )}
    >
      <h1 className="font-bold text-lg mb-5">{title}</h1>
      {children}
    </div>
  );
};

export default WhiteBlock;
