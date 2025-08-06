import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Eye, X, Megaphone, Calendar, AlertTriangle } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    message: '',
    isActive: true,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [searchTerm, pagination.current]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 20,
        search: searchTerm
      });

      const response = await axiosInstance.get(`/api/announcements?${params}`);
      setAnnouncements(response.data.announcements);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (editingAnnouncement) {
        response = await axiosInstance.put(`/api/announcements/${editingAnnouncement._id}`, formData);
      } else {
        response = await axiosInstance.post('/api/announcements', formData);
      }

      if (response.data.success) {
        toast.success(editingAnnouncement ? 'Announcement updated successfully' : 'Announcement created successfully');
        setShowModal(false);
        resetForm();
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error(error.response?.data?.message || 'Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      message: announcement.message || '',
      isActive: announcement.isActive !== false,
      startDate: announcement.startDate ? new Date(announcement.startDate).toISOString().slice(0, 16) : '',
      endDate: announcement.endDate ? new Date(announcement.endDate).toISOString().slice(0, 16) : ''
    });
    setShowModal(true);
  };

  const handleDeleteAnnouncement = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteModal(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/api/announcements/${announcementToDelete._id}`);
      toast.success('Announcement deleted successfully');
      setShowDeleteModal(false);
      setAnnouncementToDelete(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteAnnouncement = () => {
    setShowDeleteModal(false);
    setAnnouncementToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      message: '',
      isActive: true,
      startDate: '',
      endDate: ''
    });
    setEditingAnnouncement(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600">Manage site-wide announcements</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus size={20} />
            <span>Add Announcement</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-primary-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-3 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-primary-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50 border-b border-primary-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-100">
                {announcements.map((announcement) => (
                  <tr key={announcement._id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {announcement.message}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        announcement.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {announcement.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">
                        <p>Start: {formatDate(announcement.startDate)}</p>
                        {announcement.endDate && (
                          <p>End: {formatDate(announcement.endDate)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="text-primary-600 hover:text-primary-700 p-2 hover:bg-primary-100 rounded-lg transition-colors"
                          title="Edit Announcement"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Announcement"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-primary-100">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                disabled={pagination.current <= 1}
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                className="relative inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-lg text-primary-700 bg-white hover:bg-primary-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={pagination.current >= pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-lg text-primary-700 bg-white hover:bg-primary-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.current}</span> of{' '}
                  <span className="font-medium">{pagination.pages}</span> ({pagination.total} total announcements)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                    disabled={pagination.current <= 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-primary-300 bg-white text-sm font-medium text-primary-500 hover:bg-primary-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                    disabled={pagination.current >= pagination.pages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-primary-300 bg-white text-sm font-medium text-primary-500 hover:bg-primary-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter announcement message"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active Announcement
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-primary-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-primary-300 rounded-xl text-primary-700 hover:bg-primary-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 font-medium"
                  >
                    {loading ? 'Saving...' : editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showDeleteModal && announcementToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Delete Announcement
                    </h3>
                  </div>
                </div>
                <button
                  onClick={cancelDeleteAnnouncement}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  disabled={deleteLoading}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this announcement? This action cannot be undone.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Megaphone className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Announcement Details:</span>
                  </div>
                  <div className="space-y-1 text-sm text-red-700">
                    <p><span className="font-medium">Message:</span> {announcementToDelete.message}</p>
                    <p><span className="font-medium">Status:</span> {announcementToDelete.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={cancelDeleteAnnouncement}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAnnouncement}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Delete Announcement</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;