import cn from "clsx";
import { RiDeleteBin6Line } from "react-icons/ri";
interface IDeleteBtnProps {
  className: string;
  onClick: () => void;
}

const DeleteBtn = ({ onClick, className }: IDeleteBtnProps) => {
  return (
    <button
      data-testid="delete-btn"
      type="button"
      onClick={onClick}
      className={cn(className)}
    >
      <RiDeleteBin6Line />
    </button>
  );
};

export default DeleteBtn;
