import type { Movie } from "@/app/generated/prisma/client";
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
        <Button type="button" variant="destructive">
          Delete Movie
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
