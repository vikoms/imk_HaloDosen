import React, { useState } from 'react';
import Card from './common/Card.jsx';
import Button from './common/Button.jsx';
import Input from './common/Input.jsx';
import Alert from './common/Alert.jsx';
import Loading from './common/Loading.jsx';

/**
 * Example Dashboard Component
 * Demonstrates usage of common components
 */
function Dashboard() {
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setAlert({
                type: 'success',
                message: 'Data berhasil disimpan!'
            });
            setLoading(false);
            setFormData({ name: '', email: '' });

            // Auto hide alert after 3 seconds
            setTimeout(() => setAlert(null), 3000);
        }, 1500);
    };

    const goBack = () => {
        window.location.href = '/react';
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    React Dashboard Example
                </h1>

                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Form Card */}
                    <Card title="Form Example" subtitle="Contoh penggunaan form dengan komponen reusable">
                        {loading ? (
                            <Loading text="Menyimpan data..." />
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Nama"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan nama"
                                    required
                                />

                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan email"
                                    required
                                />

                                <div className="flex gap-2">
                                    <Button type="submit" variant="primary">
                                        Submit
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="secondary"
                                        onClick={() => setFormData({ name: '', email: '' })}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Card>

                    {/* Button Variants Card */}
                    <Card title="Button Variants" subtitle="Berbagai varian button yang tersedia">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Primary Button</p>
                                <Button variant="primary">Click Me</Button>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Secondary Button</p>
                                <Button variant="secondary">Click Me</Button>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Success Button</p>
                                <Button variant="success">Click Me</Button>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Danger Button</p>
                                <Button variant="danger">Click Me</Button>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Outline Button</p>
                                <Button variant="outline">Click Me</Button>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Disabled Button</p>
                                <Button variant="primary" disabled>Disabled</Button>
                            </div>
                        </div>
                    </Card>

                    {/* Info Card */}
                    <Card title="Informasi Setup" subtitle="Detail konfigurasi React">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">React Version:</span>
                                <span className="font-medium">{React.version}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Laravel Version:</span>
                                <span className="font-medium">12.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Build Tool:</span>
                                <span className="font-medium">Vite 7.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">CSS Framework:</span>
                                <span className="font-medium">Tailwind CSS 4.0</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={goBack}
                            >
                                ← Back to Home
                            </Button>
                        </div>
                    </Card>

                    {/* Alert Examples Card */}
                    <Card title="Alert Examples" subtitle="Berbagai tipe alert">
                        <div className="space-y-3">
                            <Button 
                                variant="success" 
                                onClick={() => setAlert({ type: 'success', message: 'Ini adalah success alert!' })}
                                className="w-full"
                            >
                                Show Success Alert
                            </Button>

                            <Button 
                                variant="danger" 
                                onClick={() => setAlert({ type: 'error', message: 'Ini adalah error alert!' })}
                                className="w-full"
                            >
                                Show Error Alert
                            </Button>

                            <Button 
                                variant="secondary" 
                                onClick={() => setAlert({ type: 'warning', message: 'Ini adalah warning alert!' })}
                                className="w-full"
                            >
                                Show Warning Alert
                            </Button>

                            <Button 
                                variant="primary" 
                                onClick={() => setAlert({ type: 'info', message: 'Ini adalah info alert!' })}
                                className="w-full"
                            >
                                Show Info Alert
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
