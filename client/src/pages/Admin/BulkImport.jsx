import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminBottomBar from '../../components/AdminBottomBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { Toaster, toast } from "sonner";

const BulkImport = () => {
  const navigate = useNavigate();
  const [importHistory, setImportHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importType, setImportType] = useState('users');
  const [currentImport, setCurrentImport] = useState(null);

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchImportHistory();
  }, [navigate]);

  const fetchImportHistory = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/api/admin/bulk-import/history`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setImportHistory(data.data.imports);
      } else {
        toast.error('Failed to fetch import history');
      }
    } catch (error) {
      console.error('Fetch import history error:', error);
      toast.error('Network error while fetching import history');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Strict CSV validation
      const isCSV = file.type === 'text/csv' || 
                    file.type === 'application/vnd.ms-excel' || 
                    file.name.toLowerCase().endsWith('.csv');
      
      const isExcel = file.name.toLowerCase().endsWith('.xlsx') || 
                      file.name.toLowerCase().endsWith('.xls') ||
                      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                      file.type === 'application/vnd.ms-excel';
      
      if (isExcel) {
        toast.error('Excel files are not supported. Please convert to CSV format first.', {
          duration: 5000,
          style: {
            background: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#991B1B'
          }
        });
        event.target.value = ''; // Clear the input
        return;
      }
      
      if (!isCSV) {
        toast.error('Please select a valid CSV file only', {
          duration: 4000
        });
        event.target.value = ''; // Clear the input
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        event.target.value = ''; // Clear the input
        return;
      }
      
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      setUploading(true);
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const formData = new FormData();
      formData.append('csvFile', selectedFile);
      formData.append('importType', importType);

      const response = await fetch(`${backendUrl}/api/admin/bulk-import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Bulk import started successfully');
        setCurrentImport({ id: data.importId, status: 'processing' });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('csvFile');
        if (fileInput) fileInput.value = '';
        
        // Refresh history after a delay
        setTimeout(() => {
          fetchImportHistory();
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to start bulk import');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Network error while uploading file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,email,grNo,role,batch,branch
John Doe,john.doe@example.com,GR001,student,2024,Computer Science
Jane Smith,jane.smith@example.com,GR002,alumni,2020,Information Technology
Mike Johnson,mike.johnson@example.com,GR003,alumni,2019,Electronics
Sarah Wilson,sarah.wilson@example.com,GR004,student,2023,Mechanical Engineering
David Brown,david.brown@example.com,GR005,alumni,2018,Civil Engineering`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Template downloaded successfully');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <Upload className="w-5 h-5 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Import</h1>
              <p className="text-xs text-gray-500">Bulk Upload</p>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 poppins-semibold">Bulk Import</h1>
              <p className="text-gray-600">Import multiple users from CSV files</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={downloadTemplate}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="p-4 md:p-6">
          {/* Upload Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload CSV File</span>
              </CardTitle>
              <CardDescription>
                Upload a CSV file to import multiple users at once. Maximum file size: 10MB
                <br />
                <span className="text-amber-600 font-medium">⚠️ Only CSV files are supported. Excel files (.xlsx, .xls) must be converted to CSV first.</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="importType">Import Type</Label>
                    <Select value={importType} onValueChange={setImportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="users">All Users</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="alumni">Alumni Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="csvFile">CSV File</Label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">{selectedFile.name}</p>
                        <p className="text-xs text-blue-700">
                          Size: {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {uploading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Upload className="w-4 h-4" />
                          <span>Start Import</span>
                        </div>
                      )}
                    </Button>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-800 mb-2">CSV Format Requirements:</h4>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• Required columns: name, email, grNo, role</li>
                        <li>• Optional columns: batch, branch</li>
                        <li>• Role must be either 'student' or 'alumni'</li>
                        <li>• Email addresses must be valid and unique (no duplicates in CSV or database)</li>
                        <li>• GR numbers must be unique (no duplicates in CSV or database)</li>
                        <li>• Batch year must be between 1900-2050 if provided</li>
                        <li>• Files with same name cannot be imported within 24 hours</li>
                        <li>• Unique secure passwords will be generated for each user</li>
                        <li>• All imported users will be automatically verified</li>
                        <li>• Welcome emails with credentials will be sent using Nodemailer</li>
                        <li>• Users will need to complete their profiles after first login</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Import History</span>
                </div>
                {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {importHistory.length > 0 ? (
                <div className="space-y-4">
                  {importHistory.map((importRecord) => (
                    <div key={importRecord._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{importRecord.fileName}</h3>
                            <Badge className={`${getStatusColor(importRecord.status)} border-0`}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(importRecord.status)}
                                <span className="capitalize">{importRecord.status}</span>
                              </div>
                            </Badge>
                            <Badge variant="outline">
                              {importRecord.importType}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Total Records</p>
                              <p className="text-sm font-medium text-gray-900">{importRecord.totalRecords}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Successful</p>
                              <p className="text-sm font-medium text-green-600">{importRecord.successfulImports}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Failed</p>
                              <p className="text-sm font-medium text-red-600">{importRecord.failedImports}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">File Size</p>
                              <p className="text-sm font-medium text-gray-900">
                                {(importRecord.fileSize / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar for Processing */}
                          {importRecord.status === 'processing' && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Processing...</span>
                                <span className="text-xs text-gray-600">
                                  {Math.round(((importRecord.successfulImports + importRecord.failedImports) / importRecord.totalRecords) * 100)}%
                                </span>
                              </div>
                              <Progress 
                                value={((importRecord.successfulImports + importRecord.failedImports) / importRecord.totalRecords) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}

                          {/* Error Summary */}
                          {importRecord.errors && importRecord.errors.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                              <h4 className="text-sm font-medium text-red-800 mb-2">
                                Import Errors ({importRecord.errors.length})
                              </h4>
                              <div className="max-h-32 overflow-y-auto">
                                {importRecord.errors.slice(0, 5).map((error, index) => (
                                  <div key={index} className="text-xs text-red-700 mb-1">
                                    Row {error.row}: {error.error}
                                  </div>
                                ))}
                                {importRecord.errors.length > 5 && (
                                  <p className="text-xs text-red-600 font-medium">
                                    +{importRecord.errors.length - 5} more errors...
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Started: {formatDate(importRecord.createdAt)}</span>
                            {importRecord.processingCompletedAt && (
                              <span>Completed: {formatDate(importRecord.processingCompletedAt)}</span>
                            )}
                            <span>By: {importRecord.admin?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No import history found</p>
                  <p className="text-sm text-gray-400 mt-1">Upload your first CSV file to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>

        <AdminBottomBar />
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default BulkImport;
