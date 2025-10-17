// data.ts

import {
  Users,
  Shield,
  Clock,
  CheckCircle2,
  User,
  Crown,
  LucideIcon,
  FileText,
  Edit,
} from 'lucide-react';
import { ResponsePostType, UserType } from '@/types/(admin)/types';
import { MediaType, PostVariantType } from '@/types/(admin)/enum';

export const usersData: UserType[] = [
  {
    id: 1,
    username: 'john.doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    avatar: '/avatars/01.png',
    banner: '/banners/01.png',
    websiteUrl: 'https://johndoe.com',
    birthDate: '1990-01-01',
    cellphone: '123-456-7890',
    followersCount: 1000,
    followingCount: 100,
    isPrivate: false,
    role: 1,
    sex: 'male',
    status: 1,
    bio: 'Software engineer and tech enthusiast.',
    isFollowing: false,
  },
  {
    id: 2,
    username: 'jane.smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    avatar: '/avatars/02.png',
    banner: '/banners/02.png',
    websiteUrl: 'https://janesmith.com',
    birthDate: '1992-02-02',
    cellphone: '234-567-8901',
    followersCount: 2000,
    followingCount: 200,
    isPrivate: false,
    role: 2,
    sex: 'female',
    status: 1,
    bio: 'Marketing guru and social media expert.',
    isFollowing: true,
  },
];

export const postsData: ResponsePostType[] = [
  {
    id: 1,
    user: {
      id: 1,
      username: 'john.doe',
      firstName: 'John',
      lastName: 'Doe',
      avatar: '/avatars/01.png',
    },
    slides: [
      {
        id: '1',
        media: {
          type: MediaType.IMAGE,
          metadata: {
            url: '/posts/01.png',
            width: 1080,
            height: 1080,
            id: '1',
          },
        },
      },
    ],
    description: 'This is a post by John Doe.',
    likesCount: 100,
    commentsCount: 10,
    isLiked: false,
    isSaved: false,
    type: PostVariantType.NORMAL,
    people: [],
    location: {
      address: 'New York, NY',
      latitude: 40.7128,
      longitude: -74.006,
    },
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    user: {
      id: 2,
      username: 'jane.smith',
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: '/avatars/02.png',
    },
    slides: [
      {
        id: '2',
        media: {
          type: MediaType.IMAGE,
          metadata: {
            url: '/posts/02.png',
            width: 1080,
            height: 1080,
            id: '2',
          },
        },
      },
    ],
    description: 'This is a post by Jane Smith.',
    likesCount: 200,
    commentsCount: 20,
    isLiked: true,
    isSaved: true,
    type: PostVariantType.AI,
    people: [],
    location: {
      address: 'Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    createdAt: '2023-01-02T00:00:00.000Z',
  },
];

export const userStats = [
  { label: 'Total Users', value: 1024, icon: Users },
  {
    label: 'Active Users',
    value: 876,
    icon: CheckCircle2,
    color: 'text-green-500',
  },
  {
    label: 'Pending Users',
    value: 52,
    icon: Clock,
    color: 'text-yellow-500',
  },
  {
    label: 'Deactivated Users',
    value: 96,
    icon: Shield,
    color: 'text-red-500',
  },
];

export const postStats = {
  totalPosts: postsData.length,
  publishedPosts: postsData.filter((p) => p.type === PostVariantType.NORMAL)
    .length,
  draftPosts: postsData.filter((p) => p.type === PostVariantType.AI).length,
  totalViews: postsData.reduce((sum, p) => sum + p.likesCount, 0),
  totalLikes: postsData.reduce((sum, p) => sum + p.likesCount, 0),
  totalComments: postsData.reduce((sum, p) => sum + p.commentsCount, 0),
};

export const departments = [
  'All Departments',
  'Engineering',
  'Marketing',
  'Sales',
  'Support',
  'Human Resources',
];

export const roles = ['All Roles', 'Admin', 'Editor', 'User', 'Guest'];

export const statuses = ['All Status', 'Active', 'Pending', 'Deactivated'];

export const roleIcons: { [key: string]: LucideIcon } = {
  Admin: Crown,
  Editor: User,
  User: User,
  Guest: User,
};

export const statusColors: { [key: string]: string } = {
  Active: 'bg-green-500',
  Pending: 'bg-yellow-500',
  Deactivated: 'bg-red-500',
};

export const categories = [
  { id: 1, name: 'Technology', slug: 'technology' },
  { id: 2, name: 'Lifestyle', slug: 'lifestyle' },
  { id: 3, name: 'Programming', slug: 'programming' },
  { id: 4, name: 'Design', slug: 'design' },
  { id: 5, name: 'Food', slug: 'food' },
];

export const statusColorMap = new Map([
  ['published', 'success'],
  ['draft', 'warning'],
  ['pending', 'secondary'],
  ['archived', 'default'],
]);

export const badgeStatusColorMap = new Map([
  ['published', 'success'],
  ['draft', 'warning'],
  ['pending', 'secondary'],
  ['archived', 'default'],
]);

export const statusIconMap = new Map([
  ['published', CheckCircle2],
  ['draft', Edit],
  ['pending', Clock],
  ['archived', FileText],
]);
