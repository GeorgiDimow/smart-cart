import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import api from '../services/api';

function ShopPage() {
  const [sessionId, setSessionId] = useState('');
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState(null);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let storedSession = localStorage.getItem('smart_cart_session');
    if (!storedSession) {
      storedSession = uuidv4();
      localStorage.setItem('smart_cart_session', storedSession);
    }
    setSessionId(storedSession);

    fetchCatalog();
    fetchCart(storedSession);
  }, []);

  const fetchCatalog = async () => {
    try {
      const [prodRes, invRes] = await Promise.all([
        api.getProducts(),
        api.getInventory()
      ]);
      
      setProducts(prodRes.data);
      
      const invMap = {};
      invRes.data.forEach(item => {
        invMap[item.productSku] = item.quantity;
      });
      setInventory(invMap);
      
    } catch (err) {
      console.error("Failed to load catalog", err);
    }
  };

  const fetchCart = async (sessId) => {
    try {
      const res = await api.getCart(sessId || sessionId);
      setCart(res.data);
    } catch (err) {
      console.log("Cart empty or error", err);
      setCart(null);
    }
  };

  const handleAddToCart = async (sku) => {
    try {
      await api.addToCart(sessionId, sku, 1);
      fetchCart(sessionId); 
      setError('');
    } catch (err) {
      setError('Could not add to cart.');
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await api.checkout(sessionId);
      setOrder(res.data); 
      setCart(null);      
      fetchCatalog();     
      setError('');
    } catch (err) {
      
      if (err.response && err.response.data) {
        setError(`Checkout Failed: ${err.response.data.message}`);
      } else {
        setError('Checkout failed. Server error.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">🛒 Smart Cart Store</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {order && (
        <div className="alert alert-success">
          <h4>Order Placed!</h4>
          <p>Order ID: {order.id}</p>
          <p>Total: ${order.totalAmount}</p>
          <button className="btn btn-sm btn-outline-success" onClick={() => setOrder(null)}>Shop Again</button>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <h3>Products</h3>
          <div className="row">
            {products.map(p => {
              const stock = inventory[p.sku] || 0;
              return (
                <div className="col-md-6 mb-3" key={p.id}>
                  <div className="card">
                    {p.imageUrl && <img src={p.imageUrl} className="card-img-top" alt={p.name} style={{height: '200px', objectFit: 'cover'}} />}
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-muted">{p.sku}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5">${p.price}</span>
                        {stock > 0 ? (
                          <button className="btn btn-primary" onClick={() => handleAddToCart(p.sku)}>
                            Add to Cart (Stock: {stock})
                          </button>
                        ) : (
                          <button className="btn btn-secondary" disabled>Out of Stock</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-dark text-white">
              Your Cart
            </div>
            <ul className="list-group list-group-flush">
              {!cart || !cart.items || cart.items.length === 0 ? (
                <li className="list-group-item">Cart is empty</li>
              ) : (
                cart.items.map((item, idx) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={idx}>
                    <div>
                      <strong>{item.productName}</strong>
                      <br/>
                      <small className="text-muted">${item.unitPrice} x {item.quantity}</small>
                    </div>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </li>
                ))
              )}
            </ul>
            {cart && cart.items && cart.items.length > 0 && (
              <div className="card-footer">
                <div className="d-flex justify-content-between mb-2">
                  <strong>Total:</strong>
                  <strong>${cart.grandTotal.toFixed(2)}</strong>
                </div>
                <button className="btn btn-success w-100" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;