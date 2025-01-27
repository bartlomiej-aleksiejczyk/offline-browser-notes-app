export type NavigationVariablesKey =
  | 'edit_note'
  | 'note_quick_select'
  | 'search_entities'
  | 'explore_files';

export const navigationVariables: Record<NavigationVariablesKey, string> = {
  edit_note: '/notes/',
  note_quick_select: '/notes',
  search_entities: '/search',
  explore_files: 'explore_files'
};

export const DEFAULT_NOTE_TITLE = 'default~note';
