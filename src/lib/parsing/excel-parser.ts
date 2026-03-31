import * as XLSX from 'xlsx';
import type { ParsedData, Prospect, Product } from '@/types';

function generateId(): string {
  return crypto.randomUUID();
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, '_');
}

export function parseExcelBuffer(buffer: ArrayBuffer): ParsedData {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;

  const prospectsSheetName =
    sheetNames.find((n) => n.toLowerCase() === 'prospects') || sheetNames[0];
  const productsSheetName =
    sheetNames.find((n) => n.toLowerCase() === 'products') || sheetNames[1];

  if (!prospectsSheetName || !productsSheetName) {
    throw new Error(
      'Excel file must have two sheets: "Prospects" and "Products"'
    );
  }

  const prospectsRaw: Record<string, string>[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[prospectsSheetName]
  );
  const productsRaw: Record<string, string>[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[productsSheetName]
  );

  const prospects: Prospect[] = prospectsRaw
    .filter((row) => {
      const name = findField(row, ['name', 'contact_name']);
      return name && name.trim().length > 0;
    })
    .map((row) => ({
      id: generateId(),
      name: findField(row, ['name', 'contact_name'])!.trim(),
      email: findField(row, ['email', 'e-mail', 'email_address'])?.trim() || '',
      company: findField(row, ['company', 'company_name', 'organization'])?.trim() || '',
      industry: findField(row, ['industry', 'sector'])?.trim() || '',
      interests: parseList(
        findField(row, ['interests', 'needs', 'looking_for', 'requirements']) || ''
      ),
    }));

  const products: Product[] = productsRaw
    .filter((row) => {
      const name = findField(row, ['name', 'product_name', 'product']);
      return name && name.trim().length > 0;
    })
    .map((row) => ({
      id: generateId(),
      name: findField(row, ['name', 'product_name', 'product'])!.trim(),
      description:
        findField(row, ['description', 'summary', 'details'])?.trim() || '',
      category: findField(row, ['category', 'type', 'product_type'])?.trim() || '',
      imageUrl: findField(row, ['image', 'image_url', 'photo', 'picture'])?.trim() || '',
      features: parseList(
        findField(row, ['features', 'key_features', 'specs']) || ''
      ),
    }));

  if (prospects.length === 0) {
    throw new Error('No prospects found. Check your "Prospects" sheet has a "Name" column.');
  }
  if (products.length === 0) {
    throw new Error('No products found. Check your "Products" sheet has a "Name" column.');
  }

  return { prospects, products };
}

function findField(
  row: Record<string, string>,
  possibleNames: string[]
): string | undefined {
  for (const key of Object.keys(row)) {
    const normalized = normalizeHeader(key);
    if (possibleNames.includes(normalized)) {
      return String(row[key]);
    }
  }
  return undefined;
}

function parseList(raw: string): string[] {
  return raw
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
