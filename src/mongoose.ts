import mongoose from "mongoose"

export type CustomerType = {
    first_name: string
    last_name: string
    age: number
    customer_type: string
    street: string
    city: string
    state: string
    zip_code: string
    phone_number: string
  }

  export type CustomerDocument = mongoose.Document & CustomerType;

  type Keyword = {
    first_name: {
        $regex: string;
        $options: string;
    };
  } | {
    first_name?: undefined;
  }

  const CustomerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    customer_type: String,
    street: String,
    city: String,
    state: String,
    zip_code: String,
    phone_number: String
  },
  {
      timestamps: true
  }
);

export class Customer {
    private model: mongoose.Model<CustomerDocument>;
  
    constructor() {
      this.model = mongoose.model('customer', CustomerSchema)
    }
  
    async create(data: CustomerType) {
        let result: CustomerType
      try {
        result = await this.model.create(data);
        console.log(result);
      } catch (error) {
        throw error;
      }
      return result;
    }

  async createMany(data: CustomerType[]) {
    let result: CustomerType[]
    try {
      result = await this.model.insertMany(data);
      console.log(result);
    } catch (error) {
      throw error;
    }
    return result;
  }

  async getAll(limit: number) {
    let result: CustomerType[];
    try {
      result = await this.model.aggregate([
        {
          "$addFields": {
            "full_name": {"$concat": ["$first_name", " ", "$last_name"]}
          },
        }
      ]).limit(limit).exec();
    } catch (error) {
      throw error;
    }

    return result;
  }

  async getByName(name: Keyword) {
    let result: CustomerType[];
    try {
      result = await this.model.find({ ...name })
    } catch (error) {
      throw error
    }

    return result;
  }

  async getByType(type: string) {
    let result: CustomerType[];
    try {
      result = await this.model.aggregate([{
        $match: {
          customer_type: {
            $eq: type
          }
        }
      }]).exec();
    } catch (error) {
      throw error
    }

    return result;
  }

  //get by state
  async getByState(type: string) {
    let result: CustomerType[];
    try {
      result = await this.model.aggregate([{
        $match: {
          state: {
            $eq: type
          }
        }
      }]).exec();
    } catch (error) {
      throw error
    }
    
    return result;
  }

  //get by age
  async getByAge(type: number) {
    let result: CustomerType[];
    try {
      result = await this.model.aggregate([{
        $match: {
          age: {
            $lt: type
          }
        }
      }]).exec();
    } catch (error) {
      throw error
    }
    
    return result;
  }


  async deleteMany() {
    try {
      await this.model.deleteMany({});
    } catch (error) {
        throw error;
    }
  }

}