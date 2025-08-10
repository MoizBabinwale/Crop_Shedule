import React, { useEffect, useState } from "react";
import { getQuotationBillById } from "../api/api";
import { useParams } from "react-router-dom";

const QuotationBill = () => {
  const { quotationId } = useParams();
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchBill = async () => {
      const data = await getQuotationBillById(quotationId);

      setBillData(data);
    };

    if (quotationId) fetchBill();
  }, [quotationId]);

  // SummaryField Component
  const SummaryField = ({ label, value }) => (
    <div className="bg-green-100 p-2 rounded shadow text-sm">
      <p className="text-green-700 font-medium">{label}</p>
      <p className="text-green-900 font-semibold">{value}</p>
    </div>
  );

  // GroupedCost Component
  const GroupedCost = ({ title, data = {} }) => (
    <div className="mt-4">
      <h3 className="text-green-600 font-semibold">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1 text-sm">
        <SummaryField label="प्रति हेक्टर (100 गुंठा)" value={`₹ ${data.perHectare || 0}`} />
        <SummaryField label="प्रति एकर (40 गुंठा)" value={`₹ ${data.perAcre || 0}`} />
        <SummaryField label="प्रति बीघा (24 गुंठा)" value={`₹ ${data.perBigha || 0}`} />
        <SummaryField label="प्रति गुंठा (1089 Sft)" value={`₹ ${data.perGuntha || 0}`} />
        <SummaryField label="एकूण ₹" value={`₹ ${data.totalRs || 0}`} />
      </div>
    </div>
  );

  if (!billData) return <div>Loading...</div>;

  const { cropName, billDate, farmerInfo, items = [], additionalInfo = {} } = billData;

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white border border-green-300 rounded shadow text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-green-700">💼 कोटेशन बिल - Quotation Bill</h1>
        <button onClick={() => window.print()} className="bg-green-600 text-white px-4 py-2 rounded shadow print:hidden">
          🖨️ Print
        </button>
      </div>

      <div className="border-t border-b border-green-500 py-3 text-sm">
        {/* Top row with date on the right */}
        <div className="flex justify-between items-start mb-3">
          <div></div> {/* empty left space */}
          <p className="font-bold text-right">दिनांक: {new Date(billDate).toLocaleDateString("en-GB")}</p>
        </div>

        {/* Farmer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <p>
            <span className="font-medium">शेतकरी नाव (Name):</span> श्री {farmerInfo?.name}
          </p>
          <p>
            <span className="font-medium">गाव (Place):</span> {farmerInfo?.place}
          </p>
          <p>
            <span className="font-medium">तालुका (Tahsil):</span> {farmerInfo?.tahsil}
          </p>
          <p>
            <span className="font-medium">जिल्हा (District):</span> {farmerInfo?.district}
          </p>
          <p>
            <span className="font-medium">राज्य (State):</span> {farmerInfo?.state}
          </p>
          <p>
            <strong>एकूण क्षेत्रफळ:</strong> {billData.acres} एकर ({additionalInfo?.totalPlants} रोपे)
          </p>
        </div>
      </div>

      {/* Product Table */}
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
                <td className="border px-2 py-1">{item.rate ? `₹ ${item.rate}` : ""}</td>
                <td className="border px-2 py-1">
                  {item.totalAmt
                    ? `₹ ${parseFloat(item.totalAmt).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : ""}
                </td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="bg-green-50 font-bold">
              <td className="border px-2 py-1 text-right" colSpan={5}>
                एकूण रक्कम (Total):
              </td>
              <td className="border px-2 py-1">
                ₹{" "}
                {items
                  .reduce((sum, item) => sum + (parseFloat(item.totalAmt) || 0), 0)
                  .toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <h2 className="mt-6 mb-2 text-green-700 font-semibold text-base">💰 खर्चाचा सारांश - Cost Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-green-800">
        <SummaryField label="Total Plants (7 Feet x5 Feet)" value={additionalInfo.totalPlants || 0} />
        <SummaryField label="Total Acres" value={additionalInfo.totalAcres || 0} />
        <SummaryField label="Total Guntha" value={additionalInfo.totalGuntha || 0} />
        <SummaryField label="Total Cost" value={`₹ ${additionalInfo.totalCost || 0}`} />
        <SummaryField label="Per Plant Cost" value={`₹ ${additionalInfo.perPlantCost || 0}`} />
      </div>

      {/* Grouped Cost Sections */}
      <GroupedCost title="🌿 पर्णनेत्र उत्पादों की लागत" data={additionalInfo.leafProductCost} />
      <GroupedCost title="🧪 जैव नियंत्रण उत्पादों की लागत" data={additionalInfo.bioControlCost} />
      <GroupedCost title="🧂 खेत पर इनपुट तैयार करने की लागत" data={additionalInfo.fieldInputPrepCost} />
      <GroupedCost title="🔥 खेत पर पत्तों से धुवा की लागत" data={additionalInfo.smokeCost} />
    </div>
  );
};

export default QuotationBill;
