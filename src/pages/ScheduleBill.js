import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getScheduleBillByScheduleId, createScheduleBill, getProductList, getScheduleById } from "../api/api"; // adjust your import path
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ScheduleBill = () => {
  const { scheduleId } = useParams();
  const [billItems, setBillItems] = useState([]);
  const [billId, setBillId] = useState("");
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});
  // Summary input values
  // Basic fields
  const [costDetails, setCostDetails] = useState({
    totalPlants: 0,
    totalAcres: 0,
    totalGuntha: 0,
    totalCost: 0,
    perPlantCost: 0,
    leafProductCost: {},
    bioControlCost: {},
    fieldInputPrepCost: {},
    smokeCost: {},
  });
  // You can leave userId empty for now
  const [userId, setUserId] = useState("demo_user");
  const [cropId, setCropId] = useState("");
  const [cropName, setCropName] = useState("");

  useEffect(() => {
    const fetchOrCreateBill = async () => {
      setLoading(true);
      try {
        if (scheduleId) {
          const schedule = await getScheduleById(scheduleId);
          if (schedule) {
            setCropName(schedule.cropId.name);
            setCropId(schedule.cropId._id);
          }
          let bill = await getScheduleBillByScheduleId(scheduleId);

          if (!bill) {
            setBillItems([]);
          } else {
            setBillItems(bill.items || []);
          }
        }
      } catch (err) {
        console.error("Error fetching/creating bill:", err);
      }
      const products = await getProductList();
      setProductList(products);
      setProducts(products);
      setLoading(false);
    };
    fetchOrCreateBill();
  }, [scheduleId]);

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleProductCheck = (name) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [name]: { ...prev[name], enabled: !prev[name]?.enabled, name },
    }));
  };

  const handleInputChange = (name, field, value) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [name]: { ...prev[name], [field]: value, enabled: true },
    }));
  };

  const InputField = ({ label, name }) => {
    const handleChange = (e) => {
      const value = parseFloat(e.target.value) || 0;

      if (name.includes(".")) {
        const [group, key] = name.split(".");

        setCostDetails((prev) => ({
          ...prev,
          [group]: {
            ...prev[group],
            [key]: value,
          },
        }));
      } else {
        setCostDetails((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

    const getValue = () => {
      if (name.includes(".")) {
        const [group, key] = name.split(".");
        return costDetails[group]?.[key] || 0;
      }
      return costDetails[name] || 0;
    };

    return (
      <div className="flex flex-col text-sm">
        <label>{label}</label>
        <input type="number" name={name} className="border px-2 py-1 rounded" value={getValue()} onChange={handleChange} />
      </div>
    );
  };

  const CostGroup = ({ title, prefix }) => (
    <div>
      <h3 className="font-semibold text-green-700">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {["totalRs", "perHectare", "perAcre", "perBigha", "perGuntha"].map((key) => (
          <InputField key={key} label={key.replace(/([A-Z])/g, " $1")} name={`${prefix}.${key}`} />
        ))}
      </div>
    </div>
  );

  const handleSaveScheduleBill = async () => {
    const payload = {
      scheduleId,
      cropId,
      cropName,
      billDate: new Date(),
      items: Object.entries(selectedProducts)
        .filter(([_, p]) => p.enabled)
        .map(([_, p]) => ({
          name: p.name,
          times: Number(p.times),
          totalMl: Number(p.totalMl),
          ltrKg: Number(p.ltrKg),
          rate: Number(p.rate),
          totalAmt: Number(p.totalAmt),
        })),
      additionalInfo: {
        ...costDetails, // all cost fields from the unified object
      },
      createdBy: userId,
    };

    console.log("payload ", payload);
    const res = await createScheduleBill(payload);

    if (res.status === 201 || res.status === 200) {
      toast.success("Schedule bill saved!");
    } else {
      console.error(res.message);
    }
  };

  const [billData, setBillData] = useState(null);

  useEffect(() => {
    if (scheduleId) {
      const fetchBill = async () => {
        try {
          const res = await getScheduleBillByScheduleId(scheduleId);
          if (res) {
            console.log("res ", res);
            setBillId(res?.scheduleId);
            setBillData(res);
          }
        } catch (err) {
          console.error("Error fetching bill:", err);
        }
      };
      fetchBill();
    }
  }, [scheduleId]);

  useEffect(() => {
    if (billData && billData.additionalInfo) {
      const info = billData.additionalInfo;

      setCostDetails({
        totalPlants: info.totalPlants || 0,
        totalAcres: info.totalAcres || 0,
        totalGuntha: info.totalGuntha || 0,
        totalCost: info.totalCost || 0,
        perPlantCost: info.perPlantCost || 0,
        leafProductCost: info.leafProductCost || {},
        bioControlCost: info.bioControlCost || {},
        fieldInputPrepCost: info.fieldInputPrepCost || {},
        smokeCost: info.smokeCost || {},
      });

      setCropId(billData.cropId || "");
      setCropName(billData.cropName || "");
    }
  }, [billData]);

  useEffect(() => {
    if (billData && Array.isArray(billData.items)) {
      const formatted = {};
      billData.items.forEach((item) => {
        formatted[item.name] = {
          name: item.name || "",
          enabled: true,
          times: item.times || "",
          totalMl: item.totalMl || "",
          ltrKg: item.ltrKg || "",
          rate: item.rate || "",
          totalAmt: item.totalAmt || "",
        };
      });
      setSelectedProducts(formatted);
    }
  }, [billData]);
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">🧾 Schedule Bill तयार करा</h2>

      <div className="flex flex-col gap-6">
        {/* Product Entry Section */}
        <div className="w-full flex flex-col">
          <h3 className="text-xl font-semibold text-green-700 mb-3">🌿 उत्पाद विवरण - Product Details</h3>
          <div className="bg-white rounded-xl border border-green-300 shadow-md p-4 flex flex-col h-full">
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 उत्पादन शोधा..."
              className="w-full border border-green-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Table Container with fixed height and scroll */}
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-green-200 rounded">
              <table className="table-auto w-full text-sm text-green-900">
                <thead className="bg-green-100 sticky top-0 z-10">
                  <tr>
                    <th className="border p-2">निवडा</th>
                    <th className="border p-2">साहित्य</th>
                    <th className="border p-2">वेळा</th>
                    <th className="border p-2">कुल Ml</th>
                    <th className="border p-2">Ltr/Kg</th>
                    <th className="border p-2">Rate</th>
                    <th className="border p-2">Total Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const selected = selectedProducts[product.name] || {};
                    return (
                      <tr key={product.name} className="hover:bg-green-50">
                        <td className="border p-1 text-center">
                          <input type="checkbox" checked={!!selected.enabled} onChange={() => handleProductCheck(product.name)} />
                        </td>
                        <td className="border p-1">{product.name}</td>
                        {["times", "totalMl", "ltrKg", "rate", "totalAmt"].map((field) => (
                          <td className="border p-1" key={field}>
                            <input
                              type="number"
                              placeholder={field}
                              className="w-20 px-1 py-1 border border-green-300 rounded text-xs"
                              disabled={!selected.enabled}
                              value={selected[field] || ""}
                              onChange={(e) => handleInputChange(product.name, field, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cost Summary Section */}
        <div className=" w-full bg-green-50 border border-green-300 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl text-green-800 font-bold mb-4">💰 खर्च तपशील</h3>

            {/* Total Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              <InputField label="Total Plants" name="totalPlants" />
              <InputField label="Total Acres" name="totalAcres" />
              <InputField label="Total Guntha" name="totalGuntha" />
              <InputField label="Total Cost" name="totalCost" />
              <InputField label="Per Plant Cost" name="perPlantCost" />
            </div>

            {/* Cost Groups */}
            <div className="space-y-3">
              <CostGroup title="🌿 पर्णनेत्र उत्पादन खर्च" prefix="leafProductCost" />
              <CostGroup title="🧫 जैव नियंत्रण उत्पादन खर्च" prefix="bioControlCost" />
              <CostGroup title="🧪 शेत इनपुट तयार करण्याचा खर्च" prefix="fieldInputPrepCost" />
              <CostGroup title="🌫️ धुराचे साहित्य खर्च" prefix="smokeCost" />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-center gap-14 text-center">
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow" onClick={handleSaveScheduleBill}>
          💾 Save Schedule Bill
        </button>
        {billId && (
          <button onClick={() => navigate(`/schedulebill/view/${billId}`)} className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-full shadow" title="View Schedule Bill">
            🧾 View Bill
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleBill;
