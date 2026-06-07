import AddMovieForm from "@/components/add-movie-form";

const AddMoviePage = () => {
  return (
    <div className="flex w-full flex-1 flex-col">
      <h1 className="shrink-0 font-heading text-2xl font-semibold">Add Movie</h1>
      <AddMovieForm />
    </div>
  );
};

export default AddMoviePage;
