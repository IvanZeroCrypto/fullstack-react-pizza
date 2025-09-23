import React, { FC } from "react";
import cn from "clsx";
interface IContainerProps {
  children?: React.ReactNode;
  className?: string;
}

const Container: FC<IContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("container max-w-[1200px] px-5 mx-auto", className)}>
      {children}
    </div>
  );
};

export default Container;
