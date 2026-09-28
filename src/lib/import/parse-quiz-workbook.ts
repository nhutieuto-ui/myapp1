import ExcelJS from 'exceljs';
import { flashcardSchema, mcqSchema, type FlashcardInput, type McqInput } from '@/lib/validation/question';
import { IMPORT_REQUIRED_COLUMNS, IMPORT_ROW_TYPES, MAX_IMPORT_ROWS, type ImportRowType } from '@/lib/validation/import';

export type ParsedImportRow =
  | { type: 'flashcard'; position: number; data: FlashcardInput }
  | { type: 'mcq'; position: number; data: McqInput };

export type ParseWorkbookResult =
  | { ok: true; rows: ParsedImportRow[] }
  | { ok: false; error: string };

// Columns that may appear in the sheet, mapped case-insensitively (AS-021.3)
const OPTIONAL_COLUMNS = ['back', 'option1', 'option2', 'option3', 'option4', 'correctoptions', 'position'] as const;
const KNOWN_COLUMNS = [...IMPORT_REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS] as const;

function cellText(cell: ExcelJS.Cell | undefined): string {
  if (!cell || cell.value == null) return '';
  // `.text` renders the display value regardless of the cell's underlying type (string/number/formula)
  return String(cell.text ?? cell.value).trim();
}

function firstZodMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? 'Invalid row.';
}

/**
 * Parses an uploaded workbook per US-021. Reuses `flashcardSchema`/`mcqSchema` so import rows are
 * held to exactly the same rules as manually authored questions (DRY, single source of truth).
 * Returns either the full set of valid, ordered rows, or a single error describing every problem
 * found — the import is all-or-nothing (AS-021.2), so no partial results are ever returned.
 */
export async function parseQuizWorkbook(buffer: Buffer): Promise<ParseWorkbookResult> {
  const workbook = new ExcelJS.Workbook();
  try {
    // exceljs declares its own module-local `Buffer` shim (`extends ArrayBuffer`) that doesn't
    // match @types/node's real Buffer; the runtime value is a plain Node Buffer, which `.load()`
    // accepts fine — only the third-party type declaration is wrong here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await workbook.xlsx.load(buffer as any);
  } catch {
    // AC8: file is missing, not .xlsx, or unreadable/corrupt
    return { ok: false, error: 'The file could not be read. Upload a valid .xlsx workbook.' };
  }

  // AC11: only a single-sheet workbook is accepted
  if (workbook.worksheets.length !== 1) {
    return { ok: false, error: 'The workbook must contain exactly one sheet.' };
  }

  const worksheet = workbook.worksheets[0];
  const headerRow = worksheet.getRow(1);

  const columnIndexByName = new Map<string, number>();
  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const name = cellText(cell).toLowerCase();
    if (KNOWN_COLUMNS.includes(name as (typeof KNOWN_COLUMNS)[number])) {
      columnIndexByName.set(name, colNumber);
    }
  });

  // AC10: required columns must be present
  const missingColumns = IMPORT_REQUIRED_COLUMNS.filter((name) => !columnIndexByName.has(name));
  if (missingColumns.length > 0) {
    return { ok: false, error: `The sheet is missing required column(s): ${missingColumns.join(', ')}.` };
  }

  const getCell = (row: ExcelJS.Row, name: (typeof KNOWN_COLUMNS)[number]) => {
    const colNumber = columnIndexByName.get(name);
    return colNumber ? row.getCell(colNumber) : undefined;
  };

  // Collect non-empty data rows (skip fully blank trailing rows)
  const dataRows: { rowNumber: number; row: ExcelJS.Row }[] = [];
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const isBlank = row.values == null || (Array.isArray(row.values) && row.values.every((v) => v == null || String(v).trim() === ''));
    if (!isBlank) {
      dataRows.push({ rowNumber, row });
    }
  });

  // AC9: no data rows to import
  if (dataRows.length === 0) {
    return { ok: false, error: 'The sheet has no data rows to import.' };
  }

  // AC6: row cap
  if (dataRows.length > MAX_IMPORT_ROWS) {
    return { ok: false, error: `A workbook may contain at most ${MAX_IMPORT_ROWS} rows.` };
  }

  const errors: string[] = [];
  const rows: ParsedImportRow[] = [];

  dataRows.forEach(({ rowNumber, row }, index) => {
    const typeRaw = cellText(getCell(row, 'type')).toLowerCase();
    const prompt = cellText(getCell(row, 'prompt'));
    const positionRaw = cellText(getCell(row, 'position'));
    const parsedPosition = positionRaw ? Number.parseInt(positionRaw, 10) : NaN;
    const position = Number.isFinite(parsedPosition) ? parsedPosition : index;

    // AC5: Type must be one of the supported values
    if (!IMPORT_ROW_TYPES.includes(typeRaw as ImportRowType)) {
      errors.push(`Row ${rowNumber}: Type must be "flashcard" or "mcq".`);
      return;
    }
    const type = typeRaw as ImportRowType;

    if (type === 'flashcard') {
      const back = cellText(getCell(row, 'back'));
      const parsed = flashcardSchema.safeParse({ front: prompt, back });
      if (!parsed.success) {
        errors.push(`Row ${rowNumber}: ${firstZodMessage(parsed.error)}`);
        return;
      }
      rows.push({ type: 'flashcard', position, data: parsed.data });
      return;
    }

    // type === 'mcq'
    const correctOptionsRaw = cellText(getCell(row, 'correctoptions'));
    const correctIndices = new Set(
      correctOptionsRaw
        .split(',')
        .map((s) => Number.parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n))
    );
    const options = ([1, 2, 3, 4] as const)
      .map((n) => ({ text: cellText(getCell(row, `option${n}` as const)), n }))
      .filter((option) => option.text.length > 0)
      .map((option) => ({ text: option.text, correct: correctIndices.has(option.n) }));

    const parsed = mcqSchema.safeParse({ prompt, options });
    if (!parsed.success) {
      errors.push(`Row ${rowNumber}: ${firstZodMessage(parsed.error)}`);
      return;
    }
    rows.push({ type: 'mcq', position, data: parsed.data });
  });

  // AS-021.2: all-or-nothing — any row failure rejects the whole import, no partial quiz created
  if (errors.length > 0) {
    return { ok: false, error: errors.join(' ') };
  }

  // Honor an explicit Position column, falling back to sheet order (stable sort)
  const ordered = rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => a.row.position - b.row.position || a.index - b.index)
    .map(({ row }) => row);

  return { ok: true, rows: ordered };
}
