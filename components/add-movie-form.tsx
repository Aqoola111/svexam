"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { addMovie, generateDescription } from "@/actions/movies";
import GenreCombobox from "@/components/genre-combobox";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getActionData } from "@/lib/action-utils";
import {
  addMovieSchema,
  type AddMovieInput,
  type AddMovieValues,
} from "@/lib/validations/movie";

type FieldErrorItem = { message?: string } | undefined;

const ReservedFieldError = ({ errors }: { errors: FieldErrorItem[] }) => (
  <div className="min-h-4">
    <FieldError errors={errors} />
  </div>
);

const CharCount = ({ value, max }: { value: number; max: number }) => (
  <span className="text-xs tabular-nums text-muted-foreground">
    {value}/{max}
  </span>
);

const AddMovieForm = () => {
  const router = useRouter();

  const form = useForm<AddMovieInput, unknown, AddMovieValues>({
    resolver: zodResolver(addMovieSchema),
    defaultValues: {
      title: "",
      genre: "",
      description: "",
    },
  });

  const titleValue = form.watch("title");
  const descriptionValue = form.watch("description");

  const { execute: executeGenerate, isExecuting: isGenerating } = useAction(
    generateDescription,
    {
      onSuccess: (result) => {
        const description = getActionData(result)?.description;

        if (!description) {
          toast.error("Failed to generate description.");
          return;
        }

        form.setValue("description", description, {
          shouldDirty: true,
          shouldValidate: true,
        });
        toast.success("Description generated.");
      },
      onError: ({ error }) => {
        toast.error(
          typeof error.serverError === "string"
            ? error.serverError
            : "Failed to generate description."
        );
      },
    }
  );

  const { execute, isExecuting } = useAction(addMovie, {
    onSuccess: () => {
      toast.success("Movie added successfully");
      form.reset();
      router.push("/all-movies");
    },
    onError: ({ error }) => {
      if (error.validationErrors) {
        toast.error("Please fix the validation errors.");
        return;
      }

      toast.error(
        typeof error.serverError === "string"
          ? error.serverError
          : "Failed to add movie"
      );
    },
  });

  const handleGenerateDescription = () => {
    const title = form.getValues("title");
    const genre = form.getValues("genre");

    if (!title.trim()) {
      toast.error("Enter a title before generating a description.");
      return;
    }

    if (!genre) {
      toast.error("Select a genre before generating a description.");
      return;
    }

    executeGenerate({ title, genre });
  };

  return (
    <div className="flex flex-1 flex-col pt-4 md:items-center md:pt-6">
      <div className="w-full max-w-lg md:rounded-2xl md:border md:bg-card md:p-6 md:shadow-sm">
        <div className="mb-6 hidden space-y-1 md:block">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Movie Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Add a new title to your watchlist.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit((values) => execute(values))}
          className="space-y-3"
        >
          <Field className="gap-1.5" data-invalid={!!form.formState.errors.title}>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <CharCount value={titleValue.length} max={20} />
            </div>
            <Input
              id="title"
              placeholder="Enter movie title"
              maxLength={20}
              aria-invalid={!!form.formState.errors.title}
              {...form.register("title")}
            />
            <ReservedFieldError errors={[form.formState.errors.title]} />
          </Field>

          <Field className="gap-1.5" data-invalid={!!form.formState.errors.genre}>
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

          <Field
            className="gap-1.5"
            data-invalid={!!form.formState.errors.description}
          >
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <CharCount value={descriptionValue.length} max={200} />
            </div>

            <div className="relative">
              <Textarea
                id="description"
                placeholder="Enter movie description or generate one with AI"
                rows={4}
                maxLength={200}
                aria-invalid={!!form.formState.errors.description}
                className="field-sizing-fixed min-h-24 resize-none pr-36"
                {...form.register("description")}
              />
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="absolute top-2 right-2"
              >
                {isGenerating ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <SparklesIcon />
                )}
                {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <ReservedFieldError errors={[form.formState.errors.description]} />
          </Field>

          <Button
            type="submit"
            size="lg"
            disabled={isExecuting}
            className="w-full"
          >
            {isExecuting ? (
              <Loader2Icon className="animate-spin" />
            ) : null}
            {isExecuting ? "Adding..." : "Add Movie"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddMovieForm;
