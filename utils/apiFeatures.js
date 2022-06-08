class APIFeatures {
  constructor(query, requestBody) {
    this.query = query;
    this.requestBody = requestBody;
  }

  filter() {
    const queryObj = { ...this.requestBody };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((qp) => delete queryObj[qp]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (op) => `$${op}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.requestBody.sort) {
      const sortBy = this.requestBody.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  select() {
    if (this.requestBody.fields) {
      const fields = this.requestBody.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = +this.requestBody.page || 1;
    const limit = +this.requestBody.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
