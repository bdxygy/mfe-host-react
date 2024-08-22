import React from "react";
import { NavLink } from "react-router-dom";
import * as styles from "./Navbar.scss";

export function Navbar() {
  return (
    <nav className={styles.container}>
      <NavLink className={styles.item__link} to="/">
        Home
      </NavLink>
      <NavLink className={styles.item__link} to="/about">
        About
      </NavLink>
    </nav>
  );
}

export default Navbar;
