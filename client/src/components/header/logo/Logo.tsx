import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link data-testid="logo" to="/" className="flex gap-1">
      <img src="../../../../public/images/logo-pizza.svg" />
      <div className="w-[152px]">
        <div className="w-full text-center text-xl font-extrabold">
          ПорапоПицце
        </div>
        <div className="w-full text-center text-textLogo">
          вкусней уже некуда
        </div>
      </div>
    </Link>
  );
};

export default Logo;
