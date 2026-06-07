import type { Metadata } from "next";
import AddMovieForm from "@/components/add-movie-form";

export const metadata: Metadata = {
  title: "Add Movie",
  description: "Add a new movie to your watchlist with optional AI descriptions.",
};

const AddMoviePage = () => {
  return (
    <div className="flex w-full flex-1 flex-col">
      <h1 className="shrink-0 font-heading text-2xl font-semibold">Add Movie</h1>
      <AddMovieForm />
    </div>
  );
};

export default AddMoviePage;
