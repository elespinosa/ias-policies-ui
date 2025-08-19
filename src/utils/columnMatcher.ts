
import { DatabaseColumn, ColumnMapping } from '@/types/import';

/**
 * Attempts to automatically match file headers to database columns
 * based on similarity scores using various matching strategies
 */
export const autoMapColumns = (
  fileHeaders: string[],
  databaseColumns: DatabaseColumn[]
): ColumnMapping[] => {
  const mappings: ColumnMapping[] = fileHeaders.map(header => ({
    fileHeader: header,
    tableColumn: null,
    useDefaultValue: false,
    skip: false,
  }));

  // Create a set to track used columns
  const usedColumns = new Set<string>();

  // For each file header, find the best matching database column
  mappings.forEach((mapping, index) => {
    const bestMatch = findBestMatch(
      mapping.fileHeader,
      databaseColumns.filter(col => !usedColumns.has(col.name))
    );

    if (bestMatch) {
      mapping.tableColumn = bestMatch.name;
      usedColumns.add(bestMatch.name);
    }
  });

  return mappings;
};

/**
 * Finds the best matching database column for a given file header
 */
const findBestMatch = (
  fileHeader: string,
  availableColumns: DatabaseColumn[]
): DatabaseColumn | null => {
  let bestMatch: DatabaseColumn | null = null;
  let highestScore = 0.6; // Minimum threshold for auto-mapping

  for (const column of availableColumns) {
    const score = calculateSimilarityScore(fileHeader, column);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = column;
    }
  }

  return bestMatch;
};

/**
 * Calculates similarity score between file header and database column
 */
const calculateSimilarityScore = (
  fileHeader: string,
  dbColumn: DatabaseColumn
): number => {
  const headerLower = fileHeader.toLowerCase().trim();
  const nameLower = dbColumn.name.toLowerCase();
  const displayNameLower = dbColumn.displayName.toLowerCase();

  // Exact match gets highest score
  if (headerLower === nameLower || headerLower === displayNameLower) {
    return 1.0;
  }

  // Check for common patterns and synonyms
  const synonyms = getColumnSynonyms();
  const headerWords = headerLower.split(/[\s_-]+/);
  const nameWords = nameLower.split(/[\s_-]+/);
  const displayWords = displayNameLower.split(/[\s_-]+/);

  let score = 0;

  // Word-based matching
  const allDbWords = [...nameWords, ...displayWords];
  for (const headerWord of headerWords) {
    for (const dbWord of allDbWords) {
      if (headerWord === dbWord) {
        score += 0.3;
      } else if (headerWord.includes(dbWord) || dbWord.includes(headerWord)) {
        score += 0.15;
      }
    }

    // Check synonyms
    const synonymGroup = synonyms.find(group => group.includes(headerWord));
    if (synonymGroup) {
      for (const dbWord of allDbWords) {
        if (synonymGroup.includes(dbWord)) {
          score += 0.25;
        }
      }
    }
  }

  // Normalize score based on word count
  const maxWords = Math.max(headerWords.length, allDbWords.length);
  return Math.min(score / maxWords, 1.0);
};

/**
 * Returns groups of synonymous terms commonly used in column names
 */
const getColumnSynonyms = (): string[][] => {
  return [
    ['id', 'identifier', 'key', 'uid', 'uuid'],
    ['name', 'title', 'label', 'description'],
    ['email', 'mail', 'e-mail', 'email_address'],
    ['phone', 'telephone', 'mobile', 'cell', 'contact'],
    ['address', 'addr', 'location', 'street'],
    ['date', 'datetime', 'timestamp', 'time'],
    ['created', 'created_at', 'creation_date', 'date_created'],
    ['updated', 'updated_at', 'modified', 'last_modified'],
    ['first', 'firstname', 'first_name', 'fname'],
    ['last', 'lastname', 'last_name', 'lname', 'surname'],
    ['company', 'organization', 'org', 'business'],
    ['status', 'state', 'condition'],
    ['type', 'category', 'kind', 'classification'],
    ['amount', 'value', 'price', 'cost', 'total'],
    ['quantity', 'qty', 'count', 'number'],
  ];
};
