import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function StoreInventory() {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]); // Needed for dropdown
    const [restock, setRestock] = useState({ storeCode: 'NYC-MEGA-777', productSku: '', quantity: 10 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [invRes, prodRes] = await Promise.all([
                api.getInventory(),
                api.getProducts()
            ]);
            setInventory(invRes.data);
            setProducts(prodRes.data);
        } catch (err) {
            console.error("Error loading inventory data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStock = async (e) => {
        e.preventDefault();
        try {
            await api.addStock({
                storeCode: restock.storeCode,
                productSku: restock.productSku,
                quantity: parseInt(restock.quantity)
            });
            loadData(); // Refresh table
            alert("✅ Stock updated!");
        } catch (err) {
            alert("❌ Error updating stock. Check Store Code.");
        }
    };

    return (
        <div className="row animate__animated animate__fadeIn">
            {/* Left: Restock Form */}
            <div className="col-md-4 mb-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-success text-white">Add Stock</div>
                    <div className="card-body">
                        <form onSubmit={handleAddStock}>
                            <div className="mb-2">
                                <label>Store Code</label>
                                <input className="form-control" 
                                    value={restock.storeCode} 
                                    onChange={e => setRestock({...restock, storeCode: e.target.value})} required />
                            </div>
                            <div className="mb-2">
                                <label>Product</label>
                                <select className="form-select" 
                                    value={restock.productSku} 
                                    onChange={e => setRestock({...restock, productSku: e.target.value})} required>
                                    <option value="">-- Select Product --</option>
                                    {products.map(p => (
                                        <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label>Quantity to Add</label>
                                <input type="number" className="form-control" 
                                    value={restock.quantity} 
                                    onChange={e => setRestock({...restock, quantity: e.target.value})} required />
                            </div>
                            <button className="btn btn-success w-100">Update Stock</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right: Inventory Table */}
            <div className="col-md-8">
                <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span>Current Inventory Levels</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={loadData}>🔄 Refresh</button>
                    </div>
                    <table className="table table-striped mb-0">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Store ID</th>
                                <th>Quantity On Hand</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" className="text-center p-3">Loading...</td></tr>
                            ) : inventory.length === 0 ? (
                                <tr><td colSpan="3" className="text-center p-3">Inventory is empty. Add stock!</td></tr>
                            ) : (
                                inventory.map((item, idx) => (
                                    <tr key={idx} className="align-middle">
                                        <td className="fw-bold">{item.productName || item.productSku}</td>
                                        <td><span className="badge bg-secondary">Store #{item.storeId}</span></td>
                                        <td>
                                            <span className={`badge ${item.quantity > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                                                {item.quantity} units
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}