import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckoutPage } from '../pages/checkout/index';
import { ShopContext } from '../context/shop-context';

jest.mock('../context/shop-context', () => ({
  ShopContext: {
    Consumer: ({ children }) => children({ 
      getCartItemCount: jest.fn(),
      getTotalCartAmount: jest.fn(),
      checkout: jest.fn(),
    }),
  },
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('CheckoutPage', () => {
  it('renders without errors', () => {
    render(<CheckoutPage />);
  });

  it('handles checkout and navigates to confirmation page', async () => {
    const mockCheckout = jest.fn();
    const mockGetTotalCartAmount = jest.fn();
    const mockNavigate = jest.fn();

    render(
      <ShopContext.Provider value={{ 
        getCartItemCount: jest.fn(),
        getTotalCartAmount: mockGetTotalCartAmount,
        checkout: mockCheckout,
      }}>
        <CheckoutPage />
      </ShopContext.Provider>
    );

    mockGetTotalCartAmount.mockReturnValue(100);
    
    // Mock the useNavigate hook to return mockNavigate
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    // Fire the checkout event
    fireEvent.click(screen.getByText('Checkout'));

    expect(mockCheckout).toHaveBeenCalledWith(expect.any(String));
    expect(mockNavigate).toHaveBeenCalledWith('/confirmation');
  });
});
