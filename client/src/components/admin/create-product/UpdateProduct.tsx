import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/input/Input";
import TextArea from "../../shared/custom-textarea/TextArea";
import Button from "../../shared/button/Button";
import Select, { MultiValue } from "react-select";
import useIngredientsStore from "../../../store/ingredientsStore";
import ProductService from "../../../http/services/ProductService";
import toast from "react-hot-toast";
import SkeletonUpdateProduct from "../../skeletons/SkeletonUpdateProduct";

type TSelectIngredientsId = {
  value: number;
  label: string;
};

const UpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [selectTypePizza, setSelectTypePizza] = useState<string[]>([]);
  const [selectIngredientsId, setSelectIngredientsId] = useState<number[]>([]);
  const [nameProduct, setNameProduct] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [portion, setPortion] = useState("");
  const [image, setImage] = useState<File | string>();
  const [previewUrl, setPreviewUrl] = useState<null | string>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const { id } = useParams<string>();

  const { ingredients, getAllIngredients } = useIngredientsStore();

  useEffect(() => {
    getAllIngredients();
  }, [getAllIngredients]);

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

  useEffect(() => {
    setIsLoading(true);
    async function fetchByIdProduct() {
      try {
        const { data } = await ProductService.getProductById(id ? id : "");
        if (data) {
          setIsLoading(false);
          setNameProduct(data.name);
          setDescription(data.description);
          setPrice(data.price);
          setPortion(data.portion);
          setImage(data.image);
          setSelectTypePizza(data?.type?.map((v) => v));
          setSelectIngredientsId(
            data?.ingredients?.map((ingredient) => ingredient.id)
          );
        }
      } catch (error) {
        setIsLoading(false);
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
    fetchByIdProduct();
  }, []);

  const valueOptionsTypePizza = selectTypePizza.map((text, index) => ({
    value: index,
    label: text,
  }));

  const typePizza = [
    { value: 1, label: "Традиционное" },
    { value: 2, label: "Тонкое" },
  ];

  const options = typePizza.filter((v) => !selectTypePizza.includes(v.label));

  const optionsIngredients =
    ingredients &&
    ingredients.length > 0 &&
    ingredients.map(({ id, name }) => ({
      value: id,
      label: name,
    }));

  const optionsIngredientSelect =
    ingredients && ingredients.length > 0 && optionsIngredients
      ? optionsIngredients.filter(
          (ingredient) => !selectIngredientsId.includes(ingredient.value)
        )
      : undefined;

  const valueIngredientSelect =
    optionsIngredients && optionsIngredients.length > 0
      ? optionsIngredients.filter(({ value }) =>
          selectIngredientsId.includes(value)
        )
      : undefined;

  const handleTypePizza = (
    data: MultiValue<{ value: number; label: string }>
  ) => {
    setSelectTypePizza(data.map((v) => v.label));
  };

  const handleIngredientsPizza = (
    data: MultiValue<{ value: number; label: string }>
  ) => {
    setSelectIngredientsId(data?.map((v) => v.value));
  };
  const updateProduct = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      nameProduct && formData.append("name", nameProduct);
      description && formData.append("description", description);
      price && formData.append("price", price);
      image && formData.append("image", image);
      portion && formData.append("portion", portion);
      selectTypePizza &&
        formData.append("type", JSON.stringify(selectTypePizza));
      selectIngredientsId &&
        formData.append("ingredientsId", JSON.stringify(selectIngredientsId));

      const data = await ProductService.updateProduct(id ? id : "", formData);

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

  return (
    <section className=" w-1/2 mx-auto mt-5 mb-5 ">
      {isLoading ? (
        <SkeletonUpdateProduct />
      ) : (
        <div className="">
          <h1 className="font-medium">Обновление товара:</h1>
          <Input
            value={nameProduct}
            onChange={(e) => setNameProduct(e.target.value)}
            text={"Название"}
          />
          <TextArea
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            text="Описание"
          />
          {selectTypePizza.length > 0 ? (
            <div className="">
              <h3 className="text-sm mb-[2px] font-medium">
                Выберите типы для пиццы:
              </h3>
              <Select
                isMulti
                value={valueOptionsTypePizza}
                onChange={handleTypePizza}
                options={options}
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
            <div className=" justify-between">
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
                  onClick={() => inputFileRef?.current?.click()}
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
            <div className="p-3 mx-auto">
              <img
                width="200"
                src={
                  previewUrl !== null
                    ? previewUrl
                    : `http://localhost:5000${image}`
                }
              />
            </div>
          </div>
          {selectTypePizza.length > 0 && (
            <div className="">
              <h1 className="font-medium">
                Выберите ингредиенты которые будут доступны для добавления в
                пиццу:
              </h1>
              <Select
                isMulti
                value={valueIngredientSelect}
                onChange={handleIngredientsPizza}
                options={optionsIngredientSelect}
                placeholder="Выберите ингредиенты"
              />
            </div>
          )}

          <Button
            loading={isLoading}
            className=" w-full my-3 font-medium"
            onClick={updateProduct}
          >
            Обновить
          </Button>
        </div>
      )}
    </section>
  );
};

export default UpdateProduct;
