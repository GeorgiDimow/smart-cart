import React, { useState } from 'react';
import ProductCatalog from './ProductCatalog';
import StoreInventory from './StoreInventory';
import ScannerPage from './ScannerPage';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('catalog');

    return (
        <div className="container mt-4">
            <h1 className="mb-4">🛠️ Store Administrator</h1>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'catalog' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('catalog')}>
                        📦 Product Catalog
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('inventory')}>
                        🏭 Store Inventory
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'testing' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('testing')}>
                        🧪 AI Test Lab
                    </button>
                </li>
            </ul>
            
            <div className="tab-content">
                {activeTab === 'catalog' && <ProductCatalog />}
                
                {activeTab === 'inventory' && <StoreInventory />}
                
                {activeTab === 'testing' && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-warning text-dark">
                            <strong>⚠️ QA Zone:</strong> Verify AI recognition logic before pushing to mobile.
                        </div>
                        <div className="card-body">
                            <ScannerPage />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}