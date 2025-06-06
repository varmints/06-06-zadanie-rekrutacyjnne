import { GetItemsParams } from "../models/get-items-params.model";
import { Item } from "../models/item.model";

export function getItems(data: Item[], { search, sortField, page, pageSize, sortOrder }: GetItemsParams) {
  let filteredData = data;
  if (search) {
    filteredData = filteredData.filter(({ name, category }) => 
      name.toLowerCase().includes(search.toLowerCase()) || category.toLowerCase().includes(search.toLowerCase())
    );
  };

  filteredData.sort((a, b) => {
    const aValue = a[sortField as keyof Item];
    const bValue = b[sortField as keyof Item];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const total = filteredData.length;
  const totalPages = Math.ceil(total / pageSize);


  return {
    total: filteredData.length,
    page,
    totalPages,
    pageSize,
    data: paginatedData,
    sortField,
    sortOrder
  };
}