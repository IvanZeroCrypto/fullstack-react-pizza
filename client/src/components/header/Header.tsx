import useAuthStore from "../../store/authStore";
import useCartStores from "../../store/cartStores";
import Button from "../shared/button/Button";
import Container from "../shared/Container";
import Logo from "./logo/Logo";
import { Link } from "react-router-dom";
import SkeletonBtnHeader from "../skeletons/SkeletonBtnHeader";

const Header = () => {
  const { isAuth, logout, isAdmin, isLoading } = useAuthStore();
  const { clearBasket } = useCartStores();

  const handleLogout = async () => {
    try {
      if (window.confirm("Вы действительно хотите выйти из системы")) {
        await logout();
        clearBasket();
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Container className="pt-5 pb-5  border-b border-[#EDEDED]  ">
      <div className="flex justify-between items-center">
        <Logo />
        {isLoading ? (
          <SkeletonBtnHeader />
        ) : (
          <div data-testid="header" className="flex items-center gap-1">
            {isAdmin && (
              <Link to="/admin">
                <Button className="bg-orange-500 text-white font-bold hover:bg-white hover:text-black hover:font-medium hover:border border-orange-500">
                  Админ панель
                </Button>
              </Link>
            )}
            {isAuth && window.localStorage.getItem("token") ? (
              <Button
                className="bg-orange-500 text-white font-bold hover:bg-white hover:text-black hover:font-medium hover:border border-orange-500"
                onClick={handleLogout}
              >
                Выйти
              </Button>
            ) : (
              <Link to="/login">
                <Button className="bg-orange-500 text-white font-bold hover:bg-white hover:text-black hover:font-medium hover:border border-orange-500">
                  Войти
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Header;
