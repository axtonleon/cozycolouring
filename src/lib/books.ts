import data from "../../data/books.json";

export interface Book {
  id: string;
  slug: string;
  title: string;
  collection: string;
  collectionSlug: string;
  cover: string | null;
  pages: string[];
  pageCount: number;
}

export interface Collection {
  slug: string;
  name: string;
  bookCount: number;
  books: Book[];
}

const typed = data as { collections: Collection[] };

export const collections: Collection[] = typed.collections;

export const allBooks: Book[] = typed.collections.flatMap((c) => c.books);

export function getCollection(slug: string): Collection | undefined {
  return typed.collections.find((c) => c.slug === slug);
}

export function getBook(collectionSlug: string, bookSlug: string): Book | undefined {
  return getCollection(collectionSlug)?.books.find((b) => b.slug === bookSlug);
}
