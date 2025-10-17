export interface PostData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived' | 'pending';
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
  slug: string;
  thumbnail: string;
  readTime: number; // in minutes
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface PostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  pendingPosts: number;
  archivedPosts: number;
  featuredPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgReadTime: number;
  postsThisMonth: number;
  postsThisWeek: number;
  topPerformingPost: {
    id: string;
    title: string;
    views: number;
  };
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postsCount: number;
}

export interface PostComment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar: string;
    email: string;
  };
  content: string;
  status: 'approved' | 'pending' | 'spam';
  createdAt: string;
  parentId?: string; // for nested comments
  likes: number;
}