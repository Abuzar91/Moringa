import React, { useState, useEffect } from "react";
import {
  Star,
  User,
  Send,
  ThumbsUp,
  Edit,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const ReviewSystem = ({ productId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [overallStats, setOverallStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [ratingStats, setRatingStats] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [sortBy, setSortBy] = useState("newest");
  const [editingReview, setEditingReview] = useState(null);
  const [helpfulLoading, setHelpfulLoading] = useState({});
  const [helpfulClicked, setHelpfulClicked] = useState(new Set());
  const [displayedReviews, setDisplayedReviews] = useState(1);

  const { user } = useAuth();

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
    userName: "",
    userEmail: "",
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, sortBy]);

  useEffect(() => {
    if (user) {
      setReviewForm(prev => ({
        ...prev,
        userName: user.name || '',
        userEmail: user.email || ''
      }));
    }
  }, [user]);

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/reviews/product/${productId}`, {
        params: {
          page,
          limit: 100, // Load more reviews for show more functionality
          sort: sortBy,
        },
      });

      if (response.data.success) {
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
        setOverallStats(response.data.overallStats);
        setRatingStats(response.data.ratingStats);
      } else {
        throw new Error(response.data.message || "Failed to load reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (
      !reviewForm.rating ||
      !reviewForm.comment.trim() ||
      !reviewForm.userName.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await axiosInstance.post("/api/reviews", {
        productId,
        ...reviewForm,
      });

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setReviewForm({
          rating: 0,
          comment: "",
          userName: user?.name || "",
          userEmail: user?.email || "",
        });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        throw new Error(response.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = async (e) => {
    e.preventDefault();

    if (!editForm.rating || !editForm.comment.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      
      const response = await axiosInstance.put(
        `/api/reviews/${editingReview._id}`,
        editForm
      );

      if (response.data.success) {
        toast.success("Review updated successfully!");
        setEditingReview(null);
        setEditForm({ rating: 0, comment: "" });
        fetchReviews(); // Refresh reviews
      } else {
        throw new Error(response.data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.response?.data?.message || "Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      
      const response = await axiosInstance.delete(`/api/reviews/${reviewId}`);

      if (response.data.success) {
        toast.success("Review deleted successfully!");
        fetchReviews(); 
      } else {
        throw new Error(response.data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  const handleHelpfulClick = async (reviewId) => {
    if (helpfulLoading[reviewId] || helpfulClicked.has(reviewId)) return;

    try {
      setHelpfulLoading((prev) => ({ ...prev, [reviewId]: true }));

      const response = await axiosInstance.post(`/api/reviews/${reviewId}/helpful`);

      if (response.data.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review._id === reviewId
              ? { ...review, helpfulCount: response.data.helpfulCount }
              : review
          )
        );
        
        setHelpfulClicked(prev => new Set([...prev, reviewId]));
        toast.success("Thank you for your feedback!");
      } else {
        throw new Error(response.data.message || "Failed to mark as helpful");
      }
    } catch (error) {
      console.error("Error marking as helpful:", error);
      toast.error(error.response?.data?.message || "Failed to mark as helpful");
    } finally {
      setHelpfulLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const startEditing = (review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setEditForm({ rating: 0, comment: "" });
  };

  const handleRatingClick = (rating, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev) => ({ ...prev, rating }));
    } else {
      setReviewForm((prev) => ({ ...prev, rating }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingPercentage = (rating) => {
    const ratingData = ratingStats.find((stat) => stat._id === rating);
    return ratingData
      ? (ratingData.count / overallStats.totalReviews) * 100
      : 0;
  };

  const isUserReview = (review) => {
    if (user && review.user && review.user._id === user._id) {
      return true;
    }
    if (user && review.userEmail === user.email) {
      return true;
    }
    return false;
  };

  const handleShowMore = () => {
    setDisplayedReviews(prev => Math.min(prev + 1, reviews.length));
  };

  const handleShowLess = () => {
    setDisplayedReviews(1);
    document.getElementById('reviews-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const visibleReviews = reviews.slice(0, displayedReviews);
  const hasMoreReviews = reviews.length > displayedReviews;
  const showingMore = displayedReviews > 1;

  if (loading && reviews.length === 0) {
    return (
      <div className="mt-16" id="reviews-section">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16" id="reviews-section">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Write a Review
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">
                {overallStats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(overallStats.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">
                Based on {overallStats.totalReviews} review
                {overallStats.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-8">
                    {rating}★
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getRatingPercentage(rating)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {Math.round(getRatingPercentage(rating))}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Write Your Review
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= reviewForm.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={reviewForm.userName}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        userName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={reviewForm.userEmail}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        userEmail: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review *
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {reviews.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {pagination.total} Review{pagination.total !== 1 ? "s" : ""}
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        )}

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <User size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to review this product!
              </p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Write the First Review
              </button>
            </div>
          ) : (
            visibleReviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                {editingReview && editingReview._id === review._id ? (
                  <form onSubmit={handleEditReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star, true)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                star <= editForm.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-400"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review
                      </label>
                      <textarea
                        value={editForm.comment}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check size={16} />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="text-green-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {review.user?.name || review.userName}
                          </h4>
                          {review.isVerified && (
                            <span className="text-sm text-green-600">
                              ✓ Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                          {isUserReview(review) && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => startEditing(review)}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Edit review"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete review"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-4">
                        {review.comment}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button 
                          onClick={() => handleHelpfulClick(review._id)}
                          disabled={helpfulLoading[review._id] || helpfulClicked.has(review._id)}
                          className={`flex items-center space-x-1 transition-colors ${
                            helpfulClicked.has(review._id)
                              ? 'text-green-600 cursor-not-allowed'
                              : 'hover:text-green-600 cursor-pointer'
                          }`}
                        >
                          <ThumbsUp size={14} />
                          <span>
                            {helpfulLoading[review._id] ? 'Loading...' : 
                             helpfulClicked.has(review._id) ? 'Thanks!' :
                             `Helpful (${review.helpfulCount || 0})`}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {reviews.length > 1 && (
          <div className="flex justify-center mt-8">
            {hasMoreReviews ? (
              <button
                onClick={handleShowMore}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <ChevronDown size={20} />
                <span>Show More Reviews</span>
              </button>
            ) : (
              showingMore && (
                <button
                  onClick={handleShowLess}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ChevronUp size={20} />
                  <span>Show Less Reviews</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;