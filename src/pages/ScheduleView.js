import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCropById, getSchedulesByCropId } from "../api/api";

const ScheduleView = () => {
  const { cropId } = useParams();
  const [cropName, setCropName] = useState("");
  const [weeks, setWeeks] = useState([]);
  const [scheduleNotFoud, setScheduleNotFoud] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cropRes = await getCropById(cropId);
        setCropName(cropRes.name);

        const scheduleRes = await getSchedulesByCropId(cropId);
        console.log("scheduleRes ", scheduleRes);
        if (scheduleRes.status === 404) {
          setScheduleNotFoud(true);
        }

        setWeeks(scheduleRes.weeks || []);
      } catch (error) {
        console.error("Error fetching crop or schedule:", error);
      }
    };

    if (cropId) fetchData();
  }, [cropId]);
  if (scheduleNotFoud)
    return (
      <>
        {scheduleNotFoud && (
          <div className="flex justify-center items-center h-64">
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-6 rounded shadow-md text-center w-full max-w-md">
              <p className="text-lg font-semibold">⚠️ No Schedule Data Found!</p>
              <p className="text-sm mt-1">Please check if the schedule has been created for this crop.</p>
            </div>
          </div>
        )}
      </>
    );

  return (
    <div className="p-4 sm:p-6 bg-green-50 min-h-screen">
      {/* Print Button */}
      <div className="flex justify-end mb-4 print:hidden">
        <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-4 sm:px-6 py-2 rounded-md shadow-md text-sm sm:text-base font-medium">
          🖨️ Print Schedule
        </button>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 underline decoration-orange-500 underline-offset-4">फसल का नाम: {cropName}</h1>
      </div>

      {/* Schedule Table for each Week */}
      <div className="space-y-10 print-area">
        {weeks.map((week, index) => (
          <div key={index} className="overflow-x-auto rounded border border-green-300 shadow-md bg-white">
            <table className="min-w-[1000px] w-full text-xs sm:text-sm text-green-800">
              <thead className="bg-green-200 text-green-900 text-center">
                <tr>
                  <th className="border p-2 w-[60px]">सप्ताह</th>
                  <th className="border p-2 w-[100px]">तारीख</th>
                  <th className="border p-2 w-[120px]">प्रति लीटर पानी में मिली</th>
                  <th className="border p-2 w-[120px]">पानी / एकड़ (लीटर में)</th>
                  <th className="border p-2 w-[100px]">कुल एकड़</th>
                  <th className="border p-2 w-[110px]">पानी कुल लीटर</th>
                  <th className="border p-2 w-[140px]">उत्पादों की मात्रा (मिली/ग्राम)</th>
                  <th className="border p-2 w-[140px]">उत्पादों की मात्रा (लीटर/किग्रा)</th>
                  <th className="border p-2 w-[100px]">उपयोग दिन</th>
                  <th className="border p-2 w-[240px]">उत्पाद</th>
                  <th className="border p-2 w-[300px]">निर्देश</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t text-center">
                  <td className="border p-2 font-semibold">{week.weekNumber}</td>
                  <td className="border p-2">{new Date(week.date).toLocaleDateString("en-GB")}</td>
                  <td className="border p-2">{week.perLiter}</td>
                  <td className="border p-2">{week.waterPerAcre}</td>
                  <td className="border p-2">{week.totalAcres}</td>
                  <td className="border p-2">{week.totalWater}</td>
                  <td className="border p-2">{week.productAmountMg}</td>
                  <td className="border p-2">{week.productAmountLtr}</td>
                  <td className="border p-2">{week.useStartDay ? `${week.useStartDay} वा दिन` : ""}</td>
                  <td className="border p-2 text-left">
                    <ul className="list-disc list-inside space-y-1">
                      {(week.products || []).map((prod, i) => (
                        <li key={i} className="text-xs sm:text-sm">
                          <span className="text-green-900 font-medium">{prod.name}</span>: <span className="text-orange-600">{prod.quantity}</span>
                          {prod.perLitreMix && (
                            <>
                              <br />
                              <span className="text-green-800">प्रति लीटर पानी मे मिली:</span> <span className="text-blue-700 font-medium">{prod?.perLitreMix}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border p-2 text-left text-green-900 text-sm" dangerouslySetInnerHTML={{ __html: week.instructions }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleView;
