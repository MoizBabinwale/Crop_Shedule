import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getScheduleBillByScheduleId, createScheduleBill, getProductList, getScheduleById } from "../api/api"; // adjust your import path
import { toast } from "react-toastify";

const ScheduleBill = () => {
  const { scheduleId } = useParams();
  const [billItems, setBillItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});
  // Summary input values
  // Basic fields
  const [totalPlants, setTotalPlants] = useState(0);
  const [totalAcres, setTotalAcres] = useState(0);
  const [totalGuntha, setTotalGuntha] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [perPlantCost, setPerPlantCost] = useState(0);

  // Cost Groups
  const [leafProductCost, setLeafProductCost] = useState({
    totalRs: 0,
    perHectare: 0,
    perAcre: 0,
    perBigha: 0,
    perGuntha: 0,
  });

  const [bioControlCost, setBioControlCost] = useState({
    totalRs: 0,
    perHectare: 0,
    perAcre: 0,
    perBigha: 0,
    perGuntha: 0,
  });

  const [fieldInputPrepCost, setFieldInputPrepCost] = useState({
    totalRs: 0,
    perHectare: 0,
    perAcre: 0,
    perBigha: 0,
    perGuntha: 0,
  });

  const [smokeCost, setSmokeCost] = useState({
    totalRs: 0,
    perHectare: 0,
    perAcre: 0,
    perBigha: 0,
    perGuntha: 0,
  });

  // You can leave userId empty for now
  const [userId, setUserId] = useState("demo_user");
  const [cropId, setCropId] = useState("");
  const [cropName, setCropName] = useState("");

  useEffect(() => {
    const fetchOrCreateBill = async () => {
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
    };
    fetchOrCreateBill();
  }, [scheduleId]);

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleProductCheck = (id, name) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id]?.enabled, name: prev[id]?.name || name },
    }));
  };

  const handleInputChange = (id, field, value) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value, enabled: true },
    }));
  };

  const InputField = ({ label, name }) => {
    const handleChange = (e) => {
      const value = parseFloat(e.target.value) || 0;

      if (name.includes(".")) {
        const [group, key] = name.split(".");

        // Update group states
        const stateSetterMap = {
          leafProductCost: setLeafProductCost,
          bioControlCost: setBioControlCost,
          fieldInputPrepCost: setFieldInputPrepCost,
          smokeCost: setSmokeCost,
        };

        const currentGroup = {
          leafProductCost,
          bioControlCost,
          fieldInputPrepCost,
          smokeCost,
        }[group];

        stateSetterMap[group]({ ...currentGroup, [key]: value });
      } else {
        const setterMap = {
          totalPlants: setTotalPlants,
          totalAcres: setTotalAcres,
          totalGuntha: setTotalGuntha,
          totalCost: setTotalCost,
          perPlantCost: setPerPlantCost,
        };
        setterMap[name](value);
      }
    };

    const getValue = () => {
      if (name.includes(".")) {
        const [group, key] = name.split(".");
        return (
          {
            leafProductCost,
            bioControlCost,
            fieldInputPrepCost,
            smokeCost,
          }[group]?.[key] || 0
        );
      }
      return (
        {
          totalPlants,
          totalAcres,
          totalGuntha,
          totalCost,
          perPlantCost,
        }[name] || 0
      );
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
        totalPlants,
        totalAcres,
        totalGuntha,
        totalCost,
        perPlantCost,
        leafProductCost,
        bioControlCost,
        fieldInputPrepCost,
        smokeCost,
      },
      createdBy: userId,
    };
    console.log("payload ", payload);
    // return;
    const res = await createScheduleBill(payload);
    if (res.status === 201 || res.status === 200) {
      toast.success("Schedule bill saved!");
    } else {
      console.error(res.message);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">🧾 Schedule Bill तयार करा</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Entry Section */}
        <div className="lg:w-7/12 w-full">
          <h3 className="text-xl font-semibold text-green-700 mb-3">🌿 उत्पाद विवरण - Product Details</h3>
          <div className="bg-white rounded-xl border border-green-300 shadow-md p-4 space-y-4">
            <input
              type="text"
              placeholder="🔍 उत्पादन शोधा..."
              className="w-full border border-green-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="overflow-auto">
              <table className="table-auto w-full text-sm border border-green-600">
                <thead className="bg-green-100 text-green-900 font-semibold">
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
                    const selected = selectedProducts[product._id] || {};
                    return (
                      <tr key={product._id} className="hover:bg-green-50">
                        <td className="border p-1 text-center">
                          <input type="checkbox" checked={!!selected.enabled} onChange={() => handleProductCheck(product._id, product.name)} />
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
                              onChange={(e) => handleInputChange(product._id, field, e.target.value)}
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
        <div className="lg:w-5/12 w-full bg-green-50 border border-green-300 rounded-xl p-4 shadow-md space-y-5">
          <h3 className="text-xl text-green-800 font-bold">💰 खर्च तपशील</h3>

          {/* Total Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      {/* Save Button */}
      <div className="mt-6 text-center">
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow" onClick={handleSaveScheduleBill}>
          💾 Save Schedule Bill
        </button>
      </div>
    </div>
  );
};

export default ScheduleBill;
