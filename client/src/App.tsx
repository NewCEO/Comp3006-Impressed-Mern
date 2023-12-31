import React from 'react'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { ShopPage } from "./pages/shop";
import { AuthPage } from "./pages/auth";
import { CheckoutPage } from "./pages/checkout";
import { ShopContextProvider } from "./context/shop-context";
import { Navbar } from "./components/navbar";
import { PurchasedItemsPage } from "./pages/purchased-items";
import ConfirmationPage from "./pages/confirmation";
<link rel="stylesheet" href="./assets/style.css"/>

function App() {
  return (
    <div className="App">
      <Router>
        {""}
      <ShopContextProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/purchased-items" element={<PurchasedItemsPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
        </ShopContextProvider>
      </Router>
    </div>
  );
}

export default App;
