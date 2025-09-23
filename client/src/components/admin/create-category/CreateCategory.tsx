import { useEffect, useState } from "react";
import useCategoryStore from "../../../store/categoryStore";
import { RiDeleteBin5Line } from "react-icons/ri";
import Button from "../../shared/button/Button";
import toast from "react-hot-toast";
import CategoryService from "../../../http/services/CategryService";
import SkeletonCreateCategory from "./SkeletonCreateCategory";

const CreateCategory = () => {
  const [name, setName] = useState<string>("");
  const { categories, getAllCategories, loading } = useCategoryStore();

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const createCategory = async () => {
    try {
      await CategoryService.createCategory(name);
      toast.success("Категория добавлена");
      setName("");
      await getAllCategories();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Неизвестная ошибка");
      }
    }
  };
  const deleteCategory = async (id: number, name: string) => {
    try {
      if (
        window.confirm(
          `Вы децствительно хотите удалить категорию ${name} и все ее содержимое?`
        )
      ) {
        await CategoryService.deleteCategory(id);
        toast.success("Категория удалена");
      }

      await getAllCategories();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Неизвестная ошибка");
      }
    }
  };

  return (
    <section className=" w-1/2 mx-auto mt-5 ">
      <div className="flex gap-1 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full  rounded-lg px-2  border border-orange-500 outline-none"
          type="text"
          placeholder="Введите название категории"
        />
        <Button
          onClick={createCategory}
          className="font-medium text-orange-500 border border-orange-500"
        >
          Добавить
        </Button>
      </div>
      {loading
        ? [...Array(4)].map((_, index) => (
            <SkeletonCreateCategory key={index} />
          ))
        : categories &&
          categories.length > 0 &&
          categories.map(({ id, name, _count }) => (
            <div className="flex items-center mb-2">
              <div className="mr-1">{name}</div>
              <span className=" mt-2  border-b border-dashed border-black max-w-full w-full"></span>
              <div className="flex items-center text-sm font-medium">
                <div className="w-[60px] text-right ">Кол-во: </div>
                <div className="mx-1">
                  {_count.products}
                  <span className="text-[12px]">шт</span>
                </div>
                <RiDeleteBin5Line
                  onClick={() => deleteCategory(id, name)}
                  className="cursor-pointer hover:scale-125"
                />
              </div>
            </div>
          ))}
    </section>
  );
};

export default CreateCategory;
