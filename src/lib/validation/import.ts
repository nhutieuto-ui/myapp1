// US-021: import flashcards from a single-sheet .xlsx workbook

// US-021 DEC (this session): import-specific row cap, tighter than MAX_QUESTIONS_PER_QUIZ (DEC-16)
export const MAX_IMPORT_ROWS = 20;

// US-021 NFR (file size): BA-recommended cap pending Sponsor confirmation (Q-021.5) — enforced
// defensively regardless, since accepting unbounded uploads is a resource-exhaustion risk (OWASP).
export const MAX_IMPORT_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export const IMPORT_FILE_EXTENSION = '.xlsx';
export const IMPORT_FILE_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// US-021 DEC-24: only flashcard rows are approved for bulk import
export const IMPORT_ROW_TYPES = ['flashcard'] as const;
export type ImportRowType = (typeof IMPORT_ROW_TYPES)[number];

// Required sheet columns (case-insensitive) — flashcard import needs both sides present
export const IMPORT_REQUIRED_COLUMNS = ['type', 'prompt', 'back'] as const;
