// Fake review data for demo purposes

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

// Generate fake reviews for drinks
const REVIEW_TEMPLATES: Omit<Review, 'id'>[] = [
  {
    userName: 'Sarah M.',
    rating: 5,
    date: '2024-01-15',
    comment: 'Absolutely love this drink! The flavor is perfectly balanced and not too sweet. My new go-to order!',
    helpful: 24,
    verified: true,
  },
  {
    userName: 'Mike T.',
    rating: 4,
    date: '2024-01-12',
    comment: 'Great taste, though I wish it came in a larger size. The quality is consistently good every time I order.',
    helpful: 18,
    verified: true,
  },
  {
    userName: 'Emily R.',
    rating: 5,
    date: '2024-01-10',
    comment: 'This is hands down the best coffee drink I\'ve ever had. The coconut flavor is so smooth!',
    helpful: 31,
    verified: true,
  },
  {
    userName: 'David L.',
    rating: 4,
    date: '2024-01-08',
    comment: 'Really good! I get this almost every morning. Perfect caffeine kick to start the day.',
    helpful: 12,
    verified: false,
  },
  {
    userName: 'Jessica K.',
    rating: 5,
    date: '2024-01-05',
    comment: 'So refreshing! I love that I can customize the sweetness level. Will definitely order again.',
    helpful: 27,
    verified: true,
  },
  {
    userName: 'Chris P.',
    rating: 3,
    date: '2024-01-03',
    comment: 'It\'s good but a bit pricey for the size. The taste is nice though, especially with oat milk.',
    helpful: 8,
    verified: true,
  },
  {
    userName: 'Amanda W.',
    rating: 5,
    date: '2024-01-01',
    comment: 'My favorite drink at Luckin! The baristas always make it perfectly. Highly recommend!',
    helpful: 42,
    verified: true,
  },
  {
    userName: 'Ryan H.',
    rating: 4,
    date: '2023-12-28',
    comment: 'Solid choice for an afternoon pick-me-up. Not too strong, not too weak. Just right!',
    helpful: 15,
    verified: false,
  },
];

// Get reviews for a specific drink (deterministic based on drink name)
export function getReviewsForDrink(drinkName: string): Review[] {
  // Use drink name to seed which reviews to show (for consistency)
  const seed = drinkName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numReviews = 3 + (seed % 3); // 3-5 reviews per drink

  const reviews: Review[] = [];
  for (let i = 0; i < numReviews; i++) {
    const templateIndex = (seed + i) % REVIEW_TEMPLATES.length;
    const template = REVIEW_TEMPLATES[templateIndex];

    // Adjust rating slightly based on drink
    let rating = template.rating;
    if (drinkName.toLowerCase().includes('signature')) {
      rating = Math.min(5, rating + 0.5);
    }

    reviews.push({
      ...template,
      id: `${drinkName}-review-${i}`,
      rating: Math.round(rating),
    });
  }

  return reviews.sort((a, b) => b.helpful - a.helpful);
}

// Calculate average rating for a drink
export function getAverageRating(drinkName: string): { average: number; count: number } {
  const reviews = getReviewsForDrink(drinkName);
  if (reviews.length === 0) return { average: 0, count: 0 };

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

// Format date for display
export function formatReviewDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
