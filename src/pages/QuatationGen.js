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
    <div className="p-8">
      <div className="flex justify-end mb-4">
        <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
          Print Quotation
        </button>
      </div>

      <div className="print-area">
        <h1 className="text-2xl font-bold mb-4">फसल का नाम: {quotation.cropName}</h1>
        <h2 className="text-lg mb-2">कुल एकड़: {quotation.acres}</h2>

        {quotation.weeks.map((week, index) => (
          <table key={index} className="w-full border border-gray-300 mt-6 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">सप्ताह</th>
                <th className="border p-2">तारीख</th>
                <th className="border p-2">प्रति लीटर पानी में मिली</th>
                <th className="border p-2">पानी / एकड़ (लीटर में)</th>
                <th className="border p-2">कुल एकड़</th>
                <th className="border p-2">पानी कुल लीटर</th>
                <th className="border p-2">उत्पादों की मात्रा (मिली/ग्राम)</th>
                <th className="border p-2">उत्पादों की मात्रा (लीटर/किग्रा)</th>
                <th className="border p-2">आरंभ दिन से उपयोग</th>
                <th className="border p-2">निर्देश</th>
                <th className="border p-2">उत्पाद</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="border p-2 text-center">{week.weekNumber}</td>
                <td className="border p-2 text-center">{week.date?.slice(0, 10)}</td>
                <td className="border p-2 text-center">{week.perLiter}</td>
                <td className="border p-2 text-center">{week.waterPerAcre}</td>
                <td className="border p-2 text-center">{week.totalAcres}</td>
                <td className="border p-2 text-center">{week.totalWater}</td>
                <td className="border p-2 text-center">{week.productAmountMg}</td>
                <td className="border p-2 text-center">{week.productAmountLtr}</td>
                <td className="border p-2 text-center">{week.useStartDay}</td>
                <td className="border p-2 text-center">{week.instructions}</td>
                <td className="border p-2">
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
