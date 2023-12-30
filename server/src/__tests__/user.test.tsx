const request = require('supertest');
const express = require('express');
const router = require('../routes/user'); 
const UserModel = require('../models/user'); 
const { UserErrors } = require('../common/error');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const app = express();


app.use(express.json());
app.use('/user', router);


jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/user')

describe('POST /register', () => {
  it('should register a new user', async () => {
    const mockUserData = {
      username: 'testuser',
      password: 'testpassword',
    };

    
    UserModel.findOne = jest.fn().mockReturnValue(null);

    const response = await request(app)
      .post('/user/register')
      .send(mockUserData)
      .expect(200);

    expect(response.body.message).toBe('User Registered Successfully');
  });

  it('should return an error if the username already exists', async () => {
    const mockUserData = {
      username: 'existinguser',
      password: 'testpassword',
    };

    
    UserModel.findOne = jest.fn().mockReturnValue({ username: 'existinguser' });

    const response = await request(app)
      .post('/user/register')
      .send(mockUserData)
      .expect(400);

    expect(response.body.type).toBe(UserErrors.Username_Already_Exists);
  });

  it('should return an error if the password is missing', async () => {
    const mockUserData = {
      username: 'testuser',
    };

    const response = await request(app)
      .post('/user/register')
      .send(mockUserData)
      .expect(400);

    expect(response.body.type).toBe(UserErrors.Wrong_Credentials);
  });
});


describe('POST /login', () => {
  it('should log in a user and return a token', async () => {
    const mockUserData = {
      username: 'testuser',
      password: 'testpassword',
    };

  
    UserModel.findOne = jest.fn().mockReturnValue({
      _id: 'mockUserId',
      username: 'testuser',
      password: 'hashedPassword', 
    });

    
    bcrypt.compare.mockResolvedValue(true);

    
    jwt.sign.mockReturnValue('mockedToken');

    const response = await request(app)
      .post('/user/login')
      .send(mockUserData)
      .expect(200);

    expect(response.body.token).toBe('mockedToken');
    expect(response.body.userID).toBe('mockUserId');
  });

  it('should return an error if no user is found with the provided username', async () => {
    const mockUserData = {
      username: 'nonexistentuser',
      password: 'testpassword',
    };

    UserModel.findOne = jest.fn().mockReturnValue(null);

    const response = await request(app)
      .post('/user/login')
      .send(mockUserData)
      .expect(400);

    expect(response.body.error).toBe('No user found with the provided username');
  });

  it('should return an error for wrong username/password combination', async () => {
    const mockUserData = {
      username: 'testuser',
      password: 'wrongpassword',
    };


    UserModel.findOne = jest.fn().mockReturnValue({
      _id: 'mockUserId',
      username: 'testuser',
      password: 'hashedPassword', 
    });

   
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/user/login')
      .send(mockUserData)
      .expect(400);

    expect(response.body.error).toBe('Wrong username/password combination');
  });

});


describe('GET /available-money/:userID', () => {
  it('should return the available money for a valid user', async () => {
    UserModel.findById.mockResolvedValue({
      _id: 'mockUserId',
      availableMoney: 1000,
    });

    const response = await request(app)
      .get('/user/available-money/mockUserId')
      .expect(200);

    expect(response.body.availableMoney).toBe(100);
  });

  it('should return an error for an invalid user ID', async () => {
  
    UserModel.findById.mockResolvedValue(null);

    const response = await request(app)
      .get('/user/available-money/nonexistentUserId')
      .expect(400);

    expect(response.body.type).toBe('No_User_Found');
  });

  it('should return an error for internal server error', async () => {
    UserModel.findById.mockRejectedValue(new Error('Some internal error'));

    const response = await request(app)
      .get('/user/available-money/someUserId')
      .expect(500);

    expect(response.body.type).toBe('Some internal error');
  });
});


