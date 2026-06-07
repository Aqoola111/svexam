import type { Metadata } from "next";
import SearchMoviesContent from "@/components/search-movies-content";

export const metadata: Metadata = {
  title: "Search Movie",
  description: "Search your watchlist by movie title.",
};

const SearchMoviesPage = () => {
  return (
    <SearchMoviesContent />
  );
};

export default SearchMoviesPage;
