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
  // const [selectedProducts, setSelectedProducts] = useState({});
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
          console.log("schedule ", schedule);
          if (schedule && Array.isArray(schedule.weeks)) {
            // Merge all products from all weeks
            const allProducts = schedule.weeks.flatMap((week) => week.products || []);

            // Group products by name and category
            const groupedProducts = allProducts.reduce((acc, product) => {
              const key = product.name + "_" + product.category;

              if (!acc[key]) {
                acc[key] = {
                  ...product,
                  times: 0,
                  totalMl: 0,
                  ltrKg: 0,
                };
              }

              acc[key].times += 1;

              // Extract ml and kg from "5000 ml/g & 5.000 l/kg"
              const matchMl = product.quantity.match(/([\d.]+)\s*ml\/g/i);
              const matchKg = product.quantity.match(/([\d.]+)\s*l\/kg/i);

              if (matchMl) acc[key].totalMl += parseFloat(matchMl[1]);
              if (matchKg) acc[key].ltrKg += parseFloat(matchKg[1]);

              return acc;
            }, {});

            // Convert to array for table rendering
            const tableData = Object.values(groupedProducts);

            setProductList(tableData);
          }
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

      setProducts(products);
      setLoading(false);
    };
    fetchOrCreateBill();
  }, [scheduleId]);

  // const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // const handleProductCheck = (name, pricePerAcre) => {
  //   setSelectedProducts((prev) => ({
  //     ...prev,
  //     [name]: { ...prev[name], enabled: !prev[name]?.enabled, name, totalAmt: pricePerAcre },
  //   }));
  // };

  // const handleInputChange = (name, field, value) => {
  //   setSelectedProducts((prev) => ({
  //     ...prev,
  //     [name]: { ...prev[name], [field]: value, enabled: true },
  //   }));
  // };

  const handleSaveScheduleBill = async () => {
    const payload = {
      scheduleId,
      cropId,
      cropName,
      billDate: new Date(),
      items: Object.entries(productList).map(([_, p]) => ({
        name: p.name,
        times: Number(p.times),
        totalMl: Number(p.totalMl),
        ltrKg: Number(p.ltrKg),
        rate: Number(p.rate),
        totalAmt: Number(p.pricePerAcre * p.times),
      })),
      additionalInfo: {
        ...costDetails, // all cost fields from the unified object
      },
      createdBy: userId,
    };

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

  // useEffect(() => {
  //   if (billData && Array.isArray(billData.items)) {
  //     const formatted = {};
  //     billData.items.forEach((item) => {
  //       formatted[item.name] = {
  //         name: item.name || "",
  //         enabled: true,
  //         times: item.times || "",
  //         totalMl: item.totalMl || "",
  //         ltrKg: item.ltrKg || "",
  //         rate: item.rate || "",
  //         totalAmt: item.totalAmt || "",
  //       };
  //     });
  //     setSelectedProducts(formatted);
  //   }
  // }, [billData]);
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
                    {/* <th className="border p-2">निवडा</th> */}
                    <th className="border p-2">साहित्य</th>
                    <th className="border p-2">वेळा</th>
                    <th className="border p-2">कुल Ml</th>
                    <th className="border p-2">Ltr/Kg</th>
                    <th className="border p-2">Rate</th>
                    <th className="border p-2">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product) => {
                    return (
                      <tr key={product.name} className="hover:bg-green-50">
                        <td className="border p-1 ">{product.name}</td>
                        <td className="border p-1 text-center">{product.times}</td>
                        <td className="border p-1 text-center">{product.totalMl}</td>
                        <td className="border p-1 text-center">{product.ltrKg}</td>
                        <td className="border p-1 text-center">{product.rate}</td>
                        {/* {["rate"].map((field) => (
                          <td className="border p-1 text-center" key={field}>
                            <input
                              type="number"
                              placeholder={field}
                              className="w-20 px-1 py-1 border border-green-300 rounded text-xs"
                              disabled={!selected.enabled}
                              value={selected[field] || ""}
                              onChange={(e) => handleInputChange(product.name, field, e.target.value)}
                            />
                          </td>
                        ))} */}

                        <td className="border p-1 text-center">₹{product.pricePerAcre * product.times}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cost Summary Section */}
        <div className="w-full bg-green-50 border border-green-300 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl text-green-800 font-bold mb-4">💰 खर्च तपशील</h3>

            {/* Total Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {[
                { label: "Total Plants", key: "totalPlants" },
                { label: "Total Acres", key: "totalAcres" },
                { label: "Total Guntha", key: "totalGuntha" },
                { label: "Total Cost", key: "totalCost" },
                { label: "Per Plant Cost", key: "perPlantCost" },
              ].map(({ label, key }) => (
                <div key={key} className="flex flex-row items-center text-sm gap-2">
                  <label className="w-32">{label}</label>
                  <input
                    type="number"
                    name={key}
                    className="border px-2 py-1 rounded flex-1"
                    value={costDetails[key] || 0}
                    onChange={(e) => setCostDetails({ ...costDetails, [key]: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              ))}
            </div>

            {/* Cost Groups */}
            {[
              { title: "🌿 पर्णनेत्र उत्पादन खर्च", prefix: "leafProductCost" },
              { title: "🧫 जैव नियंत्रण उत्पादन खर्च", prefix: "bioControlCost" },
              { title: "🧪 शेत इनपुट तयार करण्याचा खर्च", prefix: "fieldInputPrepCost" },
              { title: "🌫️ धुराचे साहित्य खर्च", prefix: "smokeCost" },
            ].map((group) => (
              <div key={group.prefix} className="space-y-2 mb-4">
                <h3 className="font-semibold text-green-700">{group.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["totalRs", "perHectare", "perAcre", "perBigha", "perGuntha"].map((key) => (
                    <div key={key} className="flex flex-row items-center text-sm gap-2">
                      <label className="w-32">{key.replace(/([A-Z])/g, " $1")}</label>
                      <input
                        type="number"
                        name={`${group.prefix}.${key}`}
                        className="border px-2 py-1 rounded flex-1"
                        value={costDetails[group.prefix]?.[key]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setCostDetails((prev) => ({
                            ...prev,
                            [group.prefix]: {
                              ...prev[group.prefix],
                              [key]: value,
                            },
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
