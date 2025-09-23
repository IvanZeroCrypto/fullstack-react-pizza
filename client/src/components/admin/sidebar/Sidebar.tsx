import { Link } from "react-router-dom";
import { navMenuAdmin } from "../../../../contans";

const Sidebar = () => {
  return (
    <div>
      <nav className="min-h-5 md:min-h-10  mt-2 flex">
        {navMenuAdmin?.map((item) => (
          <div className="">
            <Link
              className=" bg-orange-500 py-1  px-4 text-white font-medium md:font-bold "
              to={item.link}
            >
              {item.name}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
