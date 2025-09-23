import cn from "clsx";
import useStore from "../../store/store";
import CartBtnOpen from "./CartBtnOpen";
import { animated, useTrail } from "@react-spring/web";
import SkeletonItemCategory from "../skeletons/SkeletonItemCategory";
import React from "react";
import useCategoryStore from "../../store/categoryStore";
import useProductsStore from "../../store/productsStore";

interface ICategoriesProps {
  openCart?: () => void;
}

const Categories = React.memo(({ openCart }: ICategoriesProps) => {
  const activeId = useStore((state) => state.activeId);
  const { loading } = useCategoryStore();
  const { categoriesList } = useProductsStore();

  const updateActiveId = useStore((state) => state.updateActiveId);

  const trail = useTrail(categoriesList.length, {
    opacity: 1,
    transform: "translateX(0px) ",
    from: { opacity: 0, transform: "translateX(-20px)" },
    delay: 200,
  });

  return (
    <div className="flex mt-8 py-3 sticky z-10 top-0 bg-bgwhite50  items-center justify-between  flex-wrap wrap ">
      <div className="overflow-x-auto flex">
        {loading ? (
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonItemCategory key={index} />
            ))}
          </div>
        ) : (
          trail?.map((style, index) => {
            return (
              <animated.a
                data-testid="categories-list"
                style={style}
                href={`/#${categoriesList[index]}`}
                onClick={() => updateActiveId(index)}
                key={index}
                className={cn(
                  "mr-5 font-semibold hover:text-primary mb-2 sm:mb-0",
                  activeId === index && "text-primary"
                )}
              >
                {categoriesList[index]}
              </animated.a>
            );
          })
        )}
      </div>
      <CartBtnOpen openCart={openCart} />
    </div>
  );
  {
  }
});

export default Categories;
