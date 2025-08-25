import {
  AlertCircle,
  CheckCircle,
  Download,
  FileSpreadsheet,
  Upload,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../../../common/ui/button";
import { Modal } from "../../../common/ui/modal";
import {
  GenericImportModalProps,
  ImportError,
  ImportProgress,
} from "../../../constants/general";
import {
  DEFAULT_CONFIG,
  generateTemplate,
  mapColumns,
  parseExcelFile,
  validateFile,
} from "../../../lib/excel-utils";
import { validateData } from "../../../lib/validation-utils";

export const GenericImportModal = <T,>({
  isOpen,
  onClose,
  entityName,
  expectedColumns,
  rowToEntity,
  onSubmit,
  templateData = [],
  config = {},
}: GenericImportModalProps<T>) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(
    {}
  );
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(
    null
  );
  const [isCancelling, setIsCancelling] = useState(false);

  const resetState = () => {
    setFile(null);
    setData([]);
    setColumnMapping({});
    setErrors([]);
    setIsValidating(false);
    setIsImporting(false);
    setIsDragOver(false);
    setImportProgress(null);
    setIsCancelling(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isImporting) {
      setIsCancelling(true);
      return;
    }
    resetState();
    onClose();
  };

  const processFile = async (selectedFile: File) => {
    if (!validateFile(selectedFile, finalConfig)) {
      return;
    }

    setIsValidating(true);
    setFile(selectedFile);

    try {
      const { headers, rows } = await parseExcelFile(selectedFile);

      if (rows.length > finalConfig.maxRows) {
        toast.error(
          `File too large. Please split into smaller files (max ${finalConfig.maxRows} rows). Current file has ${rows.length} rows.`
        );
        setIsValidating(false);
        return;
      }

      const mapping = mapColumns(headers, expectedColumns);
      setColumnMapping(mapping);

      const processedData = rows.map((row: unknown, index) => {
        const obj: any = {};
        headers.forEach((header, headerIndex) => {
          obj[header] = (row as any[])[headerIndex];
        });
        obj._rowIndex = index + 2;
        return obj;
      });

      setData(processedData);
      const validationErrors = validateData(
        processedData,
        expectedColumns,
        mapping
      );
      setErrors(validationErrors);
    } catch (error) {
      toast.error("Error reading Excel file. Please check the file format.");
      console.error("Excel processing error:", error);
    }

    setIsValidating(false);
  };

  const handleImport = async () => {
    if (errors.length > 0) {
      toast.error(`Cannot import: ${errors.length} validation errors found`);
      return;
    }

    if (data.length === 0) {
      toast.error("No data to import");
      return;
    }

    setIsImporting(true);
    setIsCancelling(false);

    const totalBatches = Math.ceil(data.length / finalConfig.batchSize);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        if (isCancelling) {
          toast.error("Import cancelled by user");
          break;
        }

        const startIndex = batchIndex * finalConfig.batchSize;
        const endIndex = Math.min(
          startIndex + finalConfig.batchSize,
          data.length
        );
        const batch = data.slice(startIndex, endIndex);

        setImportProgress({
          current: startIndex,
          total: data.length,
          percentage: Math.round((startIndex / data.length) * 100),
          currentBatch: batchIndex + 1,
          totalBatches,
        });

        try {
          const entities = batch.map((row) => rowToEntity(row, columnMapping));
          await onSubmit(entities);
          successCount += entities.length;

          const currentTotal = endIndex;
          setImportProgress({
            current: currentTotal,
            total: data.length,
            percentage: Math.round((currentTotal / data.length) * 100),
            currentBatch: batchIndex + 1,
            totalBatches,
          });
        } catch (error) {
          failCount += batch.length;
          console.error(`Failed to import batch ${batchIndex + 1}:`, error);
        }

        if (batchIndex < totalBatches - 1 && !isCancelling) {
          await new Promise((resolve) =>
            setTimeout(resolve, finalConfig.batchDelay)
          );
        }
      }

      if (!isCancelling) {
        if (failCount === 0) {
          toast.success(
            `Successfully imported ${successCount} ${entityName.toLowerCase()}s`
          );
          handleClose();
        } else {
          toast.error(
            `Import completed with errors: ${successCount} successful, ${failCount} failed`
          );
        }
      }
    } catch (error) {
      toast.error("Import failed. Please try again.");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
      setImportProgress(null);
      setIsCancelling(false);

      if (data.length > 500) {
        setData([]);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const downloadTemplate = () => {
    generateTemplate(
      expectedColumns,
      templateData,
      `${entityName.toLowerCase()}_import_template`
    );
  };

  const missingRequiredColumns = expectedColumns.filter(
    (col) => col.required && !columnMapping[col.field]
  );
  const canImport =
    file &&
    data.length > 0 &&
    errors.length === 0 &&
    missingRequiredColumns.length === 0;
  const errorFields = Array.from(new Set(errors.map((error) => error.field)));

  return (
    <Modal
      title={`Import ${entityName}s from Excel`}
      description={`Upload an Excel file to import multiple ${entityName.toLowerCase()}s at once`}
      isOpen={isOpen}
      onClose={handleClose}
      className="z-[101] w-full sm:w-[95%] lg:w-[90%] xl:w-[80%] h-[90%] mt-5"
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Side - File Selection */}
        <div className="flex-1 space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 text-gray-400">
                {file ? (
                  <FileSpreadsheet className="w-full h-full text-cyan-500" />
                ) : (
                  <Upload className="w-full h-full" />
                )}
              </div>

              {file ? (
                <div>
                  <p className="text-sm font-medium text-cyan-600">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB • {data.length} rows
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drop your Excel file here, or{" "}
                    <button
                      type="button"
                      className="text-cyan-600 hover:text-cyan-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports .xlsx and .xls files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isValidating || isImporting}
            >
              {file ? "Change File" : "Select File"}
            </Button>

            {file && (
              <Button
                type="button"
                variant="outline"
                onClick={resetState}
                disabled={isValidating || isImporting}
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Error Display */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h4 className="font-medium text-red-800">
                  Validation Errors Found
                </h4>
              </div>
              <div className="space-y-1">
                {errorFields.map((field, index) => (
                  <div key={index} className="text-sm text-red-700">
                    <span className="font-medium">{field}:</span> There are
                    errors in this column
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success State */}
          {canImport &&
            data.length > 0 &&
            errors.length === 0 &&
            missingRequiredColumns.length === 0 && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <CheckCircle className="w-5 h-5 text-cyan-500" />{" "}
                  <span className="font-medium text-cyan-500">
                    {" "}
                    {data.length} {entityName.toLowerCase()}
                    {data.length > 1 ? "s" : ""} imported successfully.{" "}
                  </span>{" "}
                </div>{" "}
              </div>
            )}

          {/* Import Progress */}
          {importProgress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing...</span>
                  <span>{importProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600">
                  Batch {importProgress.currentBatch} of{" "}
                  {importProgress.totalBatches} • {importProgress.current} of{" "}
                  {importProgress.total} items
                </div>
              </div>
            </div>
          )}

          {/* Import Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isValidating}
            >
              {isImporting ? "Cancel" : "Close"}
            </Button>
            <Button
              onClick={handleImport}
              disabled={!canImport || isImporting || isValidating}
            >
              {isImporting ? "Importing..." : `Submit`}
            </Button>
          </div>
        </div>

        {/* Right Side - Column Information */}
        <div className="flex-1 space-y-4 flex flex-col">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-2">Expected Columns</h3>
            <div className="bg-gray-50 rounded-lg px-4 max-h-[350px] overflow-y-auto">
              <div className="space-y-3">
                {" "}
                {expectedColumns.map((col, index) => (
                  <div
                    key={index}
                    className="py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        {col.field}
                        {col.required && (
                          <span className="text-red-500">* </span>
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {" "}
                      {col.description}{" "}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* File Size and Memory Limits */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">
              📊 File Size & Memory Limits
            </h4>
            <div className="space-y-2 text-sm text-amber-800">
              <div>
                • <strong>Max file size:</strong>{" "}
                {finalConfig.maxFileSize / (1024 * 1024)}MB
              </div>
              <div>
                • <strong>Max rows:</strong>{" "}
                {finalConfig.maxRows.toLocaleString()} per import
              </div>
              <div>
                • <strong>Browser memory:</strong> Large files may cause UI
                freezing
              </div>
              <div>
                • <strong>Validation time:</strong> Increases with file size
              </div>
            </div>
          </div>

          {/* Download Template */}
          {/* <Button
            variant="outline"
            onClick={downloadTemplate}
            className="w-full"
            disabled={isImporting}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Excel Template
          </Button> */}
          <div className="mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
              className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
            >
              <Download className="w-4 h-4 mr-2" /> Download Excel Template{" "}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
