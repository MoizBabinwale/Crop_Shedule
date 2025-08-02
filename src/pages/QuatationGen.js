import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuotationById } from "../api/api";

const QuatationGen = () => {
  const { quatationId } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const data = await getQuotationById(quatationId);
        setQuotation(data);
      } catch (error) {
        console.error("Error fetching quotation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (quatationId) fetchQuotation();
  }, [quatationId]);

  if (loading) return <p className="p-6 text-lg">⏳ Quotation तैयार किया जा रहा है...</p>;
  if (!quotation) return <p className="p-6 text-red-600">❌ Quotation नहीं मिला</p>;

  return (
    <div className="p-8 print:p-4 print:text-xs">
      <div className="flex justify-end mb-4 print:hidden">
        <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
          Print Quotation
        </button>
      </div>

      <div className="print-area bg-white p-6 rounded shadow-md text-sm border border-gray-300">
        <div className="text-center font-bold text-lg mb-4 border-b pb-2">
          {quotation.cropName} का {quotation.acres} एकड़ का प्लॉट और पर्णनेत्र आयुर्वेदीक कृषि प्रणाली का साप्ताहिक शेड्यूल
        </div>

        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm text-sm leading-relaxed text-gray-800">
          <h3 className="text-green-700 font-semibold text-base mb-2">👨‍🌾 शेतकरी माहिती (Farmer Details)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <p>
              <span className="font-medium">शेतकरी नाव (Name):</span> श्री {quotation.farmerInfo?.name}
            </p>
            <p>
              <span className="font-medium">गाव (Place):</span> {quotation.farmerInfo?.place}
            </p>
            <p>
              <span className="font-medium">तालुका (Tahsil):</span> {quotation.farmerInfo?.tahsil}
            </p>
            <p>
              <span className="font-medium">जिल्हा (District):</span> {quotation.farmerInfo?.district}
            </p>
            <p>
              <span className="font-medium">राज्य (State):</span> {quotation.farmerInfo?.state}
            </p>
          </div>
        </div>

        {quotation.weeks.map((week, index) => (
          <table key={index} className="w-full border border-gray-400 mt-6 text-xs print:text-[10px]">
            <thead className="bg-green-100 text-gray-900">
              <tr>
                <th className="border px-2 py-1">सप्ताह</th>
                <th className="border px-2 py-1">तारीख</th>
                <th className="border px-2 py-1">प्रति लीटर पानी में मिली</th>
                <th className="border px-2 py-1">पानी / एकड़</th>
                <th className="border px-2 py-1">कुल एकड़</th>
                <th className="border px-2 py-1">पानी कुल</th>
                <th className="border px-2 py-1">मात्रा (मिली/ग्राम)</th>
                <th className="border px-2 py-1">मात्रा (लीटर/किग्रा)</th>
                <th className="border px-2 py-1">आरंभ दिन</th>
                <th className="border px-2 py-1">निर्देश</th>
                <th className="border px-2 py-1">उत्पाद</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1 text-center">{week.weekNumber}</td>
                <td className="border px-2 py-1 text-center">{week.date?.slice(0, 10)}</td>
                <td className="border px-2 py-1 text-center">{week.perLiter}</td>
                <td className="border px-2 py-1 text-center">{week.waterPerAcre}</td>
                <td className="border px-2 py-1 text-center">{week.totalAcres}</td>
                <td className="border px-2 py-1 text-center">{week.totalWater}</td>
                <td className="border px-2 py-1 text-center">{week.productAmountMg}</td>
                <td className="border px-2 py-1 text-center">{week.productAmountLtr}</td>
                <td className="border px-2 py-1 text-center">{week.useStartDay}</td>
                <td className="border px-2 py-1 text-center">{week.instructions}</td>
                <td className="border px-2 py-1">
                  <ul className="list-disc pl-4">
                    {(week.products || []).map((prod, i) => (
                      <li key={i}>
                        {prod.name}: {prod.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

export default QuatationGen;
