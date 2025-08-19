export interface FileData {
  headers: string[];
  rows: any[][];
  totalRows: number;
}

export interface FileReadResult {
  success: boolean;
  data?: FileData;
  error?: string;
}

/**
 * Read CSV file content
 */
export const readCSVFile = async (file: File): Promise<FileReadResult> => {
  try {
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    if (lines.length === 0) {
      return {
        success: false,
        error: "File is empty",
      };
    }

    // Parse headers (first line)
    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().replace(/"/g, ""));

    // Parse data rows
    const rows = lines.slice(1).map((line) => {
      return line.split(",").map((cell) => cell.trim().replace(/"/g, ""));
    });

    return {
      success: true,
      data: {
        headers,
        rows,
        totalRows: rows.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to read CSV file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

/**
 * Read XLSX file content using SheetJS library
 * Note: This requires the 'xlsx' package to be installed
 */
export const readXLSXFile = async (file: File): Promise<FileReadResult> => {
  try {
    // Dynamic import to avoid bundling issues if xlsx is not installed
    const XLSX = await import("xlsx");

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      return {
        success: false,
        error: "No worksheet found in the Excel file",
      };
    }

    // Convert to JSON with headers
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      return {
        success: false,
        error: "Worksheet is empty",
      };
    }

    // First row contains headers
    const headers = (jsonData[0] as string[]).map((header) =>
      String(header || "").trim()
    );

    // Remaining rows contain data
    const rows = jsonData.slice(1).map((row) => {
      return (row as any[]).map((cell) =>
        cell !== undefined && cell !== null ? String(cell) : ""
      );
    });

    return {
      success: true,
      data: {
        headers,
        rows,
        totalRows: rows.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to read XLSX file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

/**
 * Read file based on its extension
 */
export const readFile = async (file: File): Promise<FileReadResult> => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  switch (fileExtension) {
    case "csv":
      return await readCSVFile(file);
    case "xlsx":
      return await readXLSXFile(file);
    default:
      return {
        success: false,
        error: `Unsupported file format: ${fileExtension}`,
      };
  }
};

/**
 * Validate file before reading
 */
export const validateFile = (
  file: File
): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedExtensions = ["csv", "xlsx"];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds 10MB limit",
    };
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `Only ${allowedExtensions.join(", ")} files are supported`,
    };
  }

  return { valid: true };
};

/**
 * Preview file data (first few rows)
 */
export const previewFileData = (
  data: FileData,
  maxRows: number = 5
): FileData => {
  return {
    headers: data.headers,
    rows: data.rows.slice(0, maxRows),
    totalRows: data.totalRows,
  };
};
