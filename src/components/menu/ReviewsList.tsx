'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Review, formatReviewDate } from '@/lib/fake-data/reviews';
import StarRating from './StarRating';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface ReviewsListProps {
  reviews: Review[];
  drinkName: string;
}

export default function ReviewsList({ reviews, drinkName }: ReviewsListProps) {
  const { t } = useTranslation();

  const handleHelpful = (reviewId: string) => {
    toast.success(t('reviews.thanksFeedback'));
  };

  const handleWriteReview = () => {
    toast.success(t('reviews.demoSubmit'));
  };

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">{t('reviews.noReviews')}</p>
        <button
          onClick={handleWriteReview}
          className="mt-4 rounded-full bg-[#1A3C8B] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2D5BB9]"
        >
          {t('reviews.beFirst')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Write review button */}
      <button
        onClick={handleWriteReview}
        className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-[#1A3C8B] hover:text-[#1A3C8B]"
      >
        {t('reviews.writeReview')}
      </button>

      {/* Reviews list */}
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-gray-200 p-4"
        >
          {/* Header */}
          <div className="mb-2 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.userName}</span>
                {review.verified && (
                  <span className="flex items-center gap-0.5 text-xs text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    {t('reviews.verified')}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{formatReviewDate(review.date)}</p>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>

          {/* Comment */}
          <p className="text-sm text-gray-700">{review.comment}</p>

          {/* Helpful button */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => handleHelpful(review.id)}
              className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 transition-colors hover:border-[#1A3C8B] hover:text-[#1A3C8B]"
            >
              <ThumbsUp className="h-3 w-3" />
              {t('reviews.helpful').replace('{count}', review.helpful.toString())}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
