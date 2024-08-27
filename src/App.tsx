import React, { lazy, Suspense } from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { useServer } from "./shared/data-context";
import Home from "./components/Home/Home";

const Navbar = lazy(() => import("./components/Navbar/Navbar"));
const About = lazy(() => import("./components/About/About"));
// const Home = lazy(() => import("./components/Home/Home"));

export default function App() {
  const response = useServer("users", () =>
    fetch("https://jsonplaceholder.typicode.com/users").then((response) =>
      response.json()
    )
  );

  return (
    <>
      <Suspense fallback={<h1>Loading Navbar...</h1>}>
        <Navbar />
      </Suspense>
      <Routes>
        <Route
          path="/"
          element={
            // <Suspense fallback={<h1>Loading Home...</h1>}>
            <Home />
            // </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<h1>Loading About...</h1>}>
              <About />
            </Suspense>
          }
        />
      </Routes>
      <div>
        {response.ready &&
          response.data.map((user: any) => <h2 key={user.id}>{user.name}</h2>)}
      </div>
    </>
  );
}
