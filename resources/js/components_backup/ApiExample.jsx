import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './common/Card.jsx';
import Button from './common/Button.jsx';
import Loading from './common/Loading.jsx';
import Alert from './common/Alert.jsx';

/**
 * Example API Integration Component
 * Demonstrates how to use Laravel API with React
 */
function ApiExample() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch items on component mount
    useEffect(() => {
        fetchItems();
    }, []);

    // Fetch all items from API
    const fetchItems = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/v1/items');
            setItems(response.data.data);
        } catch (err) {
            setError('Failed to fetch items: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Create new item
    const createItem = async () => {
        setLoading(true);
        setError(null);

        const newItem = {
            name: 'New Item ' + (items.length + 1),
            description: 'This is a new item created at ' + new Date().toLocaleTimeString()
        };

        try {
            const response = await axios.post('/api/v1/items', newItem);
            setSuccess('Item created successfully!');
            fetchItems(); // Refresh list
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to create item: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete item
    const deleteItem = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.delete(`/api/v1/items/${id}`);
            setSuccess('Item deleted successfully!');
            fetchItems(); // Refresh list
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete item: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    API Integration Example
                </h1>
                <p className="text-gray-600 mb-8">
                    Contoh integrasi React dengan Laravel API
                </p>

                {error && (
                    <Alert 
                        type="error" 
                        message={error} 
                        onClose={() => setError(null)} 
                    />
                )}

                {success && (
                    <Alert 
                        type="success" 
                        message={success} 
                        onClose={() => setSuccess(null)} 
                    />
                )}

                <Card title="Items List" subtitle="Data dari Laravel API">
                    <div className="mb-4 flex gap-2">
                        <Button 
                            variant="primary" 
                            onClick={createItem}
                            disabled={loading}
                        >
                            ➕ Create New Item
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={fetchItems}
                            disabled={loading}
                        >
                            🔄 Refresh
                        </Button>
                    </div>

                    {loading ? (
                        <Loading text="Loading items..." />
                    ) : items.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No items found</p>
                            <p className="text-sm mt-2">Click "Create New Item" to add one</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div 
                                    key={item.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="danger"
                                        onClick={() => deleteItem(item.id)}
                                        disabled={loading}
                                        className="ml-4"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <div className="mt-6">
                    <Card title="API Endpoints" subtitle="Available endpoints">
                        <div className="space-y-2 text-sm font-mono">
                            <div className="flex">
                                <span className="font-semibold text-green-600 w-16">GET</span>
                                <span className="text-gray-700">/api/v1/items</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold text-green-600 w-16">GET</span>
                                <span className="text-gray-700">/api/v1/items/:id</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold text-blue-600 w-16">POST</span>
                                <span className="text-gray-700">/api/v1/items</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold text-yellow-600 w-16">PUT</span>
                                <span className="text-gray-700">/api/v1/items/:id</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold text-red-600 w-16">DELETE</span>
                                <span className="text-gray-700">/api/v1/items/:id</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold text-green-600 w-16">GET</span>
                                <span className="text-gray-700">/api/v1/search?q=query</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="mt-6 text-center">
                    <Button 
                        variant="outline" 
                        onClick={() => window.location.href = '/react'}
                    >
                        ← Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ApiExample;
