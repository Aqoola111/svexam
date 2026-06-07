"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { MOVIE_GENRES } from "@/lib/movie-genres";

export const genreComboboxInputClassName = cn(
  "h-10 w-full shadow-none",
  "md:border-border/60 md:bg-muted/20 md:shadow-sm",
  "md:hover:border-border md:hover:bg-muted/35",
  "md:focus-within:border-primary/35 md:focus-within:bg-background md:focus-within:ring-primary/15"
);

type GenreComboboxProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  invalid?: boolean;
  className?: string;
  inputClassName?: string;
};

const GenreCombobox = ({
  id,
  value,
  onValueChange,
  invalid = false,
  className,
  inputClassName,
}: GenreComboboxProps) => {
  return (
    <Combobox
      items={[...MOVIE_GENRES]}
      value={value || null}
      onValueChange={(selectedValue: string | null) =>
        onValueChange(selectedValue ?? "")
      }
      className={cn("w-full", className)}
    >
      <ComboboxInput
        id={id}
        className={cn(genreComboboxInputClassName, inputClassName)}
        placeholder="Search or select a genre"
        aria-invalid={invalid}
        showClear={!!value}
      />
      <ComboboxContent>
        <ComboboxEmpty>No genres found.</ComboboxEmpty>
        <ComboboxList>
          {(genre) => (
            <ComboboxItem key={genre} value={genre}>
              {genre}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default GenreCombobox;
