"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Product } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const { items, addItem } = useCart();

  useEffect(() => {
    apiFetch("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Loading products...</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minimart</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/cart" className="underline">
            Cart ({items.length})
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span>Hi, {user.name}</span>
              <button onClick={logout} className="underline">
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login" className="underline">
              Log in
            </Link>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <p className="text-xs text-gray-500">{product.category.name}</p>
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">${product.price}</span>
                <span className="text-xs text-gray-500">
                  {product.stock} in stock
                </span>
              </div>
              <button
                onClick={() => addItem(product)}
                disabled={product.stock === 0}
                className="w-full bg-black text-white rounded py-1.5 text-sm disabled:opacity-40"
              >
                {product.stock === 0 ? "Out of stock" : "Add to cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
