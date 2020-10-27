import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import connectDB from './connect'
import { Customer, CustomerType } from './mongoose';

const app = express();
connectDB();

const customerModel = new Customer();

//middlewaares
app.use(express.json());
app.use((err: Error, req : express.Request, res: express.Response, next: express.NextFunction ) => {
    res.status(500).json({
        success: false,
        message: err.message
    });
});

app.get('/', async(req, res, next)=> {
    res.json({
        message: 'success'
    })
})

//@route POST /customer
app.post('/customers', async (req, res, next) => {
    let customers: CustomerType | CustomerType[];
    try {
      if(req.body instanceof Array) {
        customers = await customerModel.createMany(req.body)
      } else {
        customers = await customerModel.create(req.body)
      }
    } catch (error) {
      return next(error)
    }
    res.json(customers);
});

//@route get /customer?limit=
app.get('/customers', async (req, res, next) => {
    const limit = Number(req.query.limit) || 10;
    let customers: CustomerType[];

    try {
      customers = await customerModel.getAll(limit)
    } catch (error) {
      return next(error)
    }
  
    return res.send(customers)
    
}); 


//@route get customer/search?name=
app.get('/customers/search', async (req, res, next) => {
    let customers: CustomerType[];
    const name = req.query.name ? {
      first_name: {
        $regex: req.query.name as string,
        $options: 'i'
      }
    } : {};
    
    try {
      customers = await customerModel.getByName(name)
    } catch (error) {
      return next(error)
    }
  
    res.json(customers)
  });
  
  //@route GET /customer/type/:type
  app.get('/customers/type/:type', async (req, res, next) => {
    let customers: CustomerType[];
    const type = req.params.type as string;
  
    try {
      customers = await customerModel.getByType(type)
    } catch (error) {
      return next(error)
    }
  
    res.json(customers)
  })

//@route GET /customer/state/:state
  app.get('/customers/state/:state', async (req, res, next) => {
    let customers: CustomerType[];
    const type = req.params.state as string;
  
    try {
      customers = await customerModel.getByState(type)
    } catch (error) {
      return next(error)
    }
  
    res.json(customers)
  })

//@route GET /customer/age/:age
  app.get('/customers/age/:age', async (req, res, next) => {
    let customers: CustomerType[];
    const type = req.params.age as string;
  
    try {
    let age2 = parseInt(type)
      customers = await customerModel.getByAge(age2)
    } catch (error) {
      return next(error)
    }
  
    res.json(customers)
  })



app.listen(3000, () => {
    console.log('App listen to port 3000');
});