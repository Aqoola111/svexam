"use server";

import { revalidatePath } from "next/cache";

import { generateMovieDescription } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import {
  addMovieSchema,
  deleteMovieSchema,
  generateDescriptionSchema,
  listMoviesSchema,
  searchMoviesSchema,
} from "@/lib/validations/movie";

export const addMovie = actionClient
  .inputSchema(addMovieSchema)
  .action(async ({ parsedInput }) => {
    const movie = await prisma.movie.create({
      data: {
        title: parsedInput.title,
        genre: parsedInput.genre,
        description: parsedInput.description,
      },
    });

    revalidatePath("/all-movies");

    return { movie };
  });

export const deleteMovie = actionClient
  .inputSchema(deleteMovieSchema)
  .action(async ({ parsedInput }) => {
    const existingMovie = await prisma.movie.findUnique({
      where: { id: parsedInput.id },
    });

    if (!existingMovie) {
      throw new Error("This movie no longer exists.");
    }

    await prisma.movie.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/all-movies");
    revalidatePath("/search-movies");

    return { success: true };
  });

export const listMovies = actionClient
  .inputSchema(listMoviesSchema)
  .action(async ({ parsedInput }) => {
    const movies = await prisma.movie.findMany({
      orderBy: { createdAt: parsedInput.sort },
    });

    return { movies };
  });

export const searchMovies = actionClient
  .inputSchema(searchMoviesSchema)
  .action(async ({ parsedInput }) => {
    const name = parsedInput.name?.trim();

    const movies = await prisma.movie.findMany({
      where: name
        ? {
            title: {
              contains: name,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return { movies };
  });

export const generateDescription = actionClient
  .inputSchema(generateDescriptionSchema)
  .action(async ({ parsedInput }) => {
    const description = await generateMovieDescription(
      parsedInput.title,
      parsedInput.genre
    );

    return { description };
  });
