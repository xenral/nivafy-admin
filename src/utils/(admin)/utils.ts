// utils.ts
import {
  UserType,
  ResponsePostType,
  roleIcons,
  badgeStatusColorMap,
} from '@/data/(admin)/data';
import { LucideIcon, CheckCircle2, Clock, Shield, User } from 'lucide-react';

// User Utilities
export const formatLastLogin = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRoleIcon = (role: string): LucideIcon => {
  return roleIcons[role] || User;
};

export const getStatusIcon = (
  status: 'Active' | 'Pending' | 'Deactivated'
): LucideIcon => {
  switch (status) {
    case 'Active':
      return CheckCircle2;
    case 'Pending':
      return Clock;
    case 'Deactivated':
      return Shield;
    default:
      return CheckCircle2;
  }
};

export const getStatusColor = (
  status: 'Active' | 'Pending' | 'Deactivated'
): string => {
  switch (status) {
    case 'Active':
      return 'text-green-500';
    case 'Pending':
      return 'text-yellow-500';
    case 'Deactivated':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const filterUsers = (
  users: UserType[],
  searchTerm: string,
  departmentFilter: string,
  roleFilter: string,
  statusFilter: string
): UserType[] => {
  return users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (departmentFilter === 'All Departments' ||
        user.role.toString() === departmentFilter) &&
      (roleFilter === 'All Roles' || user.role.toString() === roleFilter) &&
      (statusFilter === 'All Status' || user.status.toString() === statusFilter)
  );
};

// Post Utilities
export const filterPosts = (
  posts: ResponsePostType[],
  filters: {
    search: string;
    status: string;
    category: string;
    author: string;
  }
): ResponsePostType[] => {
  return posts.filter(
    (post) =>
      (post.description &&
        post.description.toLowerCase().includes(filters.search.toLowerCase())) ||
      (filters.status === 'all' || post.type === filters.status) ||
      (filters.category === 'all' ||
        (post.location &&
          post.location.address
            .toLowerCase()
            .includes(filters.category.toLowerCase()))) ||
      (filters.author === 'all' ||
        (post.user &&
          post.user.username
            .toLowerCase()
            .includes(filters.author.toLowerCase())))
  );
};

export const sortPosts = (
  posts: ResponsePostType[],
  sortBy: 'createdAt' | 'likesCount' | 'commentsCount',
  sortOrder: 'asc' | 'desc'
): ResponsePostType[] => {
  return [...posts].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export const formatPublishedDate = (dateString: string | null) => {
  if (!dateString) return 'Not published';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getUniqueAuthors = (posts: ResponsePostType[]): string[] => {
  const authors = new Set(
    posts.map((post) => (post.user ? post.user.username : ''))
  );
  return ['all', ...Array.from(authors)];
};

export const getBadgeStatusColor = (status: string) => {
  return badgeStatusColorMap.get(status) || 'secondary';
};
