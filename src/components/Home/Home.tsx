import React from "react";
import * as styles from "./Home.scss";
import { useServer } from "../../shared/data-context";

export function Home() {
  const response = useServer("todos", () =>
    fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
      response.json()
    )
  );
  return (
    <>
      <h1 className={styles.container}>Home</h1>
      <ul>
        {response.ready &&
          response.data?.map((todo: any) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
      </ul>
    </>
  );
}

export default Home;
