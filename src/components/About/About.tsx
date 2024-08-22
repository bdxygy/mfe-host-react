import React from "react";
import * as styles from "./About.scss";

export function About() {
  return (
    <div className={styles.container}>
      <h1>About</h1>
      <img src="assets/profile.png" alt="Profile" />
    </div>
  );
}

export default About;
