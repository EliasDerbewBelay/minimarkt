"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Product } from "@/lib/types";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    apiFetch("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Loaidng Products ....</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;
  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minimart</h1>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span>Hi, {user.name}</span>
            <button onClick={logout} className="underline">
              Log out
            </button>
          </div>
        ) : (
          <Link href="/login" className="underline text-sm">
            Log in
          </Link>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-6">Minimart</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No product yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <p className="text-xs text-gray-500">{product.category.name}</p>
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold">${product.price}</span>
                <span className="text-xs text-gray-500">
                  {product.stock} in stock
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
