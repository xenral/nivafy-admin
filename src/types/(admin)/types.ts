// types.ts
import { ReactNode } from 'react';
import { ChatGptModels, MediaType, PostVariantType } from './enum';

export interface RadioOption {
  label: string | ReactNode;
  value: number | string;
}

export interface PostImage {
  url: string;
  ratio: number;
  shimmer?: string;
}

export interface UploadedVideoResponse {
  duration: number;
  height: number;
  id: string;
  mute: boolean;
  name: string;
  url: string;
  width: number;
}

export interface UserType {
  avatar: string | null;
  banner: string | null;
  websiteUrl: string | null;
  username: string;
  birthDate: string;
  cellphone: string;
  email: string;
  firstName: string;
  followersCount: number;
  followingCount: number;
  id: number;
  isPrivate: boolean;
  lastName: string;
  role: number;
  sex: 'male' | 'female';
  status: number;
  bio: string | null;
  isFollowing?: boolean;
}

export interface PublicUserData
  extends Exclude<
    UserType,
    'email' | 'cellphone' | 'role' | 'birthDate' | 'sex' | 'status'
  > {}

export interface ThumbnailType {
  width: number;
  height: number;
  url: string;
}

export interface SlideType {
  url: string;
  width: number;
  height: number;
  thumbnails?: ThumbnailType[];
  size?: number;
  name?: string;
  id: string;
  mute?: boolean;
  cover?: SlideType;
}

export interface DimensionType {
  width: number;
  height: number;
}

export interface SearchedUserType
  extends Pick<
    UserType,
    | 'id'
    | 'username'
    | 'firstName'
    | 'lastName'
    | 'avatar'
    | 'isPrivate'
    | 'followersCount'
    | 'followingCount'
  > {}

export interface UserSearchResponseType {
  total: number;
  data: SearchedUserType[];
}

export interface UserPostPeopleType
  extends Pick<
    UserType,
    'id' | 'username' | 'firstName' | 'lastName' | 'avatar'
  > {}

export interface PostPeopleType {
  x: number;
  y: number;
  user?: UserPostPeopleType;
}

export interface TaggedPeopleOption {
  slideIndex: number;
  peopleIndex: number;
  people: PostPeopleType;
}

export interface PostSlideType {
  id: string;
  media: { type: MediaType; metadata: SlideType };
  people?: PostPeopleType[];
  selected?: boolean;
}

export interface ResponsePostType {
  alt?: string;
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
  type: PostVariantType;
  id: number;
  commentsCount: number;
  slides: PostSlideType[];
  description: string | null;
  people: string[] | null;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  user?: UserPostPeopleType;
  createdAt: string;
}

export interface MessageType {
  _id: string;
  text: string;
  createdAt: string;
}

export interface ChatMesageType {
  createdAt: string;
  senderId: number;
  receiverId: number;
  text: string;
  _id: string;
  readAt?: string;
  parent?: { text: string; _id: string };
}

export interface ChatItemType {
  unreadsCount: number;
  lastMessage?: ChatMesageType;
  user: UserPostPeopleType;
  messages: ChatMesageType[];
  _id: string;
}

export interface CommentType {
  id: number;
  createdAt: string;
  text: string;
  repliesCount: number;
  likesCount: number;
  isLiked: boolean;
  user: UserPostPeopleType;
  replies?: CommentType[];
  replyId?: number;
}

export interface CommentResponse {
  total: number;
  data: CommentType[];
}

export interface PostState {
  isLiked: ResponsePostType['isLiked'];
  likesCount: ResponsePostType['likesCount'];
  isInitiateLikeAnimation: boolean;
  commentModal: boolean;
  shareModal: boolean;
  showLike: boolean;
  isSaved: boolean;
  isCollapsedDescription: boolean;
  openDeleteConfirmationModal: boolean;
}

export interface FeedCacheType {
  hasMore: boolean;
  data: ResponsePostType['id'][];
}

export interface FormatNivafyTextOptions {
  dontFormatUsernames?: boolean;
  dontFormatHashtags?: boolean;
  dontFormatUrls?: boolean;
}

export interface TextPrompt {
  text: string;
  weight: number;
}

export interface ImageConfig {
  height: number;
  width: number;
  textPrompts: TextPrompt[];
  samples: number;
  seed: number;
  steps: number;
  stylePreset?: string;
  cfgScale?: number;
}

export interface ImageGenerationDocument {
  _id: string;
  config: ImageConfig;
  metadata: SlideType[];
  createdAt: string;
}

export interface AIHistoryType {
  total: number;
  data: ImageGenerationDocument[];
}

export interface HashtagInfoResponseType {
  id: number;
  name: string;
  postsCount: number;
}
export interface InScreenVideos {
  top: number;
  howMany: 'full' | 'half';
}

export interface AIConversationMessage {
  aiText?: string;
  createdAt: string;
  urls?: string[];
  userText: string;
  _id: string;
}

export interface AIConversationItem {
  _id: string;
  createdAt: string;
  purpose: string;
  title: string;
}

export interface AIConversationResponse {
  createdAt: string;
  message: {
    aiText: string;
    createdAt: string;
    _id: string;
  };
  aiText: string;
  title: string;
  _id: string;
}

export interface BuyResponse {
  url: string;
}

export interface NoticeCountResponse {
  count: number;
}

export interface AIConversationSuggestion {
  purpose: ChatGptModels;
  title: string;
  description?: string;
  _id: string;
}

export interface UserWallet {
  amount: number;
  available: number;
  frozen: number;
}

export interface AssetInfo {
  id: number;
  name: string;
  priceUsd: string;
  precision: number;
}
