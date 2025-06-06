import { Request } from 'express';
import { GetItemsParams } from "../models/get-items-params.model";
import { BadRequestError } from '../errors/app-error';
import { allowedSortFields, SortField } from '../models/sort-fields';
import { allowedSortOrders, SortOrder } from '../models/sort-order.model';


export function parseGetItemsQuery({ query }: Request): GetItemsParams {
  const { page, pageSize, search, sortField, sortOrder } = query;
  const params: GetItemsParams = {} as GetItemsParams;

  if (page !== undefined) {
    const parsedPage = parseInt(page as string, 10);
    if (isNaN(parsedPage) || parsedPage <= 0) {
      throw new BadRequestError('Page must be a positive integer.');
    }

    params.page = parsedPage;
  } else {
    params.page = 1;
  }

  if (pageSize !== undefined) {
    const parsedPageSize = parseInt(pageSize as string, 10);
    if (isNaN(parsedPageSize) || parsedPageSize <= 0) {
      throw new BadRequestError('Page size must be a positive integer.');
    }
    params.pageSize = parsedPageSize;
  } else {
    params.pageSize = 10; 
  }

  if (search !== undefined) {
    if (typeof search !== 'string') {
      throw new BadRequestError('Search must be a string.');
    }
    params.search = search;
  } else {
    params.search = '';
  }

  if (sortField !== undefined) {
    const sortFieldStr = sortField as SortField;
    if (!allowedSortFields.includes(sortFieldStr as SortField)) {
      throw new BadRequestError(`Sort field must be one of: ${allowedSortFields.join(', ')}.`);
    }
    params.sortField = sortFieldStr as SortField;
  } else {
    params.sortField = 'id';
  }

  if (sortOrder !== undefined) {
    const sortStr = (sortOrder as SortOrder).toLowerCase() as SortOrder;
    if (!allowedSortOrders.includes(sortStr)) {
      throw new BadRequestError('Sort must be either "asc" or "desc".');
    }
    params.sortOrder = sortStr as 'asc' | 'desc';
  } else {
    params.sortOrder = 'asc';
  }

  return params;
}