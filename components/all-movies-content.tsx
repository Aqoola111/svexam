"use client";

import { useAction } from "next-safe-action/hooks";
import { DicesIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { listMovies } from "@/actions/movies";
import type { Movie } from "@/app/generated/prisma/client";
import MovieCard, { type MovieCardHighlight } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MovieSort = "asc" | "desc";

const SPIN_RING_COLORS = [
  "ring-red-500",
  "ring-orange-500",
  "ring-amber-500",
  "ring-lime-500",
  "ring-emerald-500",
  "ring-cyan-500",
  "ring-blue-500",
  "ring-violet-500",
  "ring-fuchsia-500",
  "ring-pink-500",
] as const;

const AllMoviesContent = () => {
  const [sort, setSort] = useState<MovieSort>("desc");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [spinColorIndex, setSpinColorIndex] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const pickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { execute, isExecuting } = useAction(listMovies, {
    onSuccess: (res) => {
      setMovies(res.data?.movies ?? []);
    },
    onError: () => {
      setMovies([]);
    },
  });

  const clearPickTimer = useCallback(() => {
    if (pickTimerRef.current) {
      clearTimeout(pickTimerRef.current);
      pickTimerRef.current = null;
    }
  }, []);

  const clearSelection = useCallback(() => {
    clearPickTimer();
    setIsPicking(false);
    setPickedId(null);
    setActiveIndex(null);
    setSpinColorIndex(0);
  }, [clearPickTimer]);

  useEffect(() => {
    execute({ sort });
  }, [sort, execute]);

  useEffect(() => {
    return () => clearPickTimer();
  }, [clearPickTimer]);

  const pickRandomMovie = () => {
    if (movies.length === 0 || isPicking) {
      return;
    }

    clearPickTimer();
    setIsPicking(true);
    setPickedId(null);

    const winnerIndex = Math.floor(Math.random() * movies.length);
    const totalSteps = movies.length * 3 + winnerIndex;
    let step = 0;

    const tick = () => {
      const currentIndex = step % movies.length;
      setActiveIndex(currentIndex);
      setSpinColorIndex(step % SPIN_RING_COLORS.length);
      step += 1;

      if (step > totalSteps) {
        const winner = movies[winnerIndex];
        setActiveIndex(winnerIndex);
        setPickedId(winner.id);
        setIsPicking(false);
        toast.success(`Picked: ${winner.title}`);
        return;
      }

      const progress = step / totalSteps;
      const delay = 70 + progress * progress * 350;

      pickTimerRef.current = setTimeout(tick, delay);
    };

    tick();
  };

  const getHighlight = (movie: Movie, index: number): MovieCardHighlight | null => {
    if (pickedId === movie.id) {
      return { variant: "selected" };
    }

    if (isPicking && activeIndex === index) {
      return {
        variant: "spinning",
        ringClass: SPIN_RING_COLORS[spinColorIndex],
      };
    }

    return null;
  };

  const handleDeleted = () => {
    if (pickedId) {
      clearSelection();
    }
    execute({ sort });
  };

  const movieCountLabel =
    movies.length === 1 ? "1 movie" : `${movies.length} movies`;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">All Movies</h1>
          <p className="text-muted-foreground">{movieCountLabel}</p>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {movies.length > 0 ? (
            <div className="flex h-9 w-full gap-2 sm:w-auto">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={pickRandomMovie}
                disabled={isPicking}
                className="h-9 min-w-0 flex-1 sm:flex-none"
              >
                <DicesIcon />
                {isPicking ? "Picking..." : "Pick Random Movie"}
              </Button>
              {pickedId ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={clearSelection}
                  className="h-9 shrink-0"
                >
                  <XIcon />
                  Clear
                </Button>
              ) : null}
            </div>
          ) : null}

          <Select
            value={sort}
            onValueChange={(value) => {
              clearSelection();
              setSort(value as MovieSort);
            }}
          >
            <SelectTrigger
              size="sm"
              aria-label="Sort by date added"
              className="h-9 w-full sm:w-auto"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isExecuting && movies.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              highlight={getHighlight(movie, index)}
              onDeleted={handleDeleted}
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
