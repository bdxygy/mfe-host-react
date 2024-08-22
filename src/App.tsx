import React, { lazy, Suspense } from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";

const Navbar = lazy(() => import("./components/Navbar/Navbar"));
const About = lazy(() => import("remote_basic/about"));
const Home = lazy(() => import("./components/Home/Home"));

export default function App() {
  return (
    <>
      <Suspense fallback={<h1>Loading Navbar...</h1>}>
        <Navbar />
      </Suspense>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<h1>Loading Home...</h1>}>
              <Home />
            </Suspense>
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
    </>
  );
}
