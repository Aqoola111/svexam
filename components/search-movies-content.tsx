"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { searchMovies } from "@/actions/movies";
import type { Movie } from "@/app/generated/prisma/client";
import MovieCard from "@/components/movie-card";
import { Input } from "@/components/ui/input";

const DEBOUNCE_MS = 300;

const SearchMoviesContent = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const { execute, isExecuting } = useAction(searchMovies, {
    onSuccess: (res) => {
      setMovies(res.data?.movies ?? []);
    },
    onError: () => {
      setMovies([]);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setMovies([]);
      return;
    }

    execute({ name: debouncedQuery });
  }, [debouncedQuery, execute]);

  const hasSearchQuery = debouncedQuery.trim().length > 0;
  const resultLabel = movies.length === 1 ? "result" : "results";

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="shrink-0 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Search Movie</h1>
          <p className="text-muted-foreground">Search by title</p>
        </div>

        <Input
          type="search"
          placeholder="Search by title"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search by title"
          maxLength={20}
        />

        {hasSearchQuery && !isExecuting ? (
          <p className="text-muted-foreground">
            {movies.length} {resultLabel} for "{debouncedQuery}"
          </p>
        ) : null}
      </div>

      {hasSearchQuery && !isExecuting && movies.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDeleted={() => execute({ name: debouncedQuery })}
            />
          ))}
        </div>
      ) : hasSearchQuery && !isExecuting ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">No movies found</p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchMoviesContent;
