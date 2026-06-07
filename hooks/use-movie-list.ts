"use client";

import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useState } from "react";

import { listMovies } from "@/actions/movies";
import type { Movie } from "@/app/generated/prisma/client";
import type { MovieSort } from "@/lib/all-movies/types";
import { getActionData } from "@/lib/action-utils";

export const useMovieList = () => {
  const [sort, setSort] = useState<MovieSort>("desc");
  const [movies, setMovies] = useState<Movie[]>([]);

  const { executeAsync, isExecuting } = useAction(listMovies);

  const refetch = useCallback(async () => {
    const result = await executeAsync({ sort });
    setMovies(getActionData(result)?.movies ?? []);
  }, [executeAsync, sort]);

  useEffect(() => {
    let cancelled = false;

    executeAsync({ sort })
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
  }, [sort, executeAsync]);

  return {
    sort,
    setSort,
    movies,
    isExecuting,
    refetch,
  };
};
