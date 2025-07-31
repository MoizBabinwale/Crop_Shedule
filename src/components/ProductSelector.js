const ProductSelector = ({ products, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});

  const handleCheckboxChange = (id) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      if (updated[id]) delete updated[id];
      else updated[id] = { ml: "", l: "" };
      return updated;
    });
  };

  const handleQuantityChange = (id, type, value) => {
    const clean = value.replace(/\D/g, "");
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: clean,
        [type === "ml" ? "l" : "ml"]: clean,
      },
    }));
  };

  useEffect(() => {
    onSelectionChange(selectedProducts);
  }, [selectedProducts]);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search product..." className="border p-2 rounded mb-2 w-full" />

      <div className="max-h-[300px] overflow-y-auto space-y-2">
        {filtered.map((product) => {
          const selected = !!selectedProducts[product._id];
          return (
            <div key={product._id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={selected} onChange={() => handleCheckboxChange(product._id)} />
                <span>{product.name}</span>
              </label>
              {selected && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="ml/g"
                    value={selectedProducts[product._id]?.ml || ""}
                    onChange={(e) => handleQuantityChange(product._id, "ml", e.target.value)}
                    className="w-16 p-1 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="l/kg"
                    value={selectedProducts[product._id]?.l || ""}
                    onChange={(e) => handleQuantityChange(product._id, "l", e.target.value)}
                    className="w-16 p-1 border rounded"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
