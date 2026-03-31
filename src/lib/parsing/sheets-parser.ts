import type { ParsedData, Prospect, Product } from '@/types';

function generateId(): string {
  return crypto.randomUUID();
}

export function extractSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (values[i] || '').trim();
    });
    return row;
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export async function parseGoogleSheet(url: string): Promise<ParsedData> {
  const sheetId = extractSheetId(url);
  if (!sheetId) {
    throw new Error('Invalid Google Sheets URL. Expected format: https://docs.google.com/spreadsheets/d/SHEET_ID/...');
  }

  const prospectsCSV = await fetchSheetCSV(sheetId, 0);
  const productsCSV = await fetchSheetCSV(sheetId, 1);

  const prospectsRaw = parseCSV(prospectsCSV);
  const productsRaw = parseCSV(productsCSV);

  const prospects: Prospect[] = prospectsRaw
    .filter((r) => r['Name']?.trim())
    .map((r) => ({
      id: generateId(),
      name: r['Name'].trim(),
      email: r['Email']?.trim() || '',
      company: r['Company']?.trim() || '',
      industry: r['Industry']?.trim() || '',
      interests: (r['Interests'] || '')
        .split(/[,;|]/)
        .map((s) => s.trim())
        .filter(Boolean),
    }));

  const products: Product[] = productsRaw
    .filter((r) => r['Name']?.trim())
    .map((r) => ({
      id: generateId(),
      name: r['Name'].trim(),
      description: r['Description']?.trim() || '',
      category: r['Category']?.trim() || '',
      imageUrl: r['Image']?.trim() || '',
      features: (r['Features'] || '')
        .split(/[,;|]/)
        .map((s) => s.trim())
        .filter(Boolean),
    }));

  if (prospects.length === 0) throw new Error('No prospects found in the first sheet (gid=0).');
  if (products.length === 0) throw new Error('No products found in the second sheet (gid=1).');

  return { prospects, products };
}

async function fetchSheetCSV(sheetId: string, gid: number): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch sheet (gid=${gid}). Make sure the sheet is publicly shared ("Anyone with the link can view").`
    );
  }
  return res.text();
}
