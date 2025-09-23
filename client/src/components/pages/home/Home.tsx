import "../../../index.css";
import { useCallback, useEffect, useState } from "react";
import AccessCheck from "../../access-check/AccessCheck";
import SkeletonCardProduct from "../../skeletons/SkeletonCardProduct";
import ProductsList from "../../ProductsList/ProductsList";
import useCartStores from "../../../store/cartStores";
import useProductsStore from "../../../store/productsStore";
import Container from "../../shared/Container";
import CartModal from "../../cartmodal/CartModal";
import Categories from "../../categories/Categories";
//

function Home() {
  const [activeCart, setActiveCart] = useState<boolean>(false);
  const [active] = useState<boolean>(false);
  const { productsList, getAllProducts, isLoading } = useProductsStore();
  const { fetchBasket } = useCartStores();

  const openCart = useCallback(() => {
    setActiveCart(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeCart = useCallback(() => {
    setActiveCart(false);
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    getAllProducts();
    fetchBasket();
  }, [getAllProducts, fetchBasket]);

  return (
    <Container>
      <CartModal activeCart={activeCart} closeCart={closeCart} />
      <Categories openCart={openCart} />
      <AccessCheck active={active} />
      <div className="flex flex-col gap-10">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <SkeletonCardProduct />
              </div>
            ))
          : productsList.map((product) => (
              <ProductsList
                key={product.id}
                items={product.products}
                title={product.name}
              />
            ))}
      </div>
    </Container>
  );
}

export default Home;
