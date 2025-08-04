import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCropById, getSchedulesByCropId } from "../api/api";

const CoatationPage = () => {
  const { cropId } = useParams();
  const [cropName, setCropName] = useState("");
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cropRes = await getCropById(cropId);
        setCropName(cropRes.name);

        const scheduleRes = await getSchedulesByCropId(cropId);
        setWeeks(scheduleRes.weeks || []);
      } catch (error) {
        console.error("Error fetching crop or schedule:", error);
      }
    };

    if (cropId) fetchData();
  }, [cropId]);

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Print Button */}
      <div className="flex justify-end mb-4 print:hidden">
        <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md shadow-md font-medium">
          🖨️ Print Schedule
        </button>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-green-800 underline decoration-orange-500 underline-offset-4">फसल का नाम: {cropName}</h1>
      </div>

      {/* Schedule Table for each Week */}
      <div className="space-y-10 print-area">
        {weeks.map((week, index) => (
          <table key={index} className="w-full border border-green-300 text-sm shadow-md bg-white">
            <thead className="bg-green-200 text-green-900 text-center">
              <tr>
                <th className="border p-2">सप्ताह</th>
                <th className="border p-2">तारीख</th>
                <th className="border p-2">प्रति लीटर पानी में मिली</th>
                <th className="border p-2">पानी / एकड़ (लीटर में)</th>
                <th className="border p-2">कुल एकड़</th>
                <th className="border p-2">पानी कुल लीटर</th>
                <th className="border p-2">उत्पादों की मात्रा (मिली/ग्राम)</th>
                <th className="border p-2">उत्पादों की मात्रा (लीटर/किग्रा)</th>
                <th className="border p-2">आरंभ दिन से उपयोग करने का दिन</th>
                <th className="border p-2">उत्पाद</th>
                <th className="border p-2">निर्देश</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t text-center text-green-800">
                <td className="border p-2 font-semibold">{week.weekNumber}</td>
                <td className="border p-2">{week.date?.slice(0, 10)}</td>
                <td className="border p-2">{week.perLiter}</td>
                <td className="border p-2">{week.waterPerAcre}</td>
                <td className="border p-2">{week.totalAcres}</td>
                <td className="border p-2">{week.totalWater}</td>
                <td className="border p-2">{week.productAmountMg}</td>
                <td className="border p-2">{week.productAmountLtr}</td>
                <td className="border p-2">{week.useStartDay} वा दिन</td>
                <td className="border p-2 text-left">
                  <ul className="list-disc list-inside space-y-1">
                    {(week.products || []).map((prod, i) => (
                      <li key={i} className="text-sm">
                        <span className="text-green-900 font-medium">{prod.name}</span>: <span className="text-orange-600">{prod.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2 text-left">{week.instructions}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

export default CoatationPage;
