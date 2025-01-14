import { NoteSummary } from './note-summary.model';

export interface NotesPage {
  notesSummaries: NoteSummary[];
  limit: number;
  offset: number;
  hasMore: boolean;
}
