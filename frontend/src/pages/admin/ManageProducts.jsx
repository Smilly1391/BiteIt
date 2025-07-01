import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import menuItems from "../../data/menuItems";

export default function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [showConfirmIndex, setShowConfirmIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products"));
    if (stored && Array.isArray(stored)) {
      setProducts(stored);
    } else {
      setProducts(menuItems);
      localStorage.setItem("products", JSON.stringify(menuItems));
    }
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedProduct({ ...products[index] });
  };

  const handleDelete = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    if (editIndex === index) setEditIndex(null);
    setShowConfirmIndex(null);
    window.dispatchEvent(new Event("productsUpdated"));

  };

  const handleSave = () => {
    const updated = [...products];
    updated[editIndex] = editedProduct;
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    setEditIndex(null);
  };

  const handleCancel = () => setEditIndex(null);

  const handleChange = (field, value) => {
    setEditedProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setProducts(menuItems);
    localStorage.setItem("products", JSON.stringify(menuItems));
  };

  const handleAddProduct = () => {
    const { name, price, category, image } = newProduct;
    if (!name || !price || !category || !image) {
      setShowValidationError(true);
      setTimeout(() => setShowValidationError(false), 3000);
      return;
    }

    const newEntry = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      category,
      image,
      description: "",
    };

    const updated = [...products, newEntry];
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    setNewProduct({ name: "", price: "", category: "", image: "" });
    setShowAddModal(false);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
          Manage Products
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>
          <button
            onClick={handleReset}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Reset All
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead className="bg-orange-100 dark:bg-gray-700 text-left text-sm text-gray-700 dark:text-white uppercase">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>
                <td className="p-4 text-gray-800 dark:text-white">
                  {editIndex === i ? (
                    <input
                      value={editedProduct.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none w-full"
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td className="p-4 text-gray-800 dark:text-white">
                  {editIndex === i ? (
                    <input
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none w-full"
                    />
                  ) : (
                    `₹${p.price}`
                  )}
                </td>
                <td className="p-4 text-gray-800 dark:text-white">
                  {editIndex === i ? (
                    <input
                      value={editedProduct.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none w-full"
                    />
                  ) : (
                    p.category
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  {editIndex === i ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 dark:text-gray-300 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(i)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowConfirmIndex(i)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg text-center w-80">
            <p className="mb-4 text-gray-800 dark:text-gray-100 font-medium">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-500">
                {products[showConfirmIndex]?.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(showConfirmIndex)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmIndex(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Add New Product
            </h2>
            <input
              type="text"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded dark:bg-transparent dark:border-gray-600 dark:text-white"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              className="w-full px-3 py-2 border rounded dark:bg-transparent dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="w-full px-3 py-2 border rounded dark:bg-transparent dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
              className="w-full px-3 py-2 border rounded dark:bg-transparent dark:border-gray-600 dark:text-white"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Modal */}
      {showValidationError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 text-center px-6 py-4 rounded shadow-lg">
            <p className="text-red-600 font-medium dark:text-red-400">
              Please fill in all fields before adding the product.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
