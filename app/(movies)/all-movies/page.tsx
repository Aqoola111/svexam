import Link from "next/link";
import type { Movie } from "@/app/generated/prisma/client";
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const AllMoviesPage = async () => {
  const movies: Movie[] = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });

  const movieCountLabel =
    movies.length === 1 ? "1 movie" : `${movies.length} movies`;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="shrink-0 space-y-1">
        <h1 className="text-2xl font-semibold">All Movies</h1>
        <p className="text-muted-foreground">{movieCountLabel}</p>
      </div>

      {movies.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-muted-foreground">No movies yet</p>
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/add-movie">Add Movie</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMoviesPage;
