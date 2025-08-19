# File Reader Component

A comprehensive React component for reading and parsing CSV and XLSX files with preview functionality, validation, and error handling.

## Features

- ✅ **Multiple File Formats**: Support for CSV and XLSX files
- ✅ **Drag & Drop**: Intuitive file upload interface
- ✅ **File Validation**: Size and format validation
- ✅ **Progress Indication**: Visual feedback during file processing
- ✅ **Data Preview**: Preview file contents before processing
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **TypeScript Support**: Full type safety
- ✅ **Responsive Design**: Works on all screen sizes

## Installation

The component uses the following dependencies:

```bash
npm install xlsx
```

## Quick Start

### Basic Usage

```tsx
import { FileReader } from "@/components/common/FileReader";

const MyComponent = () => {
  const handleFileRead = (data: FileData) => {
    console.log("File data:", data);
    // Process your file data here
  };

  return (
    <FileReader
      onFileRead={handleFileRead}
      onError={(error) => console.error(error)}
    />
  );
};
```

### Advanced Usage

```tsx
import { FileReader } from "@/components/common/FileReader";

const MyComponent = () => {
  const handleFileRead = (data: FileData) => {
    // Process file data
    console.log("Headers:", data.headers);
    console.log("Total rows:", data.totalRows);
    console.log("First row:", data.rows[0]);
  };

  const handleError = (error: string) => {
    // Handle errors
    console.error("File reading error:", error);
  };

  return (
    <FileReader
      onFileRead={handleFileRead}
      onError={handleError}
      acceptedFormats={[".csv", ".xlsx"]}
      maxSize={5 * 1024 * 1024} // 5MB
      showPreview={true}
      className="custom-file-reader"
    />
  );
};
```

## API Reference

### Props

| Prop              | Type                       | Default             | Description                                             |
| ----------------- | -------------------------- | ------------------- | ------------------------------------------------------- |
| `onFileRead`      | `(data: FileData) => void` | **Required**        | Callback function called when file is successfully read |
| `onError`         | `(error: string) => void`  | `undefined`         | Callback function called when an error occurs           |
| `acceptedFormats` | `string[]`                 | `['.csv', '.xlsx']` | Array of accepted file extensions                       |
| `maxSize`         | `number`                   | `10 * 1024 * 1024`  | Maximum file size in bytes (default: 10MB)              |
| `showPreview`     | `boolean`                  | `true`              | Whether to show the preview toggle button               |
| `className`       | `string`                   | `''`                | Additional CSS classes                                  |

### FileData Interface

```typescript
interface FileData {
  headers: string[]; // Column headers from the first row
  rows: any[][]; // Data rows (excluding headers)
  totalRows: number; // Total number of data rows
}
```

### FileReadResult Interface

```typescript
interface FileReadResult {
  success: boolean; // Whether the file was read successfully
  data?: FileData; // File data if successful
  error?: string; // Error message if failed
}
```

## File Format Support

### CSV Files

- **Format**: Comma-separated values
- **Headers**: First row is treated as column headers
- **Encoding**: UTF-8
- **Example**:

```csv
Policy ID,Policy Name,Status,Amount
POL001,Home Insurance,Active,1200.00
POL002,Car Insurance,Active,800.00
POL003,Life Insurance,Pending,1500.00
```

### XLSX Files

- **Format**: Excel spreadsheet (.xlsx)
- **Sheets**: First sheet is automatically selected
- **Headers**: First row is treated as column headers
- **Data Types**: All data is converted to strings for consistency

## Utility Functions

### readFile(file: File): Promise<FileReadResult>

Reads a file and returns the parsed data.

```typescript
import { readFile } from "@/lib/fileUtils";

const file = event.target.files[0];
const result = await readFile(file);

if (result.success) {
  console.log("File data:", result.data);
} else {
  console.error("Error:", result.error);
}
```

### validateFile(file: File): { valid: boolean; error?: string }

Validates a file before reading.

```typescript
import { validateFile } from "@/lib/fileUtils";

const validation = validateFile(file);
if (!validation.valid) {
  console.error("Validation error:", validation.error);
}
```

### readCSVFile(file: File): Promise<FileReadResult>

Reads only CSV files.

```typescript
import { readCSVFile } from "@/lib/fileUtils";

const result = await readCSVFile(file);
```

### readXLSXFile(file: File): Promise<FileReadResult>

Reads only XLSX files (requires 'xlsx' package).

```typescript
import { readXLSXFile } from "@/lib/fileUtils";

const result = await readXLSXFile(file);
```

## Error Handling

The component handles various error scenarios:

- **Invalid file format**: Only CSV and XLSX files are accepted
- **File too large**: Files exceeding the maximum size limit
- **Empty files**: Files with no content
- **Corrupted files**: Files that cannot be parsed
- **Missing worksheets**: XLSX files without worksheets

## Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
<FileReader
  className="my-custom-class"
  // ... other props
/>
```

## Examples

### Policy Upload Modal

```tsx
import { FileReader } from "@/components/common/FileReader";

const PolicyUploadModal = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);

  const handleFileRead = (data: FileData) => {
    setFileData(data);
    // Validate policy data
    if (data.headers.includes("Policy ID") && data.headers.includes("Status")) {
      // Process policies
      console.log("Processing", data.totalRows, "policies");
    }
  };

  return (
    <div className="p-6">
      <h2>Upload Policies</h2>
      <FileReader
        onFileRead={handleFileRead}
        onError={(error) => alert(error)}
        showPreview={true}
      />
      {fileData && (
        <div className="mt-4">
          <p>Found {fileData.totalRows} policies</p>
          <p>Columns: {fileData.headers.join(", ")}</p>
        </div>
      )}
    </div>
  );
};
```

### Data Import Component

```tsx
import { FileReader } from "@/components/common/FileReader";

const DataImport = () => {
  const [importedData, setImportedData] = useState<FileData[]>([]);

  const handleFileRead = (data: FileData) => {
    setImportedData((prev) => [...prev, data]);
  };

  return (
    <div className="space-y-4">
      <FileReader
        onFileRead={handleFileRead}
        onError={(error) => console.error(error)}
        acceptedFormats={[".csv"]}
        maxSize={2 * 1024 * 1024} // 2MB
      />

      {importedData.map((data, index) => (
        <div key={index} className="p-4 border rounded">
          <h3>File {index + 1}</h3>
          <p>Rows: {data.totalRows}</p>
          <p>Columns: {data.headers.join(", ")}</p>
        </div>
      ))}
    </div>
  );
};
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- React 18+
- TypeScript 4.5+
- Tailwind CSS
- Lucide React (for icons)
- xlsx (for XLSX file parsing)

## License

This component is part of the IAS Policies UI project.
