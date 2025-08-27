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

  // Utility to replace numbers in the instructions HTML
  function updateInstructionValues(html, week) {
    return html.replace(/\b\d+(\.\d+)?\b/g, (match) => {
      if (match === String(week.waterPerAcre)) {
        // convert to string for safe comparison
        const num = parseFloat(match);
        if (!isNaN(num)) {
          return (num * quotation.acres).toFixed(0); // or toFixed(1/2) if decimals needed
        }
      }

      // ✅ return original if no match
      return match;
    });
  }

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
          <div key={index} className="overflow-x-auto print:overflow-visible print:w-full mt-6">
            <table className="table-auto min-w-max border border-gray-400 text-xs print:text-[10px] w-full">
              <thead className="bg-green-100 text-gray-900">
                <tr>
                  <th className="border px-2 py-1 whitespace-normal">सप्ताह</th>
                  <th className="border px-2 py-1 whitespace-normal">तारीख/उपयोग दिन</th>
                  <th className="border px-2 py-1  max-w-[250px]">उत्पाद</th>
                  <th className="border px-2 py-1 whitespace-normal">प्रति लीटर पानी मे मिली</th>
                  <th className="border px-2 py-1 whitespace-normal">पानी प्रती एकड़</th>
                  <th className="border px-2 py-1 whitespace-normal">कुल एकड़</th>
                  <th className="border px-2 py-1 whitespace-normal">पानी कुल एकड़</th>
                  <th className="border px-2 py-1  max-w-[250px]">उत्पाद व मात्रा</th>
                  <th className="border px-2 py-1  max-w-[250px]">निर्देश</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="border px-2 py-1 text-center">{week.weekNumber}</td>
                  <td className="border px-2 py-1 text-center whitespace-normal">
                    <span className="underline">{week.date ? new Date(week.date).toLocaleDateString("en-GB") : ""}</span>
                    <br />
                    {week.useStartDay ? `${week.useStartDay}` : ""}
                  </td>
                  <td className="border px-2 py-1 break-words">
                    <ul className="list-disc pl-4 space-y-1  max-w-[250px]">
                      {(week.products || []).map((prod, i) => (
                        <li key={i}>
                          <span className="font-medium">{prod.name}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1  break-words">
                    {(week.products || []).map((prod, i) =>
                      prod.perLitreMix ? (
                        <div key={i} className="text-green-800">
                          {prod.name}: <span className="text-blue-700 font-medium">{prod.perLitreMix * quotation.acres}</span>
                        </div>
                      ) : null
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center">{week.waterPerAcre}</td>
                  <td className="border px-2 py-1 text-center">{week.totalAcres}</td>
                  <td className="border px-2 py-1 text-center">{week.totalWater}</td>
                  <td className="border px-2 py-1 break-words">
                    <ul className="list-disc pl-4 space-y-1  max-w-[250px]">
                      {(week.products || []).map((prod, i) => (
                        <li key={i}>
                          <span className="font-medium">{prod.name}</span>: {prod.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1 break-words max-w-[250px]">
                    <div>
                      {Object.entries(week.products).length > 0 && week.instructions && (
                        <p className="text-sm text-green-900 leading-relaxed">
                          {(() => {
                            // Helper to parse qty string like "300 ml/grm & 0.300 ltr/kg"
                            const parseQtyString = (qtyStr) => {
                              let ml = null;
                              let l = null;

                              // Match ml
                              const mlMatch = qtyStr.match(/([\d.]+)\s*ml/);
                              if (mlMatch) ml = parseFloat(mlMatch[1]);

                              // Match liter
                              const lMatch = qtyStr.match(/([\d.]+)\s*(?:ltr|लीटर)/);
                              if (lMatch) l = parseFloat(lMatch[1]);

                              return { ml, l };
                            };

                            // Normal products
                            const normalProducts = Object.entries(week.products)
                              .filter(([id, data]) => data?.category !== "खेत पर पत्तों से धुवा")
                              .map(([id, data]) => {
                                // const productName = products.find((p) => p._id === id)?.name || "Unknown";

                                const { ml, l } = parseQtyString(data.quantity);

                                let qtyText = "";
                                if (l && l >= 1) {
                                  qtyText = `${l} लीटर`;
                                } else if (ml && ml > 0) {
                                  qtyText = `${ml} ml`;
                                }

                                return `${data.name} ${qtyText}`;
                              });

                            // धुवा products
                            const smokeProducts = Object.entries(week.products)
                              .filter(([id, data]) => data?.category === "खेत पर पत्तों से धुवा")
                              .map(([id, data]) => {
                                // const productName = products.find((p) => p._id === id)?.name || "Unknown";

                                const { l } = parseQtyString(data.quantity || "");

                                let qtyText = "";
                                if (l && l > 0) {
                                  qtyText = `${l} किलो`;
                                }

                                return `${data.name} ${qtyText} धुवा करना.`;
                              });

                            return (
                              <>
                                <span className="font-bold text-green-900">
                                  {normalProducts.join(" और ")} को {week.waterPerAcre * week.totalAcres} लीटर
                                </span>{" "}
                                {week.instructions}
                                {smokeProducts.length > 0 && (
                                  <>
                                    {" "}
                                    और <span className="font-bold text-green-900">{smokeProducts.join(" और ")}</span>
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </p>
                      )}
                    </div>
                  </td>
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
