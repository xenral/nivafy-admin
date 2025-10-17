/**
 * Search Service Types
 */

import { BaseEntity, PaginatedResponse } from '../nivafy';

// ============ Entities ============

export interface SearchQuery extends BaseEntity {
  userId?: string;
  query: string;
  results: number;
  clickedResultId?: string;
  executionTime: number;
}

export interface SearchIndex extends BaseEntity {
  entityType: 'USER' | 'POST' | 'COMMENT';
  entityId: string;
  content: string;
  metadata?: Record<string, any>;
  isIndexed: boolean;
  lastIndexedAt?: string;
}

// ============ Statistics ============

export interface SearchStats {
  totalSearches: number;
  searchesToday: number;
  uniqueSearchers: number;
  averageResultsPerSearch: number;
  averageExecutionTime: number;
  totalIndexedEntities: number;
  indexedUsers: number;
  indexedPosts: number;
  indexedComments: number;
  topSearches: Array<{ query: string; count: number }>;
  searchesByHour: Array<{ hour: number; count: number }>;
}

export interface TrendingSearch {
  query: string;
  count: number;
  trend: 'rising' | 'stable' | 'falling';
  changePercent: number;
}

export interface PopularSearch {
  query: string;
  totalSearches: number;
  uniqueUsers: number;
  averageResults: number;
}

// ============ DTOs ============

export interface ReindexRequestDto {
  entityType?: 'USER' | 'POST' | 'COMMENT' | 'ALL';
  batchSize?: number;
}

export interface SearchFilters {
  userId?: string;
  minResults?: number;
  maxResults?: number;
  startDate?: string;
  endDate?: string;
}

// ============ Response Types ============

export type SearchQueriesResponse = PaginatedResponse<SearchQuery>;
export type TrendingSearchesResponse = TrendingSearch[];
export type PopularSearchesResponse = PopularSearch[];
