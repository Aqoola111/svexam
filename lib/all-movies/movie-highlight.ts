import type { Movie } from "@/app/generated/prisma/client";
import type { MovieCardHighlight } from "@/components/movie-card";
import { SPIN_RING_COLORS } from "@/lib/all-movies/constants";

type GetMovieHighlightParams = {
  movie: Movie;
  index: number;
  pickedId: string | null;
  isPicking: boolean;
  activeIndex: number | null;
  spinColorIndex: number;
};

export const getMovieHighlight = ({
  movie,
  index,
  pickedId,
  isPicking,
  activeIndex,
  spinColorIndex,
}: GetMovieHighlightParams): MovieCardHighlight | null => {
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
