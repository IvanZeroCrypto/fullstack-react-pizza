import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import useCategoryStore from "../../../store/categoryStore";
import Select from "react-select";
import Input from "../../shared/input/Input";
import TextArea from "../../shared/custom-textarea/TextArea";
import useIngredientsStore from "../../../store/ingredientsStore";
import Button from "../../shared/button/Button";
import ProductService from "../../../http/services/ProductService";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import UpdateProduct from "./UpdateProduct";
import { ActionMeta, SingleValue, MultiValue } from "react-select";

export interface OptionInterface {
  value: string;
  label: string;
}

const CreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectCategory, setSelectCategory] =
    useState<OptionInterface | null>();
  const [selectTypePizza, setSelectTypePizza] = useState<string[]>([]);
  const [selectIngredientsId, setSelectIngredientsId] = useState<number[]>([]);
  const [nameProduct, setNameProduct] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [portion, setPortion] = useState("");
  const [image, setImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { categories, getAllCategories } = useCategoryStore();
  const { ingredients, getAllIngredients } = useIngredientsStore();

  useEffect(() => {
    getAllCategories();
    getAllIngredients();
  }, [getAllCategories, getAllIngredients]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const options: OptionInterface[] =
    categories?.map(({ id, name }) => ({
      value: id.toString(),
      label: name,
    })) || [];

  const optionsIngredients: OptionInterface[] =
    ingredients?.map(({ id, name }) => ({
      value: id.toString(),
      label: name,
    })) || [];

  const optionsTypePizza: OptionInterface[] = [
    { value: "1", label: "Традиционное" },
    { value: "2", label: "Тонкое" },
  ];

  const handleChange = (data: SingleValue<OptionInterface>) => {
    setSelectCategory(data);
  };

  const handleTypePizza = (data: MultiValue<OptionInterface>) => {
    setSelectTypePizza(data?.map((v) => v.label));
  };

  const handleIngredientsPizza = (data: MultiValue<OptionInterface>) => {
    setSelectIngredientsId(data.map((v) => parseInt(v.value)));
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setImage(file);
  };

  const addProduct = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      selectCategory && formData.append("categoryId", selectCategory?.value);
      nameProduct && formData.append("name", nameProduct);
      description && formData.append("description", description);
      price && formData.append("price", price);
      image && formData.append("image", image);
      portion && formData.append("portion", portion);
      selectTypePizza &&
        formData.append("type", JSON.stringify(selectTypePizza));
      selectIngredientsId &&
        formData.append("ingredientsId", JSON.stringify(selectIngredientsId));

      const data = await ProductService.createProduct(formData);

      if (data.status === 200) {
        setIsLoading(false);
        toast.success(data.data);
        setSelectTypePizza([]);
        setSelectIngredientsId([]);
        setNameProduct("");
        setDescription("");
        setPrice("");
        setPortion("");
        setPreviewUrl(null);
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Неизвестная ошибка");
      }
    }
  };

  const { id } = useParams();

  return (
    <>
      {!id ? (
        <section className=" w-1/2 mx-auto mt-5 mb-5 ">
          <div className="">
            <h1 className="font-medium">
              Выберите категорию в которую вы хотите добавить товар:
            </h1>

            <Select<OptionInterface>
              value={selectCategory}
              onChange={handleChange}
              options={options}
            />

            <Input
              value={nameProduct}
              onChange={(e) => setNameProduct(e.target.value)}
              text={"Название"}
            />
            <TextArea
              value={description}
              onChange={(e: {
                target: { value: React.SetStateAction<string> };
              }) => setDescription(e.target.value)}
              text="Описание"
            />
            {selectCategory?.label === "Пиццы" ? (
              <div className="">
                <h3 className="text-sm mb-[2px] font-medium">
                  Выберите типы для пиццы:
                </h3>
                <Select
                  isMulti
                  onChange={handleTypePizza}
                  options={optionsTypePizza}
                  placeholder="Выберите тип"
                />
              </div>
            ) : (
              <Input
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                text={"Введите информацию о порции"}
              />
            )}
            <div className="flex">
              <div className="justify-between">
                <Input
                  type="number"
                  text={"Цена"}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="">
                  <label className="text-sm mb-[2px] font-medium">
                    Выберите изображение:
                  </label>
                  <Button
                    className="border border-orange-500 w-full mt-1 text-orange-500 font-bold hover:bg-orange-500 hover:text-white hover:border-white"
                    onClick={() => inputFileRef.current?.click()}
                  >
                    Выбрать файл
                  </Button>
                </div>

                <input
                  ref={inputFileRef}
                  hidden
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="p-3">
                <img width="200" src={previewUrl ? previewUrl : ""} />
              </div>
            </div>

            {selectCategory?.label === "Пиццы" && (
              <div className="">
                <h1 className="font-medium">
                  Выберите ингредиенты которые вы хотите добавить в пиццу:
                </h1>
                <Select
                  isMulti
                  onChange={handleIngredientsPizza}
                  options={optionsIngredients}
                  placeholder="Выберите ингредиенты"
                />
              </div>
            )}

            <Button
              loading={isLoading}
              className=" w-full my-3 font-medium"
              onClick={addProduct}
            >
              Добавить
            </Button>
          </div>
        </section>
      ) : (
        <UpdateProduct />
      )}
    </>
  );
};

export default CreateProduct;
