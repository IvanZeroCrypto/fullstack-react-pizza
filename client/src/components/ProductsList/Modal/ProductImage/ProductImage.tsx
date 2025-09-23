import { FC } from "react";
import cn from "clsx";

interface IProductImageProps {
  image: string;
  sizePizza: number;
}

const ProductImage: FC<IProductImageProps> = ({ image, sizePizza }) => {
  return (
    <div className="  transition ease-in  ml-auto mr-auto py-8  flex items-center justify-center">
      <img
        className={cn("duration-500 pl-5   md:z-50 top-5 ", {
          " w-[250px] h-[250px] md:w-[250px] md:h-[250px]  lg:w-[330px] lg:h-[330px]":
            sizePizza === 25,
          " w-[290px] h-[290px] md:w-[290px] md:h-[290px]   lg:w-[415px] lg:h-[415px]":
            sizePizza === 30,
          " w-[330px] h-[330px] md:w-[330px] md:h-[330px]  lg:w-[480px] lg:h-[480px]":
            sizePizza === 35,
        })}
        src={`http://localhost:5000${image}`}
      />
    </div>
  );
};

export default ProductImage;
