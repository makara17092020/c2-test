import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const limit = 12; // 12 products per page
  const [total, setTotal] = useState(0); // Total products

  const fetchProducts = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * limit;
      const res = await fetch(
        `https://api.escuelajs.co/api/v1/products?limit=${limit}&offset=${offset}`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setTotal(200); // Escuela API has 200 products total by default
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-slate-600">Manage your product catalog</p>
        </div>

        <Link
          to="/products/new"
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add product
        </Link>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="h-24 w-full rounded-xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="flex flex-row sm:flex-col md:flex-col items-start gap-4 rounded-xl border bg-white p-4 hover:shadow-sm transition"
            >
              {/* Image */}
              <img
                src={p.images?.[0] ?? "https://placehold.co/600x400"}
                alt={p.title}
                className="h-24 w-1/5 min-w-20 sm:w-full sm:h-40 md:w-full md:h-48 rounded-lg object-cover shrink-0"
                loading="lazy"
              />

              {/* Text */}
              <div className="flex-1 space-y-1 text-left">
                <div className="flex justify-between items-start">
                  <div className="font-medium line-clamp-1">{p.title}</div>
                  <div className="shrink-0 font-semibold">${p.price}</div>
                </div>
                <div className="text-sm text-slate-600 line-clamp-1">
                  {p.category?.name}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {p.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 rounded border bg-white hover:bg-slate-100 disabled:opacity-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1
                ? "bg-slate-900 text-white"
                : "bg-white hover:bg-slate-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 rounded border bg-white hover:bg-slate-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
