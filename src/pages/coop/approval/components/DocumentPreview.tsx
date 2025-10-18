import React, { useState, useEffect } from "react";
import { FileText, Eye, Download, File } from "lucide-react";
import { Button } from "../../../../common/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../common/ui/card";
import { Badge } from "../../../../common/ui/badge";
import API from "../../../../config/axios-config";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: "Approved" | "Pending" | "Rejected";
  url?: string;
  size?: string;
  fileType?: string;
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
  const [documentBlobUrls, setDocumentBlobUrls] = useState<Record<string, string>>({});
  const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set());
  const [failedDocuments, setFailedDocuments] = useState<Set<string>>(new Set());

  // Function to fetch document with authentication
  const fetchDocumentWithAuth = async (document: Document) => {
    if (!document.url || documentBlobUrls[document.id]) return;
    
    setLoadingDocuments(prev => new Set(prev).add(document.id));
    
    try {
      console.log('[FETCH DOCUMENT] Fetching document with auth:', document.url);
      console.log('[FETCH DOCUMENT] Document details:', {
        id: document.id,
        name: document.name,
        type: document.type,
        fileType: document.fileType
      });
      
      // Extract the relative path from the URL
      const url = new URL(document.url);
      const relativePath = url.pathname;
      console.log('[FETCH DOCUMENT] Extracted relative path:', relativePath);
      
      const response = await API.get(relativePath, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf, image/*, */*'
        }
      });
      
      console.log('[FETCH DOCUMENT] API response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        dataType: typeof response.data,
        dataSize: response.data?.size
      });
      
      const blob = new Blob([response.data], { type: response.data.type || 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      
      setDocumentBlobUrls(prev => ({
        ...prev,
        [document.id]: blobUrl
      }));
      
      console.log('[FETCH DOCUMENT] Successfully created blob URL for:', document.name, 'Blob URL:', blobUrl);
    } catch (error: any) {
      console.error('[FETCH DOCUMENT] Error fetching document:', error);
      console.error('[FETCH DOCUMENT] Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: document.url
      });
      
      // Mark document as failed
      setFailedDocuments(prev => new Set(prev).add(document.id));
    } finally {
      setLoadingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(document.id);
        return newSet;
      });
    }
  };

  // Fetch document when selected
  useEffect(() => {
    if (selectedDocument && !documentBlobUrls[selectedDocument.id]) {
      fetchDocumentWithAuth(selectedDocument);
    }
  }, [selectedDocument]);

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
    const urlToUse = documentBlobUrls[document.id] || document.url;
    if (urlToUse) {
      const link = window.document.createElement('a');
      link.href = urlToUse;
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
              <div className="grid grid-cols-10 gap-4 py-2 px-3 text-xs font-medium text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-600">
                <div className="col-span-4">Document Type</div>
                <div className="col-span-3">File Name</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Uploaded Date</div>
              </div>
              
              {/* Table Rows */}
              {documents.map((doc, index) => (
                <div 
                  key={doc.id || index}
                  className={`grid grid-cols-10 gap-4 py-3 px-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors ${
                    selectedDocument?.id === doc.id || (selectedDocument === null && index === 0)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      : ''
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="col-span-4 text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
                    {doc.type}
                  </div>
                  <div className="col-span-3 text-sm text-gray-600 dark:text-slate-300 truncate">
                    {doc.name}
                  </div>
                  <div className="col-span-2">
                    {getStatusBadge(doc.status)}
                  </div>
                  <div className="col-span-1 text-sm text-gray-500 dark:text-slate-400">
                    {formatDate(doc.uploadedAt)}
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
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                  {selectedDocument.url ? (
                    <div className="w-full h-96">
                      {loadingDocuments.has(selectedDocument.id) ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600 dark:text-slate-400">Loading document...</p>
                          </div>
                        </div>
                      ) : selectedDocument.type?.toLowerCase().includes('pdf') || selectedDocument.fileType === 'application/pdf' ? (
                        <div className="w-full h-full">
                          {documentBlobUrls[selectedDocument.id] ? (
                            <iframe
                              src={documentBlobUrls[selectedDocument.id]}
                              className="w-full h-full rounded-lg border-0"
                              title={selectedDocument.name}
                              onError={() => console.log('PDF iframe failed to load:', documentBlobUrls[selectedDocument.id])}
                              onLoad={() => console.log('PDF iframe loaded successfully:', documentBlobUrls[selectedDocument.id])}
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <div className="text-center">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                {failedDocuments.has(selectedDocument.id) ? (
                                  <>
                                    <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                                      Failed to load document
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-slate-500 mb-4">
                                      The document could not be loaded. This might be due to authentication or file access issues.
                                    </p>
                                    <div className="space-y-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setFailedDocuments(prev => {
                                            const newSet = new Set(prev);
                                            newSet.delete(selectedDocument.id);
                                            return newSet;
                                          });
                                          fetchDocumentWithAuth(selectedDocument);
                                        }}
                                        className="text-xs mr-2"
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Retry Load
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(selectedDocument.url, '_blank')}
                                        className="text-xs"
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Open Directly
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-lg font-medium text-gray-600 dark:text-slate-400 mb-2">
                                      Document not loaded
                                    </p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => fetchDocumentWithAuth(selectedDocument)}
                                      className="text-xs"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      Load Document
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="mt-2 text-center">
                            <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
                              If PDF doesn't load, try opening in new tab:
                            </p>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const urlToOpen = documentBlobUrls[selectedDocument.id] || selectedDocument.url;
                                console.log('Opening PDF in new tab:', urlToOpen);
                                window.open(urlToOpen, '_blank');
                              }}
                              className="text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Open PDF
                            </Button> */}
                          </div>
                        </div>
                      ) : selectedDocument.type?.toLowerCase().includes('image') || selectedDocument.fileType?.startsWith('image/') ? (
                        <img
                          src={documentBlobUrls[selectedDocument.id] || selectedDocument.url}
                          alt={selectedDocument.name}
                          className="w-full h-full object-contain rounded-lg"
                          onError={() => {
                            if (!documentBlobUrls[selectedDocument.id]) {
                              fetchDocumentWithAuth(selectedDocument);
                            }
                          }}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium text-gray-600 dark:text-slate-400 mb-2">
                              Document Preview
                            </p>
                            <p className="text-sm text-gray-500 dark:text-slate-500 mb-4">
                              This file type cannot be previewed directly
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(selectedDocument)}
                              className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Open in New Tab
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-600 dark:text-slate-400 mb-2">
                          Document Preview
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-500">
                          No document URL available
                        </p>
                      </div>
                    </div>
                  )}
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
