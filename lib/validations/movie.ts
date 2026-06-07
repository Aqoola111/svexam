import { z } from "zod";

import { MOVIE_GENRES, type MovieGenre } from "@/lib/movie-genres";

export const addMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(20, "Title must be at most 20 characters"),
  genre: z
    .string()
    .min(1, "Genre is required")
    .refine((value): value is MovieGenre =>
      MOVIE_GENRES.includes(value as MovieGenre)
    ),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be at most 200 characters"),
});

export type AddMovieInput = z.input<typeof addMovieSchema>;
export type AddMovieValues = z.output<typeof addMovieSchema>;
