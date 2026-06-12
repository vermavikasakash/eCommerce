import React from "react";
import { NavLink } from "react-router-dom";
import { FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { useGlobalData } from "../../context/contextApiProvider";

const Header = () => {
  const { cartCount } = useGlobalData();

  return (
    <nav className="app-nav">
      <NavLink to="/" className="brand-link">
        <FiShoppingBag aria-hidden="true" />
        <span>Commerce Mesh</span>
      </NavLink>
      <div className="nav-actions">
        <NavLink to="/" className="nav-link">
          Products
        </NavLink>
        <NavLink to="/cart" className="nav-link cart-link">
          <FiShoppingCart aria-hidden="true" />
          <span>Cart</span>
          <strong>{cartCount}</strong>
        </NavLink>
      </div>
    </nav>
  );
};

export default Header;
