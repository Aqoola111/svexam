"use client";

import type { Movie } from "@/app/generated/prisma/client";
import MovieCard, { type MovieCardHighlight } from "@/components/movie-card";

type AllMoviesMovieGridProps = {
  movies: Movie[];
  getHighlight: (movie: Movie, index: number) => MovieCardHighlight | null;
  onDeleted: () => void;
};

const AllMoviesMovieGrid = ({
  movies,
  getHighlight,
  onDeleted,
}: AllMoviesMovieGridProps) => {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          highlight={getHighlight(movie, index)}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
};

export default AllMoviesMovieGrid;
