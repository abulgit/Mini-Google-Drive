// Dashboard.jsx
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFiles } from '../hooks/useFiles'
import { useStorage } from '../hooks/useStorage'
import { fileService } from '../services/api'
import { StorageOverview } from '../components/dashboard/StorageOverview'
import { getDisplayName } from '../utils/fileHelpers'
import { FiLoader, FiFile } from 'react-icons/fi'

export default function Dashboard() {
  const { token, logout } = useAuth()
  const { 
    files, 
    uploading, 
    error, 
    setError, 
    getFiles, 
    deleteFile, 
    setUploading 
  } = useFiles()
  
  const { 
    storageStats, 
    getStorageStats, 
    checkStorageLimit 
  } = useStorage()

  // Add a reference to the file input
  const fileInputRef = useRef(null);

  // Add this state at the top of the Dashboard component
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          await Promise.all([getFiles(), getStorageStats()]);
        } catch (error) {
          console.error("Loading error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      // Only load data if we don't have files yet
      if (files.length === 0) {
        loadData();
      }
    }
  }, [token]);

  const uploadFile = async (file) => {
    if (!file || !token) return

    setUploading(true)
    setError('')

    try {
      const storageCheck = checkStorageLimit(file.size)
      if (!storageCheck.hasSpace) {
        setError(`Storage limit exceeded. You have ${storageCheck.remainingMB}MB remaining`)
        return
      }

      const { data: authParams } = await fileService.getUploadAuth()
      const { data: uploadData } = await fileService.uploadToImageKit(file, authParams)
      
      await fileService.saveFileMetadata({
        filename: uploadData.name,
        actualFilename: file.name,
        fileId: uploadData.fileId,
        url: uploadData.url,
        size: uploadData.size
      })

      await getFiles()
      await getStorageStats()
      
      // Reset the file input after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.response?.data?.message || 'File upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId) => {
    // Add confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    try {
      await deleteFile(fileId);
      // Update storage stats after successful deletion
      await getStorageStats();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete file');
    }
  };

  const FileListSkeleton = () => (
    <div className="animate-pulse space-y-2">
      <div className="mb-4">
        <div className="h-10 bg-zinc-700 rounded-lg"></div>
      </div>
      
      {[...Array(5)].map((_, index) => (
        <div 
          key={index}
          className="p-3 border border-zinc-700 rounded-lg bg-zinc-800 flex justify-between items-center"
        >
          <div className="flex items-center space-x-3 flex-1">
            <div className="p-2 bg-zinc-700 rounded">
              <FiFile className="w-5 h-5 text-zinc-600" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
              <div className="h-3 bg-zinc-700 rounded w-16"></div>
            </div>
          </div>
          <div className="w-20 h-8 bg-zinc-700 rounded"></div>
        </div>
      ))}
    </div>
  );

  if (!token) return <div className="p-4">Redirecting to login...</div>

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold text-zinc-50">My Files</h1>
          <button 
            onClick={logout} 
            className="text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">
          <StorageOverview storageStats={storageStats} />
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => uploadFile(e.target.files?.[0])}
              className="block w-full text-sm text-zinc-300
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-zinc-800 file:text-zinc-200
                hover:file:bg-zinc-700
                cursor-pointer"
              disabled={uploading}
            />
          </label>
          {uploading && (
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <FiLoader className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        {isLoading ? (
          <FileListSkeleton />
        ) : (
          <>
            <div className="space-y-2">
              {files.length === 0 ? (
                <p className="text-zinc-400">No files uploaded yet</p>
              ) : (
                files.map(file => (
                  <div 
                    key={file._id} 
                    className="p-3 border border-zinc-700 rounded-lg bg-zinc-800 hover:bg-zinc-750 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {file.actualFilename || getDisplayName(file.filename)}
                      </a>
                      <span className="text-sm text-zinc-400">
                        {(file.size / 1024).toFixed(1)}KB
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-md hover:bg-zinc-700"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}