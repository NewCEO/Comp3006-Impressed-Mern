import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PurchasedItemsPage } from '../pages/purchased-items/index';
import { ShopContext } from '../context/shop-context'; 


jest.mock('../context/shop-context', () => ({
  ShopContext: {
    Consumer: ({ children }) => children({ 
      purchasedItems: [
        { _id: '1', productName: 'Product 1', imageURL: 'image1.jpg', price: 10 },
        { _id: '2', productName: 'Product 2', imageURL: 'image2.jpg', price: 20 },
      ],
      addToCart: jest.fn(),
      getCartItemCount: jest.fn(),
    }),
  },
}));

describe('PurchasedItemsPage', () => {
  it('renders without errors', () => {
    render(<PurchasedItemsPage />);

    expect(screen.getByText('Previously Purchased Items Page')).toBeInTheDocument();
  });

  it('displays purchased items and handles "Purchase Again" button click', () => {
    // Mock necessary functions
    const mockAddToCart = jest.fn();
    const mockGetCartItemCount = jest.fn();

    render(
      <ShopContext.Provider value={{ 
        purchasedItems: [
          { _id: '1', productName: 'Product 1', imageURL: 'image1.jpg', price: 10, description: 'product description1', stockQuantity: 50 },
          { _id: '2', productName: 'Product 2', imageURL: 'image2.jpg', price: 20, description: 'product description2', stockQuantity: 52},
        ],
        addToCart: mockAddToCart,
        getCartItemCount: mockGetCartItemCount,
      }}>
        <PurchasedItemsPage />
      </ShopContext.Provider>
    );

    expect(screen.getAllByRole('button')).toHaveLength(2);

    
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(mockAddToCart).toHaveBeenCalledWith('1');
  });
});
