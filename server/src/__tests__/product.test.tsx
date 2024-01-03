const request = require('supertest');
const express = require('express');
const {checkout} = require('../routes/product'); 
const ProductModel = require('../models/product'); 
const UserModel = require('../models/user');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const purchasedItemsHandler = require('../routes/product');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set up a test database using an in-memory MongoDB server
beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

app.use(express.json());
app.use('/', router); 
app.use('/product', checkout);

// app.post('/register', registerHandler);
// app.post('/login', loginHandler);

// app.get('/available-money/:userID', availableMoneyHandler);
app.get('/purchased-items/:customerID',purchasedItemsHandler);

jest.mock('../models/product'); 
jest.mock('../models/user')

describe('GET /', () => {
  it('should return a list of products', async () => {
    
    ProductModel.find.mockResolvedValue([
      { _id: '1', productName: 'Product 1', price: 10 },
      { _id: '2', productName: 'Product 2', price: 20 },
    ]);

    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body.products).toHaveLength(2);
    expect(response.body.products[0].productName).toBe('Product 1');
    expect(response.body.products[1].productName).toBe('Product 2');
  });

  it('should handle errors and return a 400 status', async () => {
    
    ProductModel.find.mockRejectedValue(new Error('Some error'));

    const response = await request(app)
      .get('/')
      .expect(400);

    expect(response.body.err).toBe('Some error');
  });

});

describe('POST /product/checkout', () => {
    it('should successfully checkout and emit inventoryUpdated event', async (done) => {
      const userMock = {
        _id: 'user1',
        availableMoney: 100,
        purchasedItems: [],
        save: jest.fn(),
      };
  
      const productMocks = [
        { _id: 'product1', stockQuantity: 5, price: 20 },
        { _id: 'product2', stockQuantity: 3, price: 15 },
      ];
  
      UserModel.findById.mockResolvedValue(userMock);
      ProductModel.find.mockResolvedValue(productMocks);
  
      const socketClient = require('socket.io-client');
      const socket = socketClient(`http://localhost:3000`, {
        reconnectionDelayMax: 10000,
        transports: ['websocket'],
        forceNew: true,
      });
  
      
      socket.on('inventoryUpdated', (updatedProducts) => {
        expect(updatedProducts).toEqual(productMocks);
        socket.disconnect();
        done();
      });
  
      const response = await request(app)
        .post('/product/checkout')
        .send({ customerID: 'user1', cartItems: { product1: 2, product2: 1 } })
        .expect(200);
  
      expect(response.body.purchasedItems).toEqual(expect.any(Array));
    });
  
    
  });
  describe('GET /purchased-items/:customerID', () => {
    test('should get purchased items for a valid customer ID with a valid token', async () => {
        const testUser = new UserModel({
            _id: mongoose.Types.ObjectId(),
            purchasedItems: ['productID1', 'productID2'],
        });
        await testUser.save();

        const testProducts = [
            { _id: 'productID1', name: 'Product 1', price: 10 },
            { _id: 'productID2', name: 'Product 2', price: 20 },
        ];
        await ProductModel.create(testProducts);

        const response = await request(app)
            .get(`/purchased-items/${testUser._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.purchasedItems).toHaveLength(2);
    });

    test('should return an error for an invalid customer ID', async () => {
        const response = await request(app)
            .get('/purchased-items/invalidCustomerID')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.type).toBe('NO_USERS_FOUND');
    });

    test('should return an error for an unauthenticated request', async () => {
        const response = await request(app)
            .get('/purchased-items/validCustomerID');

        expect(response.status).toBe(401);
        expect(response.body.type).toBe('Unauthorized');
    });
});


