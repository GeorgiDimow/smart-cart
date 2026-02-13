import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', sku: '', price: '', imageUrl: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await api.getProducts();
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            await api.createProduct({ ...newProduct, price: parseFloat(newProduct.price) });
            setNewProduct({ name: '', sku: '', price: '', imageUrl: '' }); // Reset
            loadProducts();
            alert("✅ Product defined in Catalog!");
        } catch (err) {
            alert("❌ Error: SKU likely already exists.");
        }
    };

    const handleDeleteProduct = async (sku) => {
        if (window.confirm(`Delete ${sku} from Global Catalog?`)) {
            await api.deleteProduct(sku);
            loadProducts();
        }
    };

    return (
        <div className="row animate__animated animate__fadeIn">
            {/* Left: Create Form */}
            <div className="col-md-4 mb-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">Define New Product</div>
                    <div className="card-body">
                        <form onSubmit={handleCreateProduct}>
                            <div className="mb-2">
                                <label>Name</label>
                                <input className="form-control" placeholder="e.g. Red Apple" 
                                    value={newProduct.name} 
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                            </div>
                            <div className="mb-2">
                                <label>SKU (Unique ID)</label>
                                <input className="form-control" placeholder="e.g. APP-001" 
                                    value={newProduct.sku} 
                                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})} required />
                            </div>
                            <div className="mb-2">
                                <label>Price ($)</label>
                                <input type="number" step="0.01" className="form-control" 
                                    value={newProduct.price} 
                                    onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label>Image URL</label>
                                <input className="form-control" placeholder="http://..." 
                                    value={newProduct.imageUrl} 
                                    onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} required />
                            </div>
                            <button className="btn btn-primary w-100">Create Definition</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right: Table */}
            <div className="col-md-8">
                <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span>Global Product Definitions</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={loadProducts}>🔄 Refresh</button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Img</th>
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center p-3">Loading...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center p-3">No products found.</td></tr>
                                ) : (
                                    products.map(p => (
                                        <tr key={p.sku} className="align-middle">
                                            <td><img src={p.imageUrl} alt={p.name} height="40" style={{borderRadius: '4px'}} /></td>
                                            <td>{p.name}</td>
                                            <td><code>{p.sku}</code></td>
                                            <td>${p.price.toFixed(2)}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(p.sku)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}