"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SparklesIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import GenreCombobox from "@/components/genre-combobox";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MOVIE_GENRES, type MovieGenre } from "@/lib/movie-genres";
import { cn } from "@/lib/utils";

const addMovieSchema = z.object({
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

type AddMovieFormInput = z.input<typeof addMovieSchema>;
type AddMovieFormValues = z.output<typeof addMovieSchema>;

type ReservedFieldErrorProps = {
  errors: Array<{ message?: string } | undefined>;
};

const ReservedFieldError = ({ errors }: ReservedFieldErrorProps) => {
  return (
    <div className="min-h-5">
      <FieldError errors={errors} />
    </div>
  );
};

const AddMovieForm = () => {
  const form = useForm<AddMovieFormInput, unknown, AddMovieFormValues>({
    resolver: zodResolver(addMovieSchema),
    defaultValues: {
      title: "",
      genre: "",
      description: "",
    },
  });

  const handleGenerateDescription = () => {
    const values = form.getValues();
    toast.info(
      `Generate AI: ${JSON.stringify({ title: values.title, genre: values.genre })}`
    );
  };

  const handleAddMovie = (values: AddMovieFormValues) => {
    toast.success(`Add movie: ${JSON.stringify(values)}`);
  };

  return (
    <div className="flex flex-1 items-center justify-center py-6">
      <div
        className={cn(
          "w-full max-w-lg space-y-6",
          "md:rounded-[min(var(--radius-4xl),24px)] md:bg-card md:p-6 md:shadow-sm md:ring-1 md:ring-foreground/5 md:dark:ring-foreground/10"
        )}
      >
        <form
          onSubmit={form.handleSubmit(handleAddMovie)}
          className="space-y-6"
        >
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Enter movie title"
                maxLength={20}
                aria-invalid={!!form.formState.errors.title}
                {...form.register("title")}
              />
              <ReservedFieldError errors={[form.formState.errors.title]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.genre}>
              <FieldLabel htmlFor="genre">Genre</FieldLabel>
              <Controller
                name="genre"
                control={form.control}
                render={({ field }) => (
                  <GenreCombobox
                    id="genre"
                    value={field.value}
                    onValueChange={field.onChange}
                    invalid={!!form.formState.errors.genre}
                  />
                )}
              />
              <ReservedFieldError errors={[form.formState.errors.genre]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.description}>
              <div className="flex items-center justify-between gap-3">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateDescription}
                    >
                      <SparklesIcon />
                      Generate Description With AI
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Generate a description from the title and genre
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="description"
                placeholder="Enter movie description"
                rows={4}
                maxLength={200}
                aria-invalid={!!form.formState.errors.description}
                {...form.register("description")}
              />
              <ReservedFieldError
                errors={[form.formState.errors.description]}
              />
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full" size="lg">
            Add Movie
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddMovieForm;
