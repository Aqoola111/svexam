"use client";

import AllMoviesEmptyState from "@/components/all-movies/all-movies-empty-state";
import AllMoviesMovieGrid from "@/components/all-movies/all-movies-movie-grid";
import AllMoviesToolbar from "@/components/all-movies/all-movies-toolbar";
import { useMovieList } from "@/hooks/use-movie-list";
import { useRandomMoviePick } from "@/hooks/use-random-movie-pick";
import { getMovieCountLabel } from "@/lib/all-movies/movie-count-label";
import type { MovieSort } from "@/lib/all-movies/types";

const AllMoviesContent = () => {
  const { sort, setSort, movies, isExecuting, refetch } = useMovieList();
  const {
    pickedId,
    isPicking,
    pickRandomMovie,
    clearSelection,
    getHighlight,
  } = useRandomMoviePick(movies);

  const handleSortChange = (value: MovieSort) => {
    clearSelection();
    setSort(value);
  };

  const handleDeleted = () => {
    if (pickedId) {
      clearSelection();
    }

    void refetch();
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">All Movies</h1>
          <p className="text-muted-foreground">
            {getMovieCountLabel(movies.length)}
          </p>
        </div>

        <AllMoviesToolbar
          hasMovies={movies.length > 0}
          sort={sort}
          isPicking={isPicking}
          pickedId={pickedId}
          onSortChange={handleSortChange}
          onPickRandom={pickRandomMovie}
          onClearPick={clearSelection}
        />
      </div>

      {!isExecuting && movies.length > 0 ? (
        <AllMoviesMovieGrid
          movies={movies}
          getHighlight={getHighlight}
          onDeleted={handleDeleted}
        />
      ) : isExecuting ? (
        <div className="mt-6 flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading movies...</p>
        </div>
      ) : (
        <AllMoviesEmptyState />
      )}
    </div>
  );
};

export default AllMoviesContent;
