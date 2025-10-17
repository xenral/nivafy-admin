import { PostData, PostStats } from '@/types/posts';

/**
 * Format post publication date
 */
export const formatPublishedDate = (dateString: string | null): string => {
  if (!dateString) return 'Not published';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString();
};

/**
 * Format post creation date
 */
export const formatCreatedDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format numbers with abbreviations (K, M, etc.)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Calculate reading time based on word count
 */
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

/**
 * Filter posts by various criteria
 */
export const filterPosts = (
  posts: PostData[],
  filters: {
    search?: string;
    status?: string;
    category?: string;
    author?: string;
    featured?: boolean;
  }
): PostData[] => {
  return posts.filter((post) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.author.name.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all' && filters.status !== 'All Status') {
      if (post.status !== filters.status.toLowerCase()) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all' && filters.category !== 'All Categories') {
      if (post.category !== filters.category) return false;
    }

    // Author filter
    if (filters.author && filters.author !== 'all' && filters.author !== 'All Authors') {
      if (post.author.name !== filters.author) return false;
    }

    // Featured filter
    if (filters.featured !== undefined) {
      if (post.featured !== filters.featured) return false;
    }

    return true;
  });
};

/**
 * Sort posts by various criteria
 */
export const sortPosts = (
  posts: PostData[],
  sortBy: 'title' | 'createdAt' | 'publishedAt' | 'views' | 'likes' | 'comments',
  order: 'asc' | 'desc' = 'desc'
): PostData[] => {
  return [...posts].sort((a, b) => {
    let aValue: string | number | null;
    let bValue: string | number | null;

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'publishedAt':
        aValue = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        bValue = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        break;
      case 'views':
        aValue = a.views;
        bValue = b.views;
        break;
      case 'likes':
        aValue = a.likes;
        bValue = b.likes;
        break;
      case 'comments':
        aValue = a.comments;
        bValue = b.comments;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    const numA = Number(aValue);
    const numB = Number(bValue);
    
    return order === 'asc' ? numA - numB : numB - numA;
  });
};

/**
 * Get post statistics
 */
export const getPostStatistics = (posts: PostData[]): PostStats => {
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const draftPosts = posts.filter(p => p.status === 'draft').length;
  const pendingPosts = posts.filter(p => p.status === 'pending').length;
  const archivedPosts = posts.filter(p => p.status === 'archived').length;
  const featuredPosts = posts.filter(p => p.featured).length;

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);

  const avgReadTime = posts.length > 0 
    ? posts.reduce((sum, post) => sum + post.readTime, 0) / posts.length
    : 0;

  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const postsThisMonth = posts.filter(post => 
    new Date(post.createdAt) >= thisMonth
  ).length;

  const postsThisWeek = posts.filter(post => 
    new Date(post.createdAt) >= thisWeek
  ).length;

  const topPerformingPost = posts.reduce((top, post) => 
    post.views > top.views ? post : top,
    posts[0] || { id: '', title: '', views: 0 }
  );

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    pendingPosts,
    archivedPosts,
    featuredPosts,
    totalViews,
    totalLikes,
    totalComments,
    avgReadTime,
    postsThisMonth,
    postsThisWeek,
    topPerformingPost: {
      id: topPerformingPost.id,
      title: topPerformingPost.title,
      views: topPerformingPost.views,
    },
  };
};

/**
 * Get unique authors from posts
 */
export const getUniqueAuthors = (posts: PostData[]): string[] => {
  const authors = posts.map(post => post.author.name);
  return Array.from(new Set(authors));
};

/**
 * Get unique categories from posts
 */
export const getUniqueCategories = (posts: PostData[]): string[] => {
  const categories = posts.map(post => post.category);
  return Array.from(new Set(categories));
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};