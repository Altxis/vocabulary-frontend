export type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error';

export type Word = {
  _id: string;
  word: string;
  translation: string;
  externalId: string;
  numberOfViews: number;
}
