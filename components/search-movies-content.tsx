"use client";

import { useAction } from "next-safe-action/hooks";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { searchMovies } from "@/actions/movies";
import type { Movie } from "@/app/generated/prisma/client";
import MovieCard from "@/components/movie-card";
import { Input } from "@/components/ui/input";
import { getActionData } from "@/lib/action-utils";

const DEBOUNCE_MS = 300;

const SearchMoviesContent = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const { executeAsync, isExecuting } = useAction(searchMovies);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    if (!debouncedQuery.trim()) {
      setMovies([]);
      return;
    }

    executeAsync({ name: debouncedQuery })
      .then((result) => {
        if (cancelled) {
          return;
        }

        setMovies(getActionData(result)?.movies ?? []);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setMovies([]);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, executeAsync]);

  const hasSearchQuery = debouncedQuery.trim().length > 0;
  const resultLabel = movies.length === 1 ? "result" : "results";

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="shrink-0 space-y-5">
        <div className="space-y-1.5">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Search Movie
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Type a title to find movies in your watchlist.
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search by title"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search by title"
            maxLength={20}
            className="pl-9"
          />
        </div>

        {hasSearchQuery && !isExecuting ? (
          <p className="text-sm text-muted-foreground">
            {movies.length} {resultLabel} for &ldquo;{debouncedQuery}&rdquo;
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        {!hasSearchQuery ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Start typing to search
            </p>
          </div>
        ) : isExecuting ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">Searching...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onDeleted={() => {
                  executeAsync({ name: debouncedQuery }).then((result) => {
                    setMovies(getActionData(result)?.movies ?? []);
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">No movies found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMoviesContent;
