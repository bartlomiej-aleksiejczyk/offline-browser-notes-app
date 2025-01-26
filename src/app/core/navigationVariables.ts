export type NavigationVariablesKey =
  | 'edit_note'
  | 'note_quick_select'
  | 'search_entities';

export const navigationVariables: Record<NavigationVariablesKey, string> = {
  edit_note: '/notes/',
  note_quick_select: '/notes',
  search_entities: '/search',
};

export const DEFAULT_NOTE_TITLE = 'default~note';
