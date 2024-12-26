// LandingPage.js

import { useState } from "react";

const Section1 = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted with:', formData);
    };

    return (
        <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/close-up-business-hand-with-stylus-pen-working-digital-tablet-laptop_169016-48967.jpg?ga=GA1.1.106872350.1717615705&semt=ais_hybrid')" }}>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div> {/* Overlay for contrast */}

            <div className="flex justify-center items-center h-full px-6">
                <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-7xl gap-5">
                    {/* Left side: Introduction */}
                    <div className="text-white text-center lg:text-left lg:w-1/2">
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-black">
                            Welcome to the Expense Tracker
                        </h1>
                        <p className="text-lg mb-6">
                            Track and manage your expenses effortlessly. Sign up today to get started with a smarter way to track your spending!
                        </p>
                    </div>

                    {/* Right side: Register Form */}
                    <div className="lg:w-1/2 bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Register</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-600">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-600">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section1;
