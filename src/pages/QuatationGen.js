import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuotationBill, getQuotationById } from "../api/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import QuotationFooter from "../components/QuotationFooter";

import logo from "../assets/logo.jpg";

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
    <div className="p-4 sm:p-6 md:p-8 print:p-4 print:text-xl">
      {/* Button Actions */}
      <div className="flex flex-col sm:flex-row justify-end mb-4 print:hidden gap-3 sm:gap-10">
        <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm">
          प्रिंट वेळापत्रक
        </button>
        <button onClick={() => handleGenerateBill(quotation)} className="bg-yellow-400 text-black px-3 py-2 rounded hover:bg-yellow-500 text-sm">
          📄 कोटेशन प्रिंट
        </button>
      </div>

      {/* Main Print Area */}
      <div className="print-area bg-white p-4 sm:p-6 rounded shadow-md text-sm border border-gray-300 print:p-0 print:border-0 print:shadow-none print:rounded-none">
        <div className="hidden print:block print-header">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-6">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <img src={logo} alt="Parnanetra Logo" className="h-20 w-auto object-contain print:h-16" />
            </div>

            {/* Right: Company Name + Farmer Info */}
            <div className="flex flex-col w-full">
              {/* Company Name */}
              <div className="text-center sm:text-left mb-2">
                <span className="text-sm font-bold leading-tight">
                  <span className="text-green-700">Parnanetra</span> Ayurvedic Agro System
                </span>
              </div>

              {/* Farmer Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <span>
                  <span className="font-medium">शेतकरी नाव (Name):</span> श्री {quotation.farmerInfo?.name}
                </span>
                <span>
                  <span className="font-medium"></span>
                </span>
                <span>
                  <span className="font-medium">गाव (Place):</span> {quotation.farmerInfo?.place}
                </span>
                <span>
                  <span className="font-medium">तालुका (Tahsil):</span> {quotation.farmerInfo?.tahsil}
                </span>
                <span>
                  <span className="font-medium">जिल्हा (District):</span> {quotation.farmerInfo?.district}
                </span>
                <span>
                  <span className="font-medium">राज्य (State):</span> {quotation.farmerInfo?.state}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start mb-3 print:hidden">
          <h3 className="text-green-700 font-semibold text-base mb-3">👨‍🌾 शेतकरी माहिती (Farmer Details)</h3>
          <p className="font-bold text-right">दिनांक: {new Date().toLocaleDateString("en-GB")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 print:hidden">
          <p>
            <span className="font-medium">शेतकरी नाव (Name):</span> श्री {quotation.farmerInfo?.name}
          </p>
          <p>
            <span className="font-medium"></span>
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

        {/* Header */}

        {/* Farmer Info */}
        {/* Screen Farmer Info (normal box) */}
        <div className=" my-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm text-sm leading-relaxed text-gray-800 block">
          <div className="text-center font-bold text-base sm:text-lg border-b leading-snug ">
            {quotation.cropName} का {quotation.acres} एकड़ का प्लॉट और पर्णनेत्र आयुर्वेदीक कृषि प्रणाली का शेड्यूल
          </div>
        </div>

        {quotation.weeks.map((week, index) => (
          <div key={index} className="print:table-header-group my-3 py-5 overflow-x-auto print:overflow-visible print:w-full mt-6 break-avoid">
            <table className="table-auto min-w-max border border-separate text-xs print:text-[10px] w-full" style={{ borderSpacing: "0 6px" }}>
              <thead className="bg-green-100 text-gray-900 ">
                <tr>
                  <th className="border px-2 py-2 whitespace-normal w-[50px]">सप्ताह</th>
                  <th className="border px-2 py-2 whitespace-normal">तारीख/उपयोग दिन</th>
                  <th className="border px-2 py-2  max-w-[250px]">उत्पाद</th>
                  <th className="border px-2 py-2 print:hidden  whitespace-normal">प्रति लीटर पानी मे मिली</th>
                  <th className="border px-2 py-2 whitespace-normal">पानी प्रती एकड़</th>
                  {/* <th className="border px-2 py-1 whitespace-normal">कुल एकड़</th> */}
                  <th className="border px-2 py-1 whitespace-normal">पानी कुल एकड़</th>
                  <th className="border px-2 py-1  max-w-[250px]">उत्पाद व मात्रा</th>
                  <th className="border px-2 py-1  max-w-[420px] w-[365px]">निर्देश</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="border px-2 py-1 text-center">{week.weekNumber}</td>
                  <td className="border px-2 py-1 text-center whitespace-normal">
                    <span className="underline">
                      {week.date
                        ? new Date(week.date).toLocaleDateString("hi-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : ""}
                    </span>
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
                  <td className="border px-2 py-1 print:hidden  break-words">
                    {(week.products || []).map((prod, i) =>
                      prod.perLitreMix ? (
                        <div key={i} className="text-green-800">
                          {prod.name}: <span className="text-blue-700 font-medium">{prod.perLitreMix * quotation.acres}</span>
                        </div>
                      ) : null
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center">{week.waterPerAcre} ml</td>
                  {/* <td className="border px-2 py-1 text-center">{week.totalAcres}</td> */}
                  <td className="border px-2 py-1 text-center">{week.totalWater} लीटर </td>
                  <td className="border px-2 py-1 break-words">
                    <ul className="list-disc pl-4 space-y-1  max-w-[250px]">
                      {(week.products || []).map((prod, i) => (
                        <li key={i}>
                          <span className="font-medium">{prod.name}</span>: {prod.quantity.split("&")[0]}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1 break-words max-w-[250px] break-inside-avoid-page">
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
                                  {normalProducts.join(" और ")} को{" "}
                                  {week.waterPerAcre * week.totalAcres < 0.5
                                    ? `${(week.waterPerAcre * week.totalAcres * 1000).toFixed(0)} ml`
                                    : `${(week.waterPerAcre * week.totalAcres).toFixed(2)} लीटर`}
                                </span>{" "}
                                {week.instructions}
                                {smokeProducts.length > 0 && (
                                  <>
                                    {" "}
                                    और <span className="font-bold text-green-900">{smokeProducts.join(" और ")}</span>
                                  </>
                                )}
                                {week.totalWater && (
                                  <>
                                    <br /> <span className="font-bold text-green-900">— एकूण {week.totalWater} लीटर पाणी लागेल</span>
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
        {/* print:fixed print:bottom-0 print:left-0 print:right-0 */}
        <div className="hidden print:block fixed bottom-0 left-0 right-0 text-center text-xs border-t border-gray-300 bg-white py-1">
          📍 235 Gov. Press Colony DABHA, Nagpur, 440023 &nbsp; | &nbsp; ✉️ info@parnanetra.org - parnanetra.org &nbsp; | &nbsp; 📞 +012 345 67890
        </div>

        {/* Shown only at the very end (last page) */}
        {/* <div className="end-of-schedule text-center border-t border-gray-300 print:block"> */}
        <p className="print:block hidden text-sm text-gray-600 text-center h-0 mt-1">--- End of Schedule ---</p>
        {/* <p className="text-xs text-gray-500 mt-1">
              Thank you for choosing <span className="font-semibold text-green-700">Parnanetra Ayurvedic Agro System</span>
            </p> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default QuatationGen;
