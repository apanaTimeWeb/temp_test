// Responsibility: parse RFC-style allocation CSV rows and reject malformed quote placement.
export function parseAdminAllocationsCsvRows(source: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  let afterClosingQuote = false;
  let atCellStart = true;

  for (let index = 0; index < source.length; index += 1) {
    const character = source.charAt(index);
    if (quoted) {
      if (character === '"') {
        if (source[index + 1] === '"') { cell += '"'; index += 1; }
        else { quoted = false; afterClosingQuote = true; }
      } else cell += character;
      continue;
    }
    if (afterClosingQuote && character !== ',' && character !== '\r' && character !== '\n') {
      throw new Error('malformed-quotes');
    }
    if (character === '"') {
      if (!atCellStart || cell.length !== 0) throw new Error('malformed-quotes');
      quoted = true; atCellStart = false; afterClosingQuote = false;
    } else if (character === ',') {
      row.push(cell); cell = ''; atCellStart = true; afterClosingQuote = false;
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && source[index + 1] === '\n') index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = []; cell = ''; atCellStart = true; afterClosingQuote = false;
    } else {
      if (atCellStart && character.trim() === '') { cell += character; continue; }
      if (atCellStart) atCellStart = false;
      cell += character;
    }
  }
  if (quoted) throw new Error('unclosed-quote');
  if (cell !== '' || row.length > 0 || afterClosingQuote) {
    row.push(cell);
    if (row.some((value) => value.trim() !== '')) rows.push(row);
  }
  return rows;
}

