"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

export default function CartPage() {
  const { items, removeItem, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  async function handleCheckout() {
    if (!user) {
      router.push("/login");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });
      clear();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="max-w-lg mx-auto p-8 text-center">
        <h1 className="text-xl font-bold mb-2">Order placed!</h1>
        <p className="text-gray-600 mb-4">Thanks for your purchase.</p>
        <button onClick={() => router.push("/")} className="underline">
          Back to shop
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">Your cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Cart is empty.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × ${item.product.price}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-sm text-red-600 underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
          >
            {loading
              ? "Placing order..."
              : user
                ? "Checkout"
                : "Log in to checkout"}
          </button>
        </>
      )}
    </main>
  );
}
