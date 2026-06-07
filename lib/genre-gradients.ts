import { MOVIE_GENRES, type MovieGenre } from "@/lib/movie-genres";
import { cn } from "@/lib/utils";

export const genreGradientHoverAnimation =
  "bg-[length:200%_200%] bg-[position:0%_50%] transition-[background-position,opacity,height] duration-700 ease-out group-hover/card:bg-[position:100%_50%]";

const DEFAULT_GRADIENT = "from-primary/25 via-primary/10 to-transparent";

export const GENRE_GRADIENT_MAP: Record<MovieGenre, string> = {
  Action: "from-red-600/35 via-orange-500/20 to-transparent",
  Adventure: "from-amber-500/35 via-emerald-600/20 to-transparent",
  Animation: "from-violet-500/35 via-pink-400/20 to-transparent",
  Biography: "from-stone-500/30 via-amber-700/20 to-transparent",
  Comedy: "from-yellow-400/35 via-orange-400/20 to-transparent",
  Crime: "from-slate-700/35 via-red-900/25 to-transparent",
  Documentary: "from-teal-600/30 via-slate-500/20 to-transparent",
  Drama: "from-indigo-500/30 via-purple-700/20 to-transparent",
  Family: "from-sky-400/30 via-green-400/20 to-transparent",
  Fantasy: "from-purple-500/35 via-fuchsia-400/20 to-transparent",
  "Film-Noir": "from-neutral-800/40 via-neutral-600/25 to-transparent",
  History: "from-amber-700/30 via-stone-600/20 to-transparent",
  Horror: "from-red-950/40 via-purple-950/25 to-transparent",
  Indie: "from-rose-400/30 via-cyan-500/20 to-transparent",
  "Martial Arts": "from-red-700/35 via-yellow-600/20 to-transparent",
  Music: "from-fuchsia-500/35 via-violet-600/20 to-transparent",
  Musical: "from-pink-500/35 via-purple-500/20 to-transparent",
  Mystery: "from-slate-600/35 via-indigo-900/25 to-transparent",
  Romance: "from-rose-400/35 via-pink-500/20 to-transparent",
  "Sci-Fi": "from-cyan-500/35 via-blue-700/25 to-transparent",
  Sport: "from-green-500/35 via-lime-500/20 to-transparent",
  Superhero: "from-blue-600/35 via-red-600/25 to-transparent",
  Thriller: "from-zinc-700/35 via-red-800/25 to-transparent",
  War: "from-stone-600/35 via-red-900/25 to-transparent",
  Western: "from-amber-800/35 via-orange-900/25 to-transparent",
  Anime: "from-pink-500/35 via-blue-500/25 to-transparent",
  Psychological: "from-violet-800/35 via-slate-700/25 to-transparent",
  Heist: "from-emerald-700/30 via-amber-600/20 to-transparent",
  Satire: "from-lime-400/30 via-orange-500/20 to-transparent",
  Noir: "from-neutral-900/40 via-neutral-700/25 to-transparent",
};

const isMovieGenre = (genre: string): genre is MovieGenre =>
  (MOVIE_GENRES as readonly string[]).includes(genre);

export const getGenreGradient = (genre: string) =>
  isMovieGenre(genre) ? GENRE_GRADIENT_MAP[genre] : DEFAULT_GRADIENT;

export const getGenreGradientClasses = (genre: string) =>
  cn(
    "bg-gradient-to-br",
    getGenreGradient(genre),
    genreGradientHoverAnimation
  );
