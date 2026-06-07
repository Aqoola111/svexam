import type { Movie } from "@/app/generated/prisma/client";
import MovieCard from "@/components/movie-card";
import prisma from "@/lib/prisma";

const AllMoviesPage = async () => {
  const movies: Movie[] = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });

  const movieCountLabel =
    movies.length === 1 ? "1 movie" : `${movies.length} movies`;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">All Movies</h1>
        <p className="text-muted-foreground">{movieCountLabel}</p>
      </div>

      {movies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No movies yet</p>
      )}
    </div>
  );
};

export default AllMoviesPage;
