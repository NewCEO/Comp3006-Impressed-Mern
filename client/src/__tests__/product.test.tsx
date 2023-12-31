import React from 'react'
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Product } from '../pages/shop/product';
import "../context/shop-context"


jest.mock('../context/shop-context', () => ({
  ShopContext: {
    Consumer: ({ children }) => children({
      addToCart: jest.fn(),
      getCartItemCount: jest.fn(),
    }),
  },
}));

const mockProduct = {
  _id: '1',
  productName: 'Test Product',
  description: 'Test description',
  price: 15,
  stockQuantity: 10,
  imageURL: 'test-image.jpg',
};

test('renders Product component correctly', () => {
  render(<Product product={mockProduct} />);

  expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('Test description')).toBeInTheDocument();
  expect(screen.getByText('£15')).toBeInTheDocument();
  expect(screen.getByText('Quantity available: 10')).toBeInTheDocument();

  
  userEvent.click(screen.getByText('Add To Cart'));


  expect(jest.fn()).toHaveBeenCalledTimes(1);
});


