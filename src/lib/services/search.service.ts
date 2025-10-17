/**
 * Search Service API
 * All endpoints for search management and indexing
 */

import api from '../api-client';
import {
  SearchQueriesResponse,
  TrendingSearchesResponse,
  PopularSearchesResponse,
  SearchStats,
  ReindexRequestDto,
  SearchFilters,
} from '@/types/services/search.types';
import { PaginationParams } from '@/types/nivafy';

const SERVICE = 'search';

export const searchService = {
  // ============ Statistics ============

  getStats: () =>
    api.get<SearchStats>(SERVICE, '/admin/search/stats'),

  getTrending: () =>
    api.get<TrendingSearchesResponse>(SERVICE, '/admin/search/trending'),

  getPopular: () =>
    api.get<PopularSearchesResponse>(SERVICE, '/admin/search/popular'),

  // ============ Search History ============

  getSearchQueries: (params?: PaginationParams & SearchFilters) =>
    api.get<SearchQueriesResponse>(SERVICE, '/admin/search/queries', params),

  // ============ Index Management (GOD only) ============

  reindex: (data?: ReindexRequestDto) =>
    api.post<void>(SERVICE, '/admin/search/reindex', data),

  removeUserFromIndex: (userId: string) =>
    api.delete<void>(SERVICE, `/admin/search/users/${userId}/index`),

  removePostFromIndex: (postId: string) =>
    api.delete<void>(SERVICE, `/admin/search/posts/${postId}/index`),
};

export default searchService;
