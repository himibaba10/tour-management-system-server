import { Query } from "mongoose";
import { excludedFields } from "../constants";

class QueryBuilder<T> {
  constructor(
    public modelQuery: Query<T[], T>,
    public query: Record<string, string>
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter() {
    const filter = { ...this.query };
    excludedFields.forEach((field) => delete filter[field]);

    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm || "";

    const searchQuery = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(searchQuery);

    return this;
  }

  sort() {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  fields() {
    const fields = this.query.fields?.replace(",", " ") || "";
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  paginate() {
    const limit = Number(this.query.limit) || 10;
    const page = Number(this.query.page) || 1;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const limit = Number(this.query.limit) || 10;
    const totalDoc = await this.modelQuery.model.countDocuments();
    const totalPage = Math.ceil(totalDoc / limit);
    const page = Number(this.query.page) || 1;

    return {
      total: totalDoc,
      page,
      totalPage,
      limit,
    };
  }
}

export default QueryBuilder;
