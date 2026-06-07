import Link from "next/link";

import { Button } from "@/components/ui/button";

const AllMoviesEmptyState = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-muted-foreground">No movies yet</p>
        <Button asChild size="lg" className="h-12 px-8 text-base">
          <Link href="/add-movie">Add Movie</Link>
        </Button>
      </div>
    </div>
  );
};

export default AllMoviesEmptyState;
