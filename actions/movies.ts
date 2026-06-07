"use server";

import { revalidatePath } from "next/cache";

import { generateMovieDescription } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import {
  addMovieSchema,
  deleteMovieSchema,
  generateDescriptionSchema,
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

    return { success: true };
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
