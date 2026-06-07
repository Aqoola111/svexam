"use client";

import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";

import { listMovies } from "@/actions/movies";
import type { Movie } from "@/app/generated/prisma/client";
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MovieSort = "asc" | "desc";

const AllMoviesContent = () => {
  const [sort, setSort] = useState<MovieSort>("desc");
  const [movies, setMovies] = useState<Movie[]>([]);

  const { execute, isExecuting } = useAction(listMovies, {
    onSuccess: (res) => {
      setMovies(res.data?.movies ?? []);
    },
    onError: () => {
      setMovies([]);
    },
  });

  useEffect(() => {
    execute({ sort });
  }, [sort, execute]);

  const movieCountLabel =
    movies.length === 1 ? "1 movie" : `${movies.length} movies`;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">All Movies</h1>
          <p className="text-muted-foreground">{movieCountLabel}</p>
        </div>

        <Select
          value={sort}
          onValueChange={(value) => setSort(value as MovieSort)}
        >
          <SelectTrigger size="sm" aria-label="Sort by date added">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isExecuting && movies.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDeleted={() => execute({ sort })}
            />
          ))}
        </div>
      ) : !isExecuting ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-muted-foreground">No movies yet</p>
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/add-movie">Add Movie</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AllMoviesContent;
