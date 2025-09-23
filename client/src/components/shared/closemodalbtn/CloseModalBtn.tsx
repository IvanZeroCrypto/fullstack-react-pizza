import { RiCloseLargeLine } from "react-icons/ri";
import cn from "clsx";
interface ICloseModalBtnProps {
  className?: string;
  onClick?: () => void;
}

const CloseModalBtn = ({ onClick, className }: ICloseModalBtnProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        " absolute cursor-pointer text-black sm:text-white   ",
        className
      )}
    >
      <RiCloseLargeLine size={30} />
    </button>
  );
};

export default CloseModalBtn;
