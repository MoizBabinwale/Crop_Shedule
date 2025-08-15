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
  const [scheduleData, setScheduleData] = useState({});

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
            setScheduleData(schedule);
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
    // if (billData && billData.additionalInfo) {
    //   const info = billData.additionalInfo;
    //   setCostDetails({
    //     totalPlants: info.totalPlants || 0,
    //     totalAcres: info.totalAcres || 0,
    //     totalGuntha: info.totalGuntha || 0,
    //     totalCost: info.totalCost || 0,
    //     perPlantCost: info.perPlantCost || 0,
    //     leafProductCost: info.leafProductCost || {},
    //     bioControlCost: info.bioControlCost || {},
    //     fieldInputPrepCost: info.fieldInputPrepCost || {},
    //     smokeCost: info.smokeCost || {},
    //   });
    //   setCropId(billData.cropId || "");
    //   setCropName(billData.cropName || "");
    // }
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

  // Calculate all values whenever schedule or productList changes
  useEffect(() => {
    if (!scheduleData || !productList) return;

    const totalAcres = 1; // always 1
    const totalPlantswithHector = scheduleData.totalPlants * totalAcres;
    const totalPlants = scheduleData.totalPlants;
    const totalGuntha = totalAcres * 40;

    const totalCost = productList.reduce((sum, product) => sum + (product.pricePerAcre * product.times || 0), 0);

    const perPlantCost = totalPlants > 0 ? totalCost / totalPlants : 0;

    const allProducts = (scheduleData.weeks ?? []).flatMap((week) => week.products || []);

    // 2️⃣ Helper to calculate group cost
    const calculateGroupCost = (category) => {
      const groupProducts = allProducts.filter((p) => p.category === category);

      const totalRs = groupProducts.reduce((sum, p) => {
        const times = p.times || 1;
        return sum + (parseFloat(p.pricePerAcre) || 0) * times;
      }, 0);

      const perGuntha = totalRs / totalGuntha;
      const perAcre = perGuntha * 40;
      const perBigha = perGuntha * 24;
      const perHectare = perGuntha * 100;

      return {
        totalRs: Number(totalRs.toFixed(1)),
        perGuntha: Number(perGuntha.toFixed(1)),
        perAcre: Number(perAcre.toFixed(1)),
        perBigha: Number(perBigha.toFixed(1)),
        perHectare: Number(perHectare.toFixed(1)),
      };
    };

    // 3️⃣ Build final cost details in ONE setCostDetails call
    setCostDetails({
      totalPlants,
      totalAcres,
      totalPlantswithHector,
      totalGuntha,
      totalCost,
      perPlantCost,
      leafProductCost: calculateGroupCost("पर्णनेत्र आयुर्वेदिक एग्रो इनपुट्स"),
      bioControlCost: calculateGroupCost("जैव नियंत्रण उत्पाद"),
      fieldInputPrepCost: calculateGroupCost("खेत पर इनपुट"),
      smokeCost: calculateGroupCost("खेत पर पत्तों से धुवा"),
    });
  }, [scheduleData, productList]);

  // SummaryField Component
  const SummaryField = ({ label, value }) => (
    <div className="bg-green-50 p-2 rounded border border-green-200">
      <div className="text-xs text-green-600">
        {label} :- <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  );

  // GroupedCost Component
  const GroupedCost = ({ title, data }) => (
    <div className="mt-4">
      <h3 className="text-green-600 font-semibold">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1 text-sm">
        <SummaryField label="प्रति हेक्टर (100 गुंठा)" value={`₹ ${data?.perHectare || 0}`} />
        <SummaryField label="प्रति एकर (40 गुंठा)" value={`₹ ${data?.perAcre || 0}`} />
        <SummaryField label="प्रति बीघा (24 गुंठा)" value={`₹ ${data?.perBigha || 0}`} />
        <SummaryField label="प्रति गुंठा (1089 Sft)" value={`₹ ${data?.perGuntha || 0}`} />
        <SummaryField label="एकूण ₹" value={`₹ ${data?.totalRs || 0}`} />
      </div>
    </div>
  );

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

            {/* Total Stats & Grouped Costs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              {/* Left Card - Total Stats */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-green-200 flex flex-col ">
                <h2 className="text-lg font-semibold text-green-700 mb-4">📊 कुल सारांश</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-green-800">
                  <SummaryField label="Total Plants (7x5 ft)" value={scheduleData.totalPlants || 0} />
                  <SummaryField label="Total Acres" value={costDetails.totalAcres || 0} />
                  <SummaryField label="Total Plants" value={costDetails.totalPlantswithHector || 0} />
                  <SummaryField label="Total Guntha" value={costDetails.totalGuntha || 0} />
                  <SummaryField label="Total Cost" value={`₹ ${costDetails.totalCost || 0}`} />
                  <SummaryField label="Per Plant Cost" value={`₹ ${costDetails.perPlantCost || 0}`} />
                </div>
              </div>

              {/* Right Card - Grouped Costs */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-green-200 flex flex-col justify-between">
                <h2 className="text-lg font-semibold text-green-700 mb-4">💰 लागत विवरण</h2>
                <div className="grid grid-cols-1 gap-3">
                  <GroupedCost title="🌿 पर्णनेत्र उत्पादों की लागत" data={costDetails.leafProductCost} />
                  <GroupedCost title="🧪 जैव नियंत्रण उत्पादों की लागत" data={costDetails.bioControlCost} />
                  <GroupedCost title="🧂 खेत पर इनपुट तैयार करने की लागत" data={costDetails.fieldInputPrepCost} />
                  <GroupedCost title="🔥 खेत पर पत्तों से धुवा की लागत" data={costDetails.smokeCost} />
                </div>
              </div>
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
