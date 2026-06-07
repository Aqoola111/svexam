"use client";

import { useAction } from "next-safe-action/hooks";
import { FilmIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import type { Movie } from "@/app/generated/prisma/client";
import { deleteMovie } from "@/actions/movies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getGenreGradientClasses } from "@/lib/genre-gradients";
import { cn } from "@/lib/utils";

export type MovieCardHighlight =
  | { variant: "spinning"; ringClass: string }
  | { variant: "selected" };

type MovieCardProps = {
  movie: Movie;
  onDeleted?: () => void;
  highlight?: MovieCardHighlight | null;
};

const MovieCard = ({ movie, onDeleted, highlight }: MovieCardProps) => {
  const { execute, isExecuting } = useAction(deleteMovie, {
    onSuccess: () => {
      toast.success("Movie deleted successfully");
      onDeleted?.();
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
    <Card
      className={cn(
        "group/card relative flex h-full flex-col gap-0 py-0 shadow-sm ring-1 ring-border/60",
        "transition-all duration-300 ease-out",
        highlight?.variant !== "selected" &&
          "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 hover:ring-border",
        highlight?.variant === "spinning" &&
          cn("ring-2 ring-offset-2 ring-offset-background", highlight.ringClass),
        highlight?.variant === "selected" &&
          "-translate-y-0.5 ring-2 ring-primary shadow-lg shadow-primary/25 ring-offset-2 ring-offset-background"
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-16 opacity-30 group-hover/card:h-20 group-hover/card:opacity-50",
          getGenreGradientClasses(movie.genre)
        )}
      />

      <CardHeader className="relative z-10 gap-3 border-b border-border/50 pb-4 pt-5">
        <CardTitle className="pr-2 font-heading text-lg font-semibold leading-snug tracking-tight text-balance">
          {movie.title}
        </CardTitle>
        <CardAction>
          <Badge
            variant="outline"
            className="relative z-10 h-6 shrink-0 gap-1.5 rounded-full border-border/80 bg-background/80 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shadow-sm backdrop-blur-sm transition-colors duration-200 group-hover/card:border-primary/25 group-hover/card:text-foreground"
          >
            <FilmIcon className="size-3 text-primary/70" />
            {movie.genre}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col py-4">
        <div className="flex min-h-36 flex-col space-y-2.5 rounded-xl border border-border/40 bg-muted/25 px-3.5 py-3.5 transition-colors duration-300 group-hover/card:border-border/60 group-hover/card:bg-muted/40">
          <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
            Synopsis
          </p>
          <p className="min-h-[5.5rem] flex-1 text-sm leading-relaxed text-foreground/85 text-pretty">
            {movie.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/50 pb-5 pt-4">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isExecuting}
          className={cn(
            "h-9 w-full gap-2 rounded-xl border border-destructive/25 bg-destructive/[0.06] font-medium shadow-none",
            "transition-all duration-200 ease-out",
            "hover:border-destructive/45 hover:bg-destructive/12 hover:shadow-md hover:shadow-destructive/10",
            "active:scale-[0.98] active:shadow-sm",
            "disabled:scale-100 disabled:opacity-60"
          )}
        >
          {isExecuting ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <Trash2Icon className="size-3.5 transition-transform duration-200 group-hover/button:scale-110" />
          )}
          {isExecuting ? "Deleting..." : "Delete Movie"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
