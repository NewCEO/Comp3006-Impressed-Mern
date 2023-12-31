import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { AuthPage, Login, Register } from '../pages/auth/index';

jest.mock('axios');

describe('AuthPage', () => {
  test('renders Login and Register components', () => {
    render(<AuthPage/>);
    
    
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });
});

describe('Login', () => {
  test('submits login form successfully', async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        token: 'mockToken',
        userID: 'mockUserID',
        username: 'mockUsername',
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });

    fireEvent.click(screen.getByText(/Login/i));

   
    await waitFor(() => {
    
      expect(screen.getByText(/Hello mockUsername/i)).toBeInTheDocument();
    });
  });

  
});

describe('Register', () => {
  test('submits registration form successfully', async () => {
    (axios.post as jest.Mock).mockResolvedValue({});

    render(<Register />);


    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });

    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(screen.getByText(/Registration Completed! Now login./i)).toBeInTheDocument();
    });
  });

 
});
