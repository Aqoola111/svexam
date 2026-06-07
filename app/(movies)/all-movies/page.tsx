import type { Metadata } from "next";

import AllMoviesContent from "@/components/all-movies/all-movies-content";

export const metadata: Metadata = {
  title: "All Movies",
  description: "View every movie in your watchlist.",
};

const AllMoviesPage = () => {
  return <AllMoviesContent />;
};

export default AllMoviesPage;
