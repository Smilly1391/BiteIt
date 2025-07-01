import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import menuItems from "../data/menuItems";


const Menu = () => {
  const [filter, setFilter] = useState("All");
  const [addingId, setAddingId] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("loggedInUser");
    setUserEmail(email);
    updateCartCount(email);
  }, [addingId]);

  const updateCartCount = (email) => {
    if (email) {
      const userCart = JSON.parse(localStorage.getItem(`cart_${email}`)) || [];
      setCartCount(userCart.length);
    }
  };

  const filteredItems =
    filter === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === filter);

  const handleAddToCart = (item) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    const email = localStorage.getItem("loggedInUser");
    const cartKey = `cart_${email}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    // Check if item already in cart
    const foundIndex = existingCart.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    if (foundIndex !== -1) {
      existingCart[foundIndex].quantity += 1;
    } else {
      existingCart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    setAddingId(item.id);
    setTimeout(() => setAddingId(null), 500);
    updateCartCount(email);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-10 transition-colors duration-300">
      {/* Cart Icon: only visible after login */}
      {isLoggedIn && (
        <div className="flex justify-end max-w-6xl mx-auto mb-6 px-4">
          <Link
            to="/cart"
            className="relative text-2xl hover:text-orange-500 transition"
            aria-label="View Cart"
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Page Title */}
      <h1 className="text-4xl text-center font-bold text-orange-500 mb-6">
        Our Menu
      </h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {["All", "Veg", "Non-Veg"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              filter === type
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:bg-indigo-500 hover:text-white"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-t-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x300?text=Image+Not+Found";
              }}
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold dark:text-white">
                {item.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.description}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-orange-500">
                  ₹{item.price}
                </span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
                    addingId === item.id
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                  disabled={addingId === item.id}
                >
                  {addingId === item.id ? "Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setShowLoginPrompt(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center dark:text-white">
              Login or Signup to Continue
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Please login or create an account to add items to your cart.
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/login");
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/signup");
                }}
                className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded"
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
