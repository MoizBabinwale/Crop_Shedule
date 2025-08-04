import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { getQuotationBillById } from "../api/api";

const QuotationBill = ({ bill }) => {
  const { billId } = useParams();

  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const data = await getQuotationBillById(billId);
        if (data) {
          setBillData(data);
        }
      } catch (error) {
        console.error("Failed to fetch bill");
      }
    };

    fetchBill();
  }, [billId]);

  if (!billId) return <div>Bill not available</div>;

  return (
    <div className="bg-green-50 p-4 sm:p-8 text-gray-800 font-[sans-serif]">
      <div className="max-w-7xl mx-auto border-2 border-green-600 rounded-lg shadow-lg p-6 bg-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-4">
          {billData.cropName} चे {billData.totalAcres} एकर शेतीसाठी कोटेशन बिल
        </h1>

        <div className="border-t border-b border-green-500 py-3 text-sm sm:text-base">
          <p>
            <strong>शेतकरी नाव:</strong> श्री {billData.farmerInfo.name}
          </p>
          <p>
            <strong>पत्ता:</strong> {billData.farmerInfo.place}, {billData.farmerInfo.tahsil}, {billData.farmerInfo.district}, {billData.farmerInfo.state}
          </p>
          <p>
            <strong>एकूण क्षेत्रफळ:</strong> {billData.totalAcres} एकर ({billData.totalPlants} रोपे)
          </p>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full border-collapse border border-green-600 text-sm sm:text-base">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="border border-green-500 px-2 py-1">#</th>
                <th className="border border-green-500 px-2 py-1">Product</th>
                <th className="border border-green-500 px-2 py-1">Times</th>
                <th className="border border-green-500 px-2 py-1">ML</th>
                <th className="border border-green-500 px-2 py-1">LTR/KG</th>
                <th className="border border-green-500 px-2 py-1">Rate (Rs/ml)</th>
                <th className="border border-green-500 px-2 py-1">Total Amt (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {billData.productList.map((product, index) => (
                <tr key={index} className="hover:bg-green-50">
                  <td className="border border-green-400 px-2 py-1 text-center">{index + 1}</td>
                  <td className="border border-green-400 px-2 py-1">{product.name}</td>
                  <td className="border border-green-400 px-2 py-1 text-center">{product.times}</td>
                  <td className="border border-green-400 px-2 py-1 text-center">{product.totalMl}</td>
                  <td className="border border-green-400 px-2 py-1 text-center">{product.ltrsPerKg}</td>
                  <td className="border border-green-400 px-2 py-1 text-center">{product.rate}</td>
                  <td className="border border-green-400 px-2 py-1 text-right">{product.totalAmount}</td>
                </tr>
              ))}
              <tr className="bg-green-100 font-semibold text-green-900">
                <td colSpan="6" className="text-right px-2 py-1 border border-green-600">
                  Total Cost
                </td>
                <td className="text-right px-2 py-1 border border-green-600">{billData.totalCost} ₹</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-sm sm:text-base mt-4">
          <p className="mt-2">
            <strong>Per Plant Cost:</strong> ₹{billData.perPlantCost}
          </p>
          <p className="mt-1">
            <strong>Per Kg Production Cost:</strong> ₹{billData.perKgCost}
          </p>
        </div>

        <div className="mt-6 text-center text-green-700 text-sm sm:text-base font-medium">
          <p>PAAS - Parnanetra Ayurvedic Agro System</p>
          <p>तांत्रिक सहाय्य: शीतांशु जोशी</p>
          <p>मोबाईल: 9960186016</p>
        </div>
      </div>
    </div>
  );
};

export default QuotationBill;
