import React, { FC } from "react";
import cn from "clsx";

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
  // onClick?: () => void;
  // disabled?: boolean;
  // type?: "submit" | "reset" | "button";
} & React.ComponentPropsWithoutRef<"button">;
const Button: FC<ButtonProps> = ({
  loading,
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        `rounded-[18px] pt-[10px] pb-[10px] px-[22px] relative ${
          loading ? "bg-gray-400 text-gray-400" : " bg-orange-500 text-white"
        }  font-bold `,
        className
        // { "bg-gray-400 text-gray-400": loading }
      )}
    >
      {children}
      {loading && (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <div className="loader"></div>
        </div>
      )}
    </button>
  );
};

export default Button;
