import {
  NEIGHBORS,
  NEARBY_BOOKS,
  type NeighborProfile,
} from "@/data/neighbors";

export type BookSearchResult = {
  type: "book";
  id: string;
  title: string;
  owner: string;
  neighbor: NeighborProfile;
};

export type NeighborSearchResult = {
  type: "neighbor";
  id: string;
  name: string;
  neighbor: NeighborProfile;
};

export type NearbySearchResult = BookSearchResult | NeighborSearchResult;

export function searchNearby(query: string): NearbySearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const bookResults: BookSearchResult[] = NEARBY_BOOKS.filter((book) =>
    book.title.toLowerCase().includes(normalized)
  ).map((book) => {
    const neighbor = NEIGHBORS.find((entry) => entry.id === book.neighborId)!;
    return {
      type: "book",
      id: `book-${book.id}`,
      title: book.title,
      owner: book.owner,
      neighbor,
    };
  });

  const neighborResults: NeighborSearchResult[] = NEIGHBORS.filter(
    (neighbor) =>
      neighbor.name.toLowerCase().includes(normalized) &&
      !bookResults.some((book) => book.neighbor.id === neighbor.id)
  ).map((neighbor) => ({
    type: "neighbor",
    id: `neighbor-${neighbor.id}`,
    name: neighbor.name,
    neighbor,
  }));

  return [...bookResults, ...neighborResults];
}

export function filterNearbyBooks(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return NEARBY_BOOKS;
  }

  return NEARBY_BOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(normalized) ||
      book.owner.toLowerCase().includes(normalized)
  );
}
