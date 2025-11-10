import React, { useState, useEffect } from "react";
import { FileText, Eye, Download, CheckCircle, XCircle } from "lucide-react";
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
  documents?: Document[];
  userId?: number | string;
  title?: string;
  onDocumentUpdate?: (documentId: string | number, status: "Approved" | "Pending" | "Rejected") => void;
  entityStatus?: "Approved" | "Pending" | "Rejected"; // Entity super admin status
  entityAdminStatus?: "Approved" | "Pending" | "Rejected"; // Entity partner/admin status
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  documents: documentsProp, 
  userId,
  title = "Documents",
  onDocumentUpdate,
  entityStatus,
  entityAdminStatus
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentBlobUrls, setDocumentBlobUrls] = useState<Record<string, string>>({});
  const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set());
  const [failedDocuments, setFailedDocuments] = useState<Set<string>>(new Set());
  const [processingDocuments, setProcessingDocuments] = useState<Set<string | number>>(new Set());
  const [documentsList, setDocumentsList] = useState<Document[]>(documentsProp || []);
  const [loadingDocumentsList, setLoadingDocumentsList] = useState<boolean>(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Function to fetch document with authentication
  const fetchDocumentWithAuth = async (document: Document) => {
    const docId = document.id.toString();
    if (!document.url || documentBlobUrls[docId]) return;
    
    setLoadingDocuments(prev => new Set(prev).add(docId));
    
    // Handle different URL formats - always use relative path for authenticated API calls
    let fetchUrl = document.url;
    
    try {
      console.log('[FETCH DOCUMENT] Fetching document with auth:', document.url);
      console.log('[FETCH DOCUMENT] Document details:', {
        id: document.id,
        name: document.name,
        type: document.type,
        fileType: document.fileType
      });
      
      if (document.url.startsWith('http://') || document.url.startsWith('https://')) {
        // Full URL - extract relative path for API call
        try {
          const urlObj = new URL(document.url);
          // Get the pathname, which should be relative to the backend
          fetchUrl = urlObj.pathname + urlObj.search; // Include query params if any
        } catch (e) {
          // If URL parsing fails, try to extract pathname manually
          console.warn('[FETCH DOCUMENT] Failed to parse URL, attempting to extract path:', document.url);
          const match = document.url.match(/https?:\/\/[^\/]+(\/.*)/);
          if (match && match[1]) {
            fetchUrl = match[1];
          } else {
            fetchUrl = document.url;
          }
        }
      } else {
        // Relative path - ensure it starts with /
        if (!document.url.startsWith('/')) {
          fetchUrl = `/${document.url}`;
        } else {
          fetchUrl = document.url;
        }
      }
      
      const baseURL = (import.meta as any).env.VITE_BACKEND_URL || "/api";
      const isProduction = (import.meta as any).env.PROD;
      const filesServerURL = (import.meta as any).env.VITE_FILES_SERVER_URL || "http://10.8.100.39:5001";
      
      console.log('[FETCH DOCUMENT] Original URL:', document.url);
      console.log('[FETCH DOCUMENT] Base URL:', baseURL);
      console.log('[FETCH DOCUMENT] Using fetch URL:', fetchUrl);
      console.log('[FETCH DOCUMENT] Is Production:', isProduction);
      
      // Check if this is a file path that should use the files server
      // The API returns fileUrl as /files/agents/11/filename.png (relative path)
      // The server expects /api/files/agents/11/filename.png
      // In development: Vite proxy forwards /api/files/* and /files/* to http://10.8.100.39:5001/api/files/*
      // In production: Need to use full URL directly to http://10.8.100.39:5001/api/files/*
      const isApiFilesPath = fetchUrl.startsWith('/api/files/');
      const isFilesPath = fetchUrl.startsWith('/files/');
      let blobResp: Blob;
      
      if (isApiFilesPath || isFilesPath) {
        // Construct the full URL for file requests
        let fullFileUrl = fetchUrl;
        
        if (isProduction) {
          // In production, use full URL to files server
          // Convert /files/* to /api/files/* and prepend files server URL
          if (isFilesPath) {
            fullFileUrl = `${filesServerURL}/api${fetchUrl}`;
          } else if (isApiFilesPath) {
            fullFileUrl = `${filesServerURL}${fetchUrl}`;
          }
        } else {
          // In development, use relative URL (Vite proxy will handle it)
          // Convert /files/* to /api/files/* for consistency
          if (isFilesPath) {
            fullFileUrl = `/api${fetchUrl}`;
          }
        }
        
        console.log('[FETCH DOCUMENT] Full file URL:', fullFileUrl);
        
        // Use browser fetch to hit Vite proxy (dev) or files server (prod), attach token manually
        const token = localStorage.getItem('accessToken');
        const res = await fetch(fullFileUrl, {
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
        // For other API endpoints, use Axios API instance
        // Remove /api prefix if present since API instance already has baseURL
        if (fetchUrl.startsWith('/api')) {
          fetchUrl = fetchUrl.replace(/^\/api/, '');
        }
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
        source: (isApiFilesPath || isFilesPath) ? 'proxy-fetch' : 'axios',
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

  // Fetch documents from API if userId is provided
  useEffect(() => {
    const fetchDocumentsFromAPI = async () => {
      if (!userId) return;
      
      setLoadingDocumentsList(true);
      try {
        const docs = await documentService.getUserDocuments(userId);
        // Transform documents to match DocumentPreview format
        const transformedDocs = docs.map((doc: any) => {
          // Use relative path from API - DocumentPreview will handle authenticated fetching
          // The API returns fileUrl as a relative path like "/files/factories/19/..."
          const constructedUrl = doc.fileUrl || doc.url || '';
          
          // Map status: API returns status as partner status
          const partnerStatus = doc.status || 'Pending';
          // Check for superAdminStatus field (if API returns it)
          const superAdminStatus = doc.superAdminStatus || doc.superAdminApprovalStatus || undefined;
          
          // Normalize status values
          const normalizeStatus = (s: string): "Approved" | "Pending" | "Rejected" => {
            const upper = s?.toUpperCase();
            if (upper === "APPROVED") return "Approved";
            if (upper === "REJECTED") return "Rejected";
            return "Pending";
          };

          return {
            id: doc.id || doc.documentId,
            name: doc.name || doc.documentName || `Document ${doc.id}`,
            type: doc.type || doc.documentType || 'Document',
            uploadedAt: doc.uploadedAt || doc.createdAt || new Date().toISOString(),
            status: normalizeStatus(partnerStatus), // Keep for backward compatibility
            partnerStatus: normalizeStatus(partnerStatus),
            superAdminStatus: superAdminStatus ? normalizeStatus(superAdminStatus) : undefined,
            url: constructedUrl,
            size: doc.size || (doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB` : 'Unknown'),
            fileType: doc.fileType || doc.mimeType
          };
        });
        
        setDocumentsList(transformedDocs);
        // Set first document as selected if available
        if (transformedDocs.length > 0 && !selectedDocument) {
          setSelectedDocument(transformedDocs[0]);
        }
      } catch (error: any) {
        console.error("Error fetching documents from API:", error);
        toast.error(error?.response?.data?.message || "Failed to load documents");
      } finally {
        setLoadingDocumentsList(false);
      }
    };

    if (userId) {
      fetchDocumentsFromAPI();
    }
  }, [userId]);

  // Update documents list when props change (for backward compatibility)
  useEffect(() => {
    if (documentsProp) {
      setDocumentsList(documentsProp);
      // Update selected document if it exists in new documents list
      if (selectedDocument) {
        const updatedDoc = documentsProp.find(doc => doc.id === selectedDocument.id);
        if (updatedDoc) {
          setSelectedDocument(updatedDoc);
        }
      } else if (documentsProp.length > 0) {
        setSelectedDocument(documentsProp[0]);
      }
    }
  }, [documentsProp]);

  // Fetch document when selected - auto-load for viewing
  useEffect(() => {
    if (selectedDocument && selectedDocument.url && !documentBlobUrls[selectedDocument.id.toString()]) {
      // Auto-load the document when selected so user can view it immediately
      fetchDocumentWithAuth(selectedDocument);
    }
  }, [selectedDocument?.id]);

  // If entity is approved by super admin, consider all documents approved (for now)
  useEffect(() => {
    if (entityStatus === "Approved") {
      setDocumentsList(prevList => {
        const updatedList = prevList.map(doc => {
          // Only update if document doesn't already have superAdminStatus set
          if (!doc.superAdminStatus || doc.superAdminStatus === "Pending") {
            return { ...doc, superAdminStatus: "Approved" as const };
          }
          return doc;
        });
        
        // Only update if there are changes
        const hasChanges = updatedList.some((doc, index) => 
          doc.superAdminStatus !== prevList[index]?.superAdminStatus
        );
        
        return hasChanges ? updatedList : prevList;
      });
      
      // Update selected document if it exists
      if (selectedDocument && (!selectedDocument.superAdminStatus || selectedDocument.superAdminStatus === "Pending")) {
        setSelectedDocument({ ...selectedDocument, superAdminStatus: "Approved" } as Document);
      }
    }
  }, [entityStatus, selectedDocument]);

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
      
      // Update document status (super admin status) - normalize ID comparison
      const updatedList = documentsList.map(doc => {
        const docId = typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id;
        const targetId = typeof document.id === 'string' ? parseInt(document.id, 10) : document.id;
        return docId === targetId ? { ...doc, superAdminStatus: "Approved" as const } : doc;
      });
      setDocumentsList(updatedList);
      
      // Update selected document - find the updated document from the list
      const targetId = typeof document.id === 'string' ? parseInt(document.id, 10) : document.id;
      const updatedDocument = updatedList.find(doc => {
        const docId = typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id;
        return docId === targetId;
      });
      if (updatedDocument) {
        const selectedId = selectedDocument ? (typeof selectedDocument.id === 'string' ? parseInt(selectedDocument.id, 10) : selectedDocument.id) : null;
        if (selectedId === targetId || !selectedDocument) {
          setSelectedDocument(updatedDocument);
        }
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
      
      // Update document status (super admin status) - normalize ID comparison
      const updatedList = documentsList.map(doc => {
        const docId = typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id;
        const targetId = typeof document.id === 'string' ? parseInt(document.id, 10) : document.id;
        return docId === targetId ? { ...doc, superAdminStatus: "Rejected" as const } : doc;
      });
      setDocumentsList(updatedList);
      
      // Update selected document - find the updated document from the list
      const targetId = typeof document.id === 'string' ? parseInt(document.id, 10) : document.id;
      const updatedDocument = updatedList.find(doc => {
        const docId = typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id;
        return docId === targetId;
      });
      if (updatedDocument) {
        const selectedId = selectedDocument ? (typeof selectedDocument.id === 'string' ? parseInt(selectedDocument.id, 10) : selectedDocument.id) : null;
        if (selectedId === targetId || !selectedDocument) {
          setSelectedDocument(updatedDocument);
        }
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
      let fetchUrl = document.url;
      try {
        setLoadingDocuments(prev => new Set(prev).add(docId));
        if (document.url.startsWith('http://') || document.url.startsWith('https://')) {
          try {
            const urlObj = new URL(document.url);
            fetchUrl = urlObj.pathname + urlObj.search;
          } catch (e) {
            fetchUrl = document.url;
          }
        } else {
          // Relative path - ensure it starts with /
          if (!document.url.startsWith('/')) {
            fetchUrl = `/${document.url}`;
          } else {
            fetchUrl = document.url;
          }
        }
        
        // Check if this is a file path that should use the files server
        const isApiFilesPath = fetchUrl.startsWith('/api/files/');
        const isFilesPath = fetchUrl.startsWith('/files/');
        let blobResp: Blob;
        
        if (isApiFilesPath || isFilesPath) {
          // Construct the full URL for file requests
          const isProduction = (import.meta as any).env.PROD;
          const filesServerURL = (import.meta as any).env.VITE_FILES_SERVER_URL || "http://10.8.100.39:5001";
          let fullFileUrl = fetchUrl;
          
          if (isProduction) {
            // In production, use full URL to files server
            if (isFilesPath) {
              fullFileUrl = `${filesServerURL}/api${fetchUrl}`;
            } else if (isApiFilesPath) {
              fullFileUrl = `${filesServerURL}${fetchUrl}`;
            }
          } else {
            // In development, use relative URL (Vite proxy will handle it)
            if (isFilesPath) {
              fullFileUrl = `/api${fetchUrl}`;
            }
          }
          
          // Use browser fetch to hit Vite proxy (dev) or files server (prod)
          const token = localStorage.getItem('accessToken');
          const res = await fetch(fullFileUrl, {
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
          // For other API endpoints, use Axios API instance
          if (fetchUrl.startsWith('/api')) {
            fetchUrl = fetchUrl.replace(/^\/api/, '');
          }
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
      let fetchUrl = document.url;
      try {
        setLoadingDocuments(prev => new Set(prev).add(docId));
        if (document.url.startsWith('http://') || document.url.startsWith('https://')) {
          try {
            const urlObj = new URL(document.url);
            fetchUrl = urlObj.pathname + urlObj.search; // Include query params if any
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
          } else {
            fetchUrl = document.url;
          }
        }
        
        // Check if this is a file path that should use the files server
        const isApiFilesPath = fetchUrl.startsWith('/api/files/');
        const isFilesPath = fetchUrl.startsWith('/files/');
        let blobResp: Blob;
        
        if (isApiFilesPath || isFilesPath) {
          // Construct the full URL for file requests
          const isProduction = (import.meta as any).env.PROD;
          const filesServerURL = (import.meta as any).env.VITE_FILES_SERVER_URL || "http://10.8.100.39:5001";
          let fullFileUrl = fetchUrl;
          
          if (isProduction) {
            // In production, use full URL to files server
            if (isFilesPath) {
              fullFileUrl = `${filesServerURL}/api${fetchUrl}`;
            } else if (isApiFilesPath) {
              fullFileUrl = `${filesServerURL}${fetchUrl}`;
            }
          } else {
            // In development, use relative URL (Vite proxy will handle it)
            if (isFilesPath) {
              fullFileUrl = `/api${fetchUrl}`;
            }
          }
          
          // Use browser fetch to hit Vite proxy (dev) or files server (prod)
          const token = localStorage.getItem('accessToken');
          const res = await fetch(fullFileUrl, {
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
          // For other API endpoints, use Axios API instance
          if (fetchUrl.startsWith('/api')) {
            fetchUrl = fetchUrl.replace(/^\/api/, '');
          }
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

  if (loadingDocumentsList) {
    return (
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
            <FileText className="w-5 h-5" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-slate-400">Loading documents...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <div className="col-span-4">File Name</div>
                <div className="col-span-2">Partner Status</div>
                <div className="col-span-2">Super Admin Status</div>
                <div className="col-span-2">Uploaded Date</div>
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
                    {doc.name}
                  </div>
                  <div className="col-span-2">
                    {getStatusBadge(doc.partnerStatus || doc.status || "Pending")}
                  </div>
                  <div className="col-span-2">
                    {doc.superAdminStatus ? getStatusBadge(doc.superAdminStatus) : getStatusBadge("Pending")}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 dark:text-slate-400">
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
          <CardContent>
            {selectedDocument ? (
              <div className="space-y-4">
                {/* Document Info Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex space-x-3">
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
                  {/* Warning Message */}
                  {(selectedDocument.partnerStatus || selectedDocument.status || "Pending") !== "Approved" && (
                    <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        ⚠️ <strong>Partner Approval Required:</strong> The partner must approve this document before super admin can approve or reject it.
                      </p>
                    </div>
                  )}

                  {/* Approve/Reject Actions - Only show if:
                      1. Partner has approved the document
                      2. Entity is approved by partner
                      3. Entity is NOT approved by super admin yet (if entity is approved, all documents are considered approved)
                      4. Super admin hasn't processed this document yet */}
                  {((selectedDocument.partnerStatus || selectedDocument.status || "Pending") === "Approved" && 
                    entityAdminStatus === "Approved" &&
                    entityStatus !== "Approved" &&
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
                    <div className="w-full h-96 overflow-y-auto">
                      {loadingDocuments.has(selectedDocument.id.toString()) ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600 dark:text-slate-400">Loading document...</p>
                          </div>
                        </div>
                      ) : selectedDocument.type?.toLowerCase().includes('pdf') || selectedDocument.fileType === 'application/pdf' ? (
                        <div className="w-full h-full overflow-y-auto">
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
                        <div className="w-full h-full overflow-y-auto">
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
