import { PAGINATION_CONSTANTS } from '../utils/constants.js';
const { FIND, FIND_ONE, FIND_BY_ID } = PAGINATION_CONSTANTS;

export const pagination = async (model, query, options, populateOptions, select, find) => {
    const { limit, page, sort = { _id: -1 } } = query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let pageResults = {}

    try {
        if (endIndex < await model?.find(options).countDocuments().exec()) { pageResults.next = { page: page + 1, limit: limit } }
        if (startIndex > 0) { pageResults.previous = { page: page - 1, limit: limit } }

        let query;
        if (find === FIND) {
            query = model.find(options).select(select);
        } else if (find === FIND_ONE) {
            query = model.findOne(options).select(select);
        } else if (find === FIND_BY_ID) {
            const { id } = options;
            query = model.findById(id).select(select);
        } else {
            query = model.find(options).select(select);
        }

        if (populateOptions) { query = query.populate(populateOptions) }
        pageResults.results = await query.sort(sort).limit(limit).skip(startIndex).exec();
        return { pageResults }

    } catch (error) {
        throw new Error(error.message);
    }
}