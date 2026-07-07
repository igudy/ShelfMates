import type { ImageSourcePropType } from "react-native";

import { BOOK_COVERS } from "@/data/bookCovers";

export type ShelfBook = {
  id: string;
  title: string;
  distance: string;
  match: number;
  coverColor: string;
  coverImage?: ImageSourcePropType;
};

export type NeighborProfile = {
  id: string;
  name: string;
  contactName: string;
  score: number;
  latitude: number;
  longitude: number;
  color: string;
  tagline: string;
  books: ShelfBook[];
};

export const NEIGHBORS: NeighborProfile[] = [
  {
    id: "kemi",
    name: "Meeday",
    contactName: "Oladimeji",
    score: 3200,
    latitude: 6.5288,
    longitude: 3.3721,
    color: "#F4A261",
    tagline: "Trusted Neighbor",
    books: [
      {
        id: "atomic-habits",
        title: "Atomic Habits",
        distance: "800m away",
        match: 100,
        coverColor: "#F4EFE6",
        coverImage: BOOK_COVERS["atomic-habits"],
      },
    ],
  },
  {
    id: "tunde",
    name: "Tunde",
    contactName: "Tunde",
    score: 2840,
    latitude: 6.5198,
    longitude: 3.3864,
    color: "#6BB3F2",
    tagline: "Trusted Neighbor",
    books: [
      {
        id: "clean-code",
        title: "Clean Code",
        distance: "0.8km away",
        match: 98,
        coverColor: "#DDE7F0",
        coverImage: BOOK_COVERS["clean-code"],
      },
    ],
  },
  {
    id: "ada",
    name: "Ada",
    contactName: "Ada",
    score: 3015,
    latitude: 6.5312,
    longitude: 3.3912,
    color: "#A0D858",
    tagline: "Trusted Neighbor",
    books: [
      {
        id: "thinking-fast-slow",
        title: "Thinking, Fast and Slow",
        distance: "1.5km away",
        match: 72,
        coverColor: "#F8F1E4",
      },
    ],
  },
  {
    id: "sam",
    name: "Sam",
    contactName: "Sam",
    score: 2650,
    latitude: 6.5156,
    longitude: 3.3648,
    color: "#E8843C",
    tagline: "Trusted Neighbor",
    books: [
      {
        id: "pragmatic-programmer",
        title: "The Pragmatic Programmer",
        distance: "1.1km away",
        match: 88,
        coverColor: "#E8E4F8",
        coverImage: BOOK_COVERS["pragmatic-programmer"],
      },
    ],
  },
];

export const NEARBY_BOOKS = NEIGHBORS.flatMap((neighbor) =>
  neighbor.books.map((book) => ({
    ...book,
    owner: neighbor.name,
    neighborId: neighbor.id,
  }))
);

export function getNeighborById(id: string): NeighborProfile | undefined {
  return NEIGHBORS.find((neighbor) => neighbor.id === id);
}
