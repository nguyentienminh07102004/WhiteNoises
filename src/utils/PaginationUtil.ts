export const paginationUtil = (page: number, limit: number) => {
    if (page < 1) page = 1;
    if (limit <= 0) limit = 10;
    return {
        limit,
        skip: (page - 1) * limit
    }
}