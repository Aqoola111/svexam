"use client";

import { DicesIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MovieSort } from "@/lib/all-movies/types";

type AllMoviesToolbarProps = {
  hasMovies: boolean;
  sort: MovieSort;
  isPicking: boolean;
  pickedId: string | null;
  onSortChange: (sort: MovieSort) => void;
  onPickRandom: () => void;
  onClearPick: () => void;
};

const AllMoviesToolbar = ({
  hasMovies,
  sort,
  isPicking,
  pickedId,
  onSortChange,
  onPickRandom,
  onClearPick,
}: AllMoviesToolbarProps) => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      {hasMovies ? (
        <div className="flex h-9 w-full gap-2 sm:w-auto">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onPickRandom}
            disabled={isPicking}
            className="h-9 min-w-0 flex-1 sm:flex-none"
          >
            <DicesIcon />
            {isPicking ? "Picking..." : "Pick Random Movie"}
          </Button>
          {pickedId ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onClearPick}
              className="h-9 shrink-0"
            >
              <XIcon />
              Clear
            </Button>
          ) : null}
        </div>
      ) : null}

      <Select value={sort} onValueChange={(value) => onSortChange(value as MovieSort)}>
        <SelectTrigger
          size="sm"
          aria-label="Sort by date added"
          className="h-9 w-full sm:w-auto"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="desc">Newest first</SelectItem>
          <SelectItem value="asc">Oldest first</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AllMoviesToolbar;
