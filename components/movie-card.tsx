"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import type { Movie } from "@/app/generated/prisma/client";
import { deleteMovie } from "@/actions/movies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MovieCardProps = {
  movie: Movie;
};

const MovieCard = ({ movie }: MovieCardProps) => {
  const { execute, isExecuting } = useAction(deleteMovie, {
    onSuccess: () => {
      toast.success("Movie deleted successfully");
    },
    onError: ({ error }) => {
      toast.error(
        typeof error.serverError === "string"
          ? error.serverError
          : "Unable to delete movie. Please try again."
      );
    },
  });

  const handleDelete = () => {
    execute({ id: movie.id });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
        <Badge variant="secondary">{movie.genre}</Badge>
      </CardHeader>
      <CardContent>
        <CardDescription>{movie.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isExecuting}
        >
          {isExecuting ? "Deleting..." : "Delete Movie"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
