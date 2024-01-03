import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IShopContext, ShopContext } from "../context/shop-context";
import { useCookies } from "react-cookie";
import "../assets/style.css";
import logo from "../assets/EI_Full_black BG.png";

export const Navbar = () => {
  const { availableMoney, isAuthenticated, setIsAuthenticated, username, setUsername } =
    useContext<IShopContext>(ShopContext);

  const logout = () => {
    setIsAuthenticated(false);
  };
  console.log(username)

  return (
    <div className="navbar">
      <div className="navbarTitle">
        <a href="/">
          <img src={logo} alt="Logo" className="logo" />
        </a>
      </div>
      <div className="navbarLinks">
        {isAuthenticated && (
          <>
            <Link to="/">Shop</Link>
            <Link to="/purchased-items">Purchases</Link>
            <Link to="/checkout">
              <MdOutlineShoppingCart />
            </Link>
            <Link to="/auth" onClick={logout}>
              Logout
            </Link>
            <span> £{availableMoney.toFixed(2)} </span>
            
            
          </>
        )}
      </div>
    </div>
  );
};
