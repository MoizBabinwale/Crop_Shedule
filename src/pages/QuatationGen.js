import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuotationBill, getQuotationById } from "../api/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const QuatationGen = () => {
  const { quatationId } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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

  if (loading)
    return (
      <p className="p-6 text-lg">
        ⏳<Loading />
      </p>
    );
  if (!quotation) return <p className="p-6 text-red-600">❌ Quotation नहीं मिला</p>;

  const handleGenerateBill = async (quotation) => {
    try {
      const res = await createQuotationBill(quotation._id, quotation.acres);
      navigate(`/quotationBill/view/${res.bill._id}`);
    } catch (error) {
      toast.error("बिल तयार करण्यात अडचण आली");
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 print:p-4 print:text-xs">
      {/* Button Actions */}
      <div className="flex flex-col sm:flex-row justify-end mb-4 print:hidden gap-3 sm:gap-10">
        <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm">
          Print Quotation
        </button>
        <button onClick={() => handleGenerateBill(quotation)} className="bg-yellow-400 text-black px-3 py-2 rounded hover:bg-yellow-500 text-sm">
          📄 Generate Bill
        </button>
      </div>

      {/* Main Print Area */}
      <div className="print-area bg-white p-4 sm:p-6 rounded shadow-md text-sm border border-gray-300">
        {/* Header */}
        <div className="text-center font-bold text-base sm:text-lg mb-4 border-b pb-2 leading-snug">
          {quotation.cropName} का {quotation.acres} एकड़ का प्लॉट और पर्णनेत्र आयुर्वेदीक कृषि प्रणाली का साप्ताहिक शेड्यूल
        </div>

        {/* Farmer Info */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm text-sm leading-relaxed text-gray-800">
          <h3 className="text-green-700 font-semibold text-base mb-3">👨‍🌾 शेतकरी माहिती (Farmer Details)</h3>
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

        {/* Weekly Schedule Tables */}
        {quotation.weeks.map((week, index) => (
          <div key={index} className="overflow-x-auto mt-6">
            <table className="min-w-[800px] w-full border border-gray-400 text-xs print:text-[10px]">
              <thead className="bg-green-100 text-gray-900">
                <tr>
                  <th className="border px-2 py-1 whitespace-nowrap">सप्ताह</th>
                  <th className="border px-2 py-1 whitespace-nowrap">तारीख</th>
                  <th className="border px-2 py-1 whitespace-nowrap">प्रति लीटर पानी में मिली</th>
                  <th className="border px-2 py-1 whitespace-nowrap">पानी {quotation.acres} एकड़ के लीये</th>
                  <th className="border px-2 py-1 whitespace-nowrap">कुल एकड़</th>
                  <th className="border px-2 py-1 whitespace-nowrap">पानी कुल</th>
                  <th className="border px-2 py-1 whitespace-nowrap">आरंभ दिन से उपयोग</th>
                  <th className="border px-2 py-1 whitespace-nowrap">उत्पाद</th>
                  <th className="border px-2 py-1 whitespace-nowrap">निर्देश</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1 text-center">{week.weekNumber}</td>
                  <td className="border px-2 py-1 text-center">
                    {week.date
                      ? new Date(week.date).toLocaleDateString("en-GB") // en-GB gives dd/mm/yyyy
                      : ""}
                  </td>

                  <td className="border px-2 py-1 text-center">{Number(week.perLiter) * quotation.acres}</td>
                  <td className="border px-2 py-1 text-center">{Number(week.waterPerAcre) * quotation.acres}</td>
                  <td className="border px-2 py-1 text-center">{week.totalAcres}</td>
                  <td className="border px-2 py-1 text-center">{week.totalWater}</td>
                  <td className="border px-2 py-1 text-center">{week.useStartDay ? `${week.useStartDay} वा दिन` : ""}</td>
                  <td className="border px-2 py-1 text-left">
                    <ul className="list-disc pl-4 space-y-1">
                      {(week.products || []).map((prod, i) => (
                        <li key={i}>
                          <div>
                            <span className="font-medium">{prod.name}</span>: {prod.quantity}
                          </div>
                          {prod.perLitreMix && (
                            <div className="text-green-800">
                              कुल पानी मे मिली: <span className="text-blue-700 font-medium">{prod.perLitreMix * quotation.acres}</span>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1 text-left" dangerouslySetInnerHTML={{ __html: week.instructions || "" }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuatationGen;
