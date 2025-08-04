import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getScheduleBillByScheduleId } from "../api/api"; // adjust path as needed

const ScheduleBillView = () => {
  const { scheduleId } = useParams();
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await getScheduleBillByScheduleId(scheduleId);
        console.log("res ", res);

        setBillData(res);
      } catch (err) {
        console.error("Error fetching bill:", err);
      }
    };
    fetchBill();
  }, [scheduleId]);

  if (!billData) return <div className="p-4 text-green-800">लोड करत आहे...</div>;

  const { cropName, createdBy, billDate, items, additionalInfo = {} } = billData;

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white border border-green-300 rounded shadow text-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-green-700">💼 शेड्यूल बिल - Schedule Bill</h1>
          <p className="text-green-600">पीक: {cropName}</p>
          <p className="text-green-600">बनवले: {createdBy}</p>
          <p className="text-green-600">दिनांक: {new Date(billDate).toLocaleDateString()}</p>
        </div>
        <button onClick={() => window.print()} className="bg-green-600 text-white px-4 py-2 rounded shadow">
          🖨️ Print
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-green-500 text-center">
          <thead className="bg-green-100">
            <tr>
              <th className="border px-2 py-1">साहित्य</th>
              <th className="border px-2 py-1">वेळा</th>
              <th className="border px-2 py-1">कुल Ml</th>
              <th className="border px-2 py-1">Ltr/Kg</th>
              <th className="border px-2 py-1">Rate</th>
              <th className="border px-2 py-1">Total Amt</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.times}</td>
                <td className="border px-2 py-1">{item.totalMl}</td>
                <td className="border px-2 py-1">{item.ltrKg}</td>
                <td className="border px-2 py-1">₹ {item.rate}</td>
                <td className="border px-2 py-1">₹ {item.totalAmt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-6 mb-2 text-green-700 font-semibold text-base">💰 खर्चाचा सारांश - Cost Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-green-800">
        <SummaryField label="Total Plants" value={additionalInfo.totalPlants} />
        <SummaryField label="Total Acres" value={additionalInfo.totalAcres} />
        <SummaryField label="Total Guntha" value={additionalInfo.totalGuntha} />
        <SummaryField label="Total Cost" value={`₹ ${additionalInfo.totalCost}`} />
        <SummaryField label="Per Plant Cost" value={`₹ ${additionalInfo.perPlantCost}`} />
      </div>

      {/* Grouped Costs */}
      <GroupedCost title="🌿 Leaf Product Cost" data={additionalInfo.leafProductCost} />
      <GroupedCost title="🧪 Bio Control Cost" data={additionalInfo.bioControlCost} />
      <GroupedCost title="🧂 Field Input Prep Cost" data={additionalInfo.fieldInputPrepCost} />
      <GroupedCost title="🔥 Smoke Cost" data={additionalInfo.smokeCost} />
    </div>
  );
};

const SummaryField = ({ label, value }) => (
  <div className="bg-green-50 p-2 rounded border border-green-200">
    <div className="text-xs text-green-600">{label}</div>
    <div className="text-sm font-semibold">{value}</div>
  </div>
);

const GroupedCost = ({ title, data = {} }) => (
  <div className="mt-6">
    <h3 className="text-green-600 font-semibold mb-2">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
      <SummaryField label="Total ₹" value={`₹ ${data.totalRs || 0}`} />
      <SummaryField label="₹/Hectare" value={`₹ ${data.perHectare || 0}`} />
      <SummaryField label="₹/Acre" value={`₹ ${data.perAcre || 0}`} />
      <SummaryField label="₹/Bigha" value={`₹ ${data.perBigha || 0}`} />
      <SummaryField label="₹/Guntha" value={`₹ ${data.perGuntha || 0}`} />
    </div>
  </div>
);

export default ScheduleBillView;
