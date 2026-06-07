import AddMovieForm from "@/components/add-movie-form";

const AddMoviePage = () => {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <h1 className="shrink-0 text-2xl font-semibold">Add Movie</h1>
      <AddMovieForm />
    </div>
  );
};

export default AddMoviePage;
