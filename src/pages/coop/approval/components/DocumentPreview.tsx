import React, { useState, useEffect } from "react";
import { FileText, Eye, Download, File, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../../../common/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../common/ui/card";
import { Badge } from "../../../../common/ui/badge";
import API from "../../../../config/axios-config";
import { toast } from "react-hot-toast";
import documentService from "../../../../services/documentService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../common/ui/dialog";
import { Textarea } from "../../../../common/ui/textarea";
import { Label } from "../../../../common/ui/label";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

interface Document {
  id: string | number;
  name: string;
  type: string;
  uploadedAt: string;
  status: "Approved" | "Pending" | "Rejected"; // Partner status (backward compatibility)
  partnerStatus?: "Approved" | "Pending" | "Rejected"; // Partner status (explicit)
  superAdminStatus?: "Approved" | "Pending" | "Rejected"; // Super Admin status
  url?: string;
  size?: string;
  fileType?: string;
}

interface DocumentPreviewProps {
  documents: Document[];
  title?: string;
  onDocumentUpdate?: (documentId: string | number, status: "Approved" | "Pending" | "Rejected") => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  documents, 
  title = "Documents",
  onDocumentUpdate
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    documents.length > 0 ? documents[0] : null
  );
  const [documentBlobUrls, setDocumentBlobUrls] = useState<Record<string, string>>({});
  const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set());
  const [failedDocuments, setFailedDocuments] = useState<Set<string>>(new Set());
  const [processingDocuments, setProcessingDocuments] = useState<Set<string | number>>(new Set());
  const [documentsList, setDocumentsList] = useState<Document[]>(documents);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Function to fetch document with authentication
  const fetchDocumentWithAuth = async (document: Document) => {
    const docId = document.id.toString();
    if (!document.url || documentBlobUrls[docId]) return;
    
    setLoadingDocuments(prev => new Set(prev).add(docId));
    
    try {
      console.log('[FETCH DOCUMENT] Fetching document with auth:', document.url);
      console.log('[FETCH DOCUMENT] Document details:', {
        id: document.id,
        name: document.name,
        type: document.type,
        fileType: document.fileType
      });
      
      // Handle different URL formats - always use relative path for authenticated API calls
      let fetchUrl = document.url;
      
      if (document.url.startsWith('http://') || document.url.startsWith('https://')) {
        // Full URL - extract relative path for API call
        try {
          const urlObj = new URL(document.url);
          // Get the pathname, which should be relative to the backend
          fetchUrl = urlObj.pathname + urlObj.search; // Include query params if any
          // If the pathname doesn't start with /api, we might need to handle it differently
          // But first, try to see if the pathname already includes the API prefix
          if (fetchUrl.startsWith('/api')) {
            // Remove /api prefix since API instance already has baseURL
            fetchUrl = fetchUrl.replace(/^\/api/, '');
          }
        } catch (e) {
          // If URL parsing fails, try to extract pathname manually
          console.warn('[FETCH DOCUMENT] Failed to parse URL, attempting to extract path:', document.url);
          const match = document.url.match(/https?:\/\/[^\/]+(\/.*)/);
          if (match && match[1]) {
            fetchUrl = match[1];
            // Remove /api prefix if present
            if (fetchUrl.startsWith('/api')) {
              fetchUrl = fetchUrl.replace(/^\/api/, '');
            }
          } else {
            fetchUrl = document.url;
          }
        }
      } else {
        // Relative path - ensure it starts with /
        if (!document.url.startsWith('/')) {
          fetchUrl = `/${document.url}`;
        }
      }
      
      const baseURL = (import.meta as any).env.VITE_BACKEND_URL || "/api";
      console.log('[FETCH DOCUMENT] Original URL:', document.url);
      console.log('[FETCH DOCUMENT] Base URL:', baseURL);
      console.log('[FETCH DOCUMENT] Using fetch URL:', fetchUrl);
      console.log('[FETCH DOCUMENT] Full URL will be:', baseURL + fetchUrl);
      
      // If files are served outside the API prefix, build absolute URL without /api
      const isFilesPath = fetchUrl.startsWith('/files/');
      let blobResp: Blob;
      if (isFilesPath) {
        // Use browser fetch to hit Vite proxy on /files and avoid CORS, attach token manually
        const token = localStorage.getItem('accessToken');
        const res = await fetch(fetchUrl, {
          headers: {
            'Accept': 'application/pdf, image/*, */*',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          const err: any = new Error(`HTTP ${res.status}: ${res.statusText}`);
          err.status = res.status;
          err.response = { status: res.status, statusText: res.statusText };
          throw err;
        }
        blobResp = await res.blob();
      } else {
        const response = await API.get(fetchUrl, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf, image/*, */*'
          }
        });
        const contentType = (response as any)?.headers?.['content-type'] || (document.fileType as string | undefined);
        blobResp = new Blob([response.data], { type: contentType });
      }
      
      console.log('[FETCH DOCUMENT] Loaded document blob:', {
        source: fetchUrl.startsWith('/files/') ? 'proxy-fetch' : 'axios',
        size: (blobResp as any)?.size,
        type: (blobResp as any)?.type,
      });
      
      const blobUrl = URL.createObjectURL(blobResp);
      
      setDocumentBlobUrls(prev => ({
        ...prev,
        [docId]: blobUrl
      }));
      
      console.log('[FETCH DOCUMENT] Successfully created blob URL for:', document.name, 'Blob URL:', blobUrl);
    } catch (error: any) {
      console.error('[FETCH DOCUMENT] Error fetching document:', error);
      console.error('[FETCH DOCUMENT] Error details:', {
        message: error.message,
        status: error.status || error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: document.url,
        fetchUrl: fetchUrl
      });
      
      // Show more specific error message
      const status = error.status || error.response?.status;
      if (status === 404) {
        toast.error(`Document not found: ${document.name}`);
      } else if (status === 401) {
        toast.error('Authentication required to view document');
      } else if (status === 403) {
        toast.error('You do not have permission to view this document');
      } else {
        toast.error(`Failed to load document: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
      
      // Mark document as failed
      setFailedDocuments(prev => new Set(prev).add(docId));
    } finally {
      setLoadingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  // Update documents list when props change
  useEffect(() => {
    setDocumentsList(documents);
    // Update selected document if it exists in new documents list
    if (selectedDocument) {
      const updatedDoc = documents.find(doc => doc.id === selectedDocument.id);
      if (updatedDoc) {
        setSelectedDocument(updatedDoc);
      }
    }
  }, [documents]);

  // Fetch document when selected - auto-load for viewing
  useEffect(() => {
    if (selectedDocument && selectedDocument.url && !documentBlobUrls[selectedDocument.id.toString()]) {
      // Auto-load the document when selected so user can view it immediately
      fetchDocumentWithAuth(selectedDocument);
    }
  }, [selectedDocument?.id]);

  // Handle document approval
  const handleApprove = async (document: Document) => {
    if (!document.id) {
      toast.error("Invalid document ID");
      return;
    }

    const docIdForProcessing = document.id.toString();
    setProcessingDocuments(prev => new Set(prev).add(document.id).add(docIdForProcessing));
    try {
      const documentId = typeof document.id === 'string' ? parseInt(document.id, 10) : document.id;
      if (isNaN(documentId)) {
        throw new Error("Invalid document ID format");
      }
      await documentService.approveDocument(documentId);
      
      // Update document status (super admin status)
      const updatedList = documentsList.map(doc => 
        doc.id === document.id ? { ...doc, superAdminStatus: "Approved" as const } : doc
      );
      setDocumentsList(updatedList);
      
      // Update selected document if it's the one being approved
      if (selectedDocument?.id === document.id) {
        setSelectedDocument({ ...selectedDocument, superAdminStatus: "Approved" } as Document);
      }
      
      // Notify parent component
      if (onDocumentUpdate) {
        onDocumentUpdate(document.id, "Approved");
      }
      
      toast.success("Document approved successfully");
    } catch (error: any) {
      console.error("Error approving document:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to approve document");
    } finally {
      setProcessingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(document.id);
        newSet.delete(docIdForProcessing);
        return newSet;
      });
    }
  };

  // Handle document rejection
  const handleReject = async (document: Document, reason?: string) => {
    if (!document.id) {
      toast.error("Invalid document ID");
      return;
    }

    const docIdForProcessing = document.id.toString();
    setProcessingDocuments(prev => new Set(prev).add(document.id).add(docIdForProcessing));
    try {
      const documentId = typeof document.id === 'string' ? parseInt(document.id, 10) : document.id;
      if (isNaN(documentId)) {
        throw new Error("Invalid document ID format");
      }
      await documentService.rejectDocument(documentId, reason);
      
      // Update document status (super admin status)
      const updatedList = documentsList.map(doc => 
        doc.id === document.id ? { ...doc, superAdminStatus: "Rejected" as const } : doc
      );
      setDocumentsList(updatedList);
      
      // Update selected document if it's the one being rejected
      if (selectedDocument?.id === document.id) {
        setSelectedDocument({ ...selectedDocument, superAdminStatus: "Rejected" } as Document);
      }
      
      // Notify parent component
      if (onDocumentUpdate) {
        onDocumentUpdate(document.id, "Rejected");
      }
      
      toast.success("Document rejected successfully");
    } catch (error: any) {
      console.error("Error rejecting document:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to reject document");
    } finally {
      setProcessingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(document.id);
        newSet.delete(docIdForProcessing);
        return newSet;
      });
    }
  };

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

  const handleView = async (document: Document) => {
    const docId = document.id.toString();
    
    // If we have a blob URL, use it
    if (documentBlobUrls[docId]) {
      window.open(documentBlobUrls[docId], '_blank');
      return;
    }
    
    // If document has URL, fetch it first to ensure we have authentication
    if (document.url) {
      try {
        setLoadingDocuments(prev => new Set(prev).add(docId));
        
        let fetchUrl = document.url;
        if (document.url.startsWith('http://') || document.url.startsWith('https://')) {
          try {
            const urlObj = new URL(document.url);
            fetchUrl = urlObj.pathname;
            // Remove /api prefix if present since API instance already has baseURL
            if (fetchUrl.startsWith('/api')) {
              fetchUrl = fetchUrl.replace(/^\/api/, '');
            }
          } catch (e) {
            fetchUrl = document.url;
          }
        } else {
          // Relative path - ensure it starts with /
          if (!document.url.startsWith('/')) {
            fetchUrl = `/${document.url}`;
          }
        }
        
        const isFilesPath = fetchUrl.startsWith('/files/');
        let blobResp: Blob;
        let statusCode: number | undefined;
        
        if (isFilesPath) {
          const token = localStorage.getItem('accessToken');
          const res = await fetch(fetchUrl, {
            headers: {
              'Accept': 'application/pdf, image/*, */*',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
          });
          statusCode = res.status;
          if (!res.ok) {
            const err: any = new Error(`HTTP ${res.status}: ${res.statusText}`);
            err.status = res.status;
            err.response = { status: res.status, statusText: res.statusText };
            throw err;
          }
          blobResp = await res.blob();
        } else {
          const response = await API.get(fetchUrl, {
            responseType: 'blob',
            headers: {
              'Accept': 'application/pdf, image/*, */*'
            }
          });
          const contentType = (response as any)?.headers?.['content-type'] || (document.fileType as string | undefined);
          blobResp = new Blob([response.data], { type: contentType });
        }

        const blobUrl = URL.createObjectURL(blobResp);
        
        setDocumentBlobUrls(prev => ({
          ...prev,
          [docId]: blobUrl
        }));
        
        window.open(blobUrl, '_blank');
      } catch (error: any) {
        console.error('[VIEW DOCUMENT] Error:', error);
        console.error('[VIEW DOCUMENT] Error details:', {
          message: error.message,
          status: error.status || error.response?.status,
          url: document.url,
          fetchUrl: fetchUrl
        });
        
        const status = error.status || error.response?.status;
        if (status === 404) {
          toast.error(`Document not found: ${document.name}`);
        } else if (status === 401) {
          toast.error('Authentication required to view document');
        } else if (status === 403) {
          toast.error('You do not have permission to view this document');
        } else {
          toast.error(`Failed to open document: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
      } finally {
        setLoadingDocuments(prev => {
          const newSet = new Set(prev);
          newSet.delete(docId);
          return newSet;
        });
      }
    } else {
      toast.error('Document URL not available');
    }
  };

  const handleDownload = async (document: Document) => {
    const docId = document.id.toString();
    
    // If we have a blob URL, use it
    if (documentBlobUrls[docId]) {
      const link = window.document.createElement('a');
      link.href = documentBlobUrls[docId];
      link.download = document.name || 'document';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      return;
    }
    
    // If document has URL, fetch it first to ensure we have authentication
    if (document.url) {
      try {
        setLoadingDocuments(prev => new Set(prev).add(docId));
        
        let fetchUrl = document.url;
        if (document.url.startsWith('http://') || document.url.startsWith('https://')) {
          try {
            const urlObj = new URL(document.url);
            fetchUrl = urlObj.pathname + urlObj.search; // Include query params if any
            // Remove /api prefix if present since API instance already has baseURL
            if (fetchUrl.startsWith('/api')) {
              fetchUrl = fetchUrl.replace(/^\/api/, '');
            }
            console.log('[DOWNLOAD DOCUMENT] Extracted path from full URL:', {
              original: document.url,
              pathname: fetchUrl
            });
          } catch (e) {
            console.warn('[DOWNLOAD DOCUMENT] Failed to parse URL, using as-is:', document.url);
            fetchUrl = document.url;
          }
        } else {
          // Relative path - ensure it starts with /
          if (!document.url.startsWith('/')) {
            fetchUrl = `/${document.url}`;
          }
        }
        
        const isFilesPath = fetchUrl.startsWith('/files/');
        let blobResp: Blob;
        if (isFilesPath) {
          const token = localStorage.getItem('accessToken');
          const res = await fetch(fetchUrl, {
            headers: {
              'Accept': 'application/pdf, image/*, */*',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
          });
          if (!res.ok) {
            const err: any = new Error(`HTTP ${res.status}: ${res.statusText}`);
            err.status = res.status;
            err.response = { status: res.status, statusText: res.statusText };
            throw err;
          }
          blobResp = await res.blob();
        } else {
          const response = await API.get(fetchUrl, {
            responseType: 'blob',
            headers: {
              'Accept': 'application/pdf, image/*, */*'
            }
          });
          const contentType = (response as any)?.headers?.['content-type'] || (document.fileType as string | undefined);
          blobResp = new Blob([response.data], { type: contentType });
        }

        const blobUrl = URL.createObjectURL(blobResp);
        
        setDocumentBlobUrls(prev => ({
          ...prev,
          [docId]: blobUrl
        }));
        
        const link = window.document.createElement('a');
        link.href = blobUrl;
        link.download = document.name || 'document';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      } catch (error: any) {
        console.error('[DOWNLOAD DOCUMENT] Error:', error);
        console.error('[DOWNLOAD DOCUMENT] Error details:', {
          message: error.message,
          status: error.status || error.response?.status,
          url: document.url,
          fetchUrl: fetchUrl
        });
        
        const status = error.status || error.response?.status;
        if (status === 404) {
          toast.error(`Document not found: ${document.name}`);
        } else if (status === 401) {
          toast.error('Authentication required to download document');
        } else if (status === 403) {
          toast.error('You do not have permission to download this document');
        } else {
          toast.error(`Failed to download document: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
      } finally {
        setLoadingDocuments(prev => {
          const newSet = new Set(prev);
          newSet.delete(docId);
          return newSet;
        });
      }
    } else {
      toast.error('Document URL not available');
    }
  };

  if (documentsList.length === 0) {
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
                  <div className="col-span-2">Partner Status</div>
                <div className="col-span-1">Uploaded Date</div>
              </div>
              
              {/* Table Rows */}
              {documentsList.map((doc, index) => (
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
                    {getStatusBadge(doc.partnerStatus || doc.status || "Pending")}
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
                  {/* Status Information */}
                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Partner Status:</span>
                      {getStatusBadge((selectedDocument.partnerStatus || selectedDocument.status || "Pending"))}
                    </div>
                    {selectedDocument.superAdminStatus !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Super Admin Status:</span>
                        {getStatusBadge(selectedDocument.superAdminStatus)}
                      </div>
                    )}
                    {(selectedDocument.partnerStatus || selectedDocument.status || "Pending") !== "Approved" && (
                      <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <p className="text-xs text-yellow-800 dark:text-yellow-200">
                          ⚠️ <strong>Partner Approval Required:</strong> The partner must approve this document before super admin can approve or reject it.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Approve/Reject Actions - Only show if partner has approved and super admin hasn't processed */}
                  {((selectedDocument.partnerStatus || selectedDocument.status || "Pending") === "Approved" && 
                    (selectedDocument.superAdminStatus === undefined || selectedDocument.superAdminStatus === "Pending")) && (
                    <div className="flex space-x-3 mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(selectedDocument)}
                        disabled={processingDocuments.has(selectedDocument.id) || processingDocuments.has(selectedDocument.id.toString())}
                        className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/30"
                      >
                        {processingDocuments.has(selectedDocument.id) || processingDocuments.has(selectedDocument.id.toString()) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRejectDialog(true)}
                        disabled={processingDocuments.has(selectedDocument.id) || processingDocuments.has(selectedDocument.id.toString())}
                        className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                      >
                        {processingDocuments.has(selectedDocument.id) || processingDocuments.has(selectedDocument.id.toString()) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                {/* Document Preview Area */}
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                  {selectedDocument.url ? (
                    <div className="w-full h-96">
                      {loadingDocuments.has(selectedDocument.id.toString()) ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600 dark:text-slate-400">Loading document...</p>
                          </div>
                        </div>
                      ) : selectedDocument.type?.toLowerCase().includes('pdf') || selectedDocument.fileType === 'application/pdf' ? (
                        <div className="w-full h-full">
                          {documentBlobUrls[selectedDocument.id.toString()] ? (
                            <DocViewer
                              documents={[{
                                uri: documentBlobUrls[selectedDocument.id.toString()],
                                fileType: 'pdf',
                                fileName: selectedDocument.name,
                              }]}
                              pluginRenderers={DocViewerRenderers}
                              style={{ width: '100%', height: '100%' }}
                              config={{ header: { disableHeader: true } }}
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <div className="text-center">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                {failedDocuments.has(selectedDocument.id.toString()) ? (
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
                                            newSet.delete(selectedDocument.id.toString());
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
                        </div>
                      ) : selectedDocument.type?.toLowerCase().includes('image') || selectedDocument.fileType?.startsWith('image/') ? (
                        <div className="w-full h-full">
                          {documentBlobUrls[selectedDocument.id.toString()] ? (
                            <img
                              src={documentBlobUrls[selectedDocument.id.toString()]}
                              alt={selectedDocument.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : failedDocuments.has(selectedDocument.id.toString()) ? (
                            <div className="h-full flex items-center justify-center">
                              <div className="text-center">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Failed to load image</p>
                                <p className="text-sm text-gray-500 dark:text-slate-500 mb-4">The image could not be loaded. It may be missing or require authentication.</p>
                                <div className="space-y-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setFailedDocuments(prev => {
                                        const s = new Set(prev);
                                        s.delete(selectedDocument.id.toString());
                                        return s;
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
                              </div>
                            </div>
                          ) : (
                            <img
                              src={selectedDocument.url}
                              alt={selectedDocument.name}
                              className="w-full h-full object-contain rounded-lg"
                              onError={() => {
                                if (!failedDocuments.has(selectedDocument.id.toString())) {
                                  fetchDocumentWithAuth(selectedDocument);
                                  setFailedDocuments(prev => new Set(prev).add(selectedDocument.id.toString()));
                                }
                              }}
                            />
                          )}
                        </div>
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
                    All Documents ({documentsList.length} files)
                  </h4>
                  <div className="flex space-x-3">
                    {documentsList.map((doc, index) => (
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

      {/* Reject Document Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">Rejection Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter reason for rejection (optional)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleReject(selectedDocument!, rejectReason || undefined);
                  setShowRejectDialog(false);
                  setRejectReason("");
                }}
                disabled={processingDocuments.has(selectedDocument?.id || '') || processingDocuments.has(selectedDocument?.id?.toString() || '')}
              >
                Reject Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentPreview;
