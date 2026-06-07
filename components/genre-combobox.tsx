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

type GenreComboboxProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  invalid?: boolean;
  className?: string;
};

const GenreCombobox = ({
  id,
  value,
  onValueChange,
  invalid = false,
  className,
}: GenreComboboxProps) => {
  return (
    <Combobox
      items={[...MOVIE_GENRES]}
      value={value || null}
      onValueChange={(selectedValue) => onValueChange(selectedValue ?? "")}
    >
      <ComboboxInput
        id={id}
        className={cn("w-full", className)}
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
