import React, { useState } from "react";
import { FileText, Eye, Download, Calendar, File, MoreVertical } from "lucide-react";
import { Button } from "../../../../common/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../common/ui/card";
import { Badge } from "../../../../common/ui/badge";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: "Approved" | "Pending" | "Rejected";
  url?: string;
  size?: string;
}

interface DocumentPreviewProps {
  documents: Document[];
  title?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  documents, 
  title = "Documents" 
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    documents.length > 0 ? documents[0] : null
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400">Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleView = (document: Document) => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else {
      // Fallback: show alert or implement modal preview
      alert(`Viewing ${document.name}`);
    }
  };

  const handleDownload = (document: Document) => {
    if (document.url) {
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      link.click();
    } else {
      // Fallback: show alert
      alert(`Downloading ${document.name}`);
    }
  };

  if (documents.length === 0) {
    return (
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
            <FileText className="w-5 h-5" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500 dark:text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No documents available</p>
            <p className="text-sm">No documents have been uploaded yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel - Document List */}
      <div>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between dark:text-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>{title}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 py-2 px-3 text-xs font-medium text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-600">
                <div className="col-span-3">Document Type</div>
                <div className="col-span-3">File Name</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Uploaded Date</div>
                <div className="col-span-2">Actions</div>
              </div>
              
              {/* Table Rows */}
              {documents.map((doc, index) => (
                <div 
                  key={doc.id || index}
                  className={`grid grid-cols-12 gap-4 py-3 px-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors ${
                    selectedDocument?.id === doc.id || (selectedDocument === null && index === 0)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      : ''
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="col-span-3 text-sm font-medium text-gray-900 dark:text-slate-100">
                    {doc.type}
                  </div>
                  <div className="col-span-3 text-sm text-gray-600 dark:text-slate-300">
                    {doc.name}
                  </div>
                  <div className="col-span-2">
                    {getStatusBadge(doc.status)}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 dark:text-slate-400">
                    {formatDate(doc.uploadedAt)}
                  </div>
                  <div className="col-span-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Document Preview */}
      <div>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
              <FileText className="w-5 h-5" />
              <span>Document Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDocument ? (
              <div className="space-y-4">
                {/* Document Info Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      Document
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">
                      {selectedDocument.name}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      {formatDate(selectedDocument.uploadedAt)}
                    </p>
                    {selectedDocument.size && (
                      <p className="text-xs text-blue-500 dark:text-blue-400">
                        Size: {selectedDocument.size}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(selectedDocument)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(selectedDocument)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Document Preview Area */}
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-8 text-center">
                  <div className="bg-blue-500 rounded-lg h-64 flex items-center justify-center mb-4">
                    <div className="text-white text-center">
                      <FileText className="w-16 h-16 mx-auto mb-2 opacity-80" />
                      <p className="text-lg font-medium">Document Preview</p>
                      <p className="text-sm opacity-80">PDF or Image content would appear here</p>
                    </div>
                  </div>
                  
                  {/* 404-style placeholder */}
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-500 mb-2">404</div>
                    <p className="text-gray-600 dark:text-slate-400">
                      Document preview not available
                    </p>
                  </div>
                </div>

                {/* All Documents Thumbnails */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                    All Documents ({documents.length} files)
                  </h4>
                  <div className="flex space-x-3">
                    {documents.map((doc, index) => (
                      <div
                        key={doc.id || index}
                        className={`w-16 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                          selectedDocument?.id === doc.id || (selectedDocument === null && index === 0)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                        }`}
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <File className={`w-6 h-6 ${
                          selectedDocument?.id === doc.id || (selectedDocument === null && index === 0)
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-slate-400'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a document to preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentPreview;
