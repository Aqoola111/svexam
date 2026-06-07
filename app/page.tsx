"use client";

import { useEffect, useState } from "react";

const Home = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <main>{message}</main>
  );
};

export default Home;
