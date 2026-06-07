"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { Movie } from "@/app/generated/prisma/client";
import { SPIN_RING_COLORS } from "@/lib/all-movies/constants";
import { getMovieHighlight } from "@/lib/all-movies/movie-highlight";

export const useRandomMoviePick = (movies: Movie[]) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [spinColorIndex, setSpinColorIndex] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const pickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pickSessionRef = useRef(0);

  const clearPickTimer = useCallback(() => {
    if (pickTimerRef.current) {
      clearTimeout(pickTimerRef.current);
      pickTimerRef.current = null;
    }
  }, []);

  const clearSelection = useCallback(() => {
    pickSessionRef.current += 1;
    clearPickTimer();
    setIsPicking(false);
    setPickedId(null);
    setActiveIndex(null);
    setSpinColorIndex(0);
  }, [clearPickTimer]);

  useEffect(() => {
    return () => clearPickTimer();
  }, [clearPickTimer]);

  const pickRandomMovie = useCallback(() => {
    if (movies.length === 0 || isPicking) {
      return;
    }

    const session = pickSessionRef.current + 1;
    pickSessionRef.current = session;
    clearPickTimer();
    setIsPicking(true);
    setPickedId(null);

    const snapshot = [...movies];
    const winnerIndex = Math.floor(Math.random() * snapshot.length);
    const totalSteps = snapshot.length * 3 + winnerIndex;
    let step = 0;

    const tick = () => {
      if (session !== pickSessionRef.current) {
        return;
      }

      const currentIndex = step % snapshot.length;
      setActiveIndex(currentIndex);
      setSpinColorIndex(step % SPIN_RING_COLORS.length);
      step += 1;

      if (step > totalSteps) {
        const winner = snapshot[winnerIndex];

        if (!winner || session !== pickSessionRef.current) {
          setIsPicking(false);
          return;
        }

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
  }, [clearPickTimer, isPicking, movies]);

  const getHighlight = useCallback(
    (movie: Movie, index: number) =>
      getMovieHighlight({
        movie,
        index,
        pickedId,
        isPicking,
        activeIndex,
        spinColorIndex,
      }),
    [activeIndex, isPicking, pickedId, spinColorIndex]
  );

  return {
    pickedId,
    isPicking,
    pickRandomMovie,
    clearSelection,
    getHighlight,
  };
};
