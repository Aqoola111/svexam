"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { addMovieSchema } from "@/lib/validations/movie";

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
