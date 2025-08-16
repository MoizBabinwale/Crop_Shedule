import React, { useEffect, useState } from "react";
import { getProductList, getSchedulesByCropId, submitData } from "../api/api";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import bgImage from "../assets/farme.jpg";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Form1 = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [weekForms, setWeekForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPlants, setTotalPlants] = useState(0);

  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const weeks = queryParams.get("weeks");
  const cropId = queryParams.get("id");
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [isBillReady, setIsBillReady] = useState(false);
  const [scheduleId, setScheduleId] = useState("");

  // Fetch products once
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProductList();
    if (data) {
      setProducts(data);
      setProductsLoaded(true);
    }
  };

  // Function to handle date & other field changes
  const handleWeekFormChange = (index, field, value) => {
    const updatedWeeks = [...weekForms];

    if (field === "date" && index === 0) {
      const startDate = new Date(value);

      updatedWeeks.forEach((week, i) => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i * 7); // Week gap
        week.date = newDate.toISOString().split("T")[0];

        // Calculate day difference from start
        if (i === 0) {
          week.useStartDay = "आरंभ दिवस";
        } else {
          const diffDays = Math.floor((newDate - startDate) / (1000 * 60 * 60 * 24));
          week.useStartDay = `${diffDays} वा दिन`;
        }
      });
    } else {
      updatedWeeks[index][field] = value;

      // If date of another week changes, update its useStartDay
      if (field === "date" && index !== 0) {
        const startDate = new Date(updatedWeeks[0].date);
        const currentDate = new Date(value);
        const diffDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));

        updatedWeeks[index].useStartDay = diffDays === 0 ? "आरंभ दिवस" : `${diffDays} वा दिन`;
      }
    }

    setWeekForms(updatedWeeks);
  };

  const handleQuantityChange = (weekIndex, productId, field, value, category, totalWater) => {
    const numericValue = parseFloat(value);

    setWeekForms((prev) =>
      prev.map((week, idx) => {
        if (idx !== weekIndex) return week;

        let ml = week.products?.[productId]?.ml || "";
        let l = week.products?.[productId]?.l || "";
        let perLitreMix = week.products?.[productId]?.perLitreMix || "";

        if (field === "ml") {
          ml = value;
          l = value ? (numericValue / 1000).toFixed(3) : "";
          if (category !== "खेत पर पत्तों से धुवा" && totalWater) {
            perLitreMix = value ? (numericValue / totalWater).toFixed(2) : "";
          }
        } else if (field === "l") {
          l = value;
          ml = value ? (numericValue * 1000).toFixed(0) : "";
          if (category !== "खेत पर पत्तों से धुवा" && totalWater) {
            perLitreMix = value ? ((numericValue * 1000) / totalWater).toFixed(2) : "";
          }
        }

        return {
          ...week,
          products: {
            ...week.products,
            [productId]: {
              ...week.products?.[productId],
              ml,
              l,
              perLitreMix,
            },
          },
        };
      })
    );
  };

  const handlePerLitreChange = (weekIndex, productId, value, category, totalWater) => {
    const numericValue = parseFloat(value);

    setWeekForms((prev) =>
      prev.map((week, idx) => {
        if (idx !== weekIndex) return week;

        let ml = week.products?.[productId]?.ml || "";
        let l = week.products?.[productId]?.l || "";

        if (category !== "खेत पर पत्तों से धुवा" && totalWater && !isNaN(numericValue)) {
          ml = (numericValue * totalWater).toFixed(0);
          l = ((numericValue * totalWater) / 1000).toFixed(3);
        }

        return {
          ...week,
          products: {
            ...week.products,
            [productId]: {
              ...week.products?.[productId],
              perLitreMix: value,
              ml,
              l,
            },
          },
        };
      })
    );
  };

  const handleCheckboxChange = (weekIndex, productId) => {
    setWeekForms((prev) =>
      prev.map((week, idx) => {
        if (idx !== weekIndex) return week;
        const updatedProducts = { ...week.products };
        if (updatedProducts[productId]) {
          delete updatedProducts[productId];
        } else {
          updatedProducts[productId] = { ml: "", l: "", perLitreMix: "" };
        }

        return { ...week, products: updatedProducts };
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);

    // Convert weekForms into a single schedule object with weeks array
    const scheduleData = {
      cropId,
      totalPlants: Number(totalPlants),
      weeks: weekForms.map((week) => {
        const selected = Object.entries(week.products).map(([id, data]) => {
          const product = products.find((p) => p._id === id);
          return {
            name: product?.name || "Unknown",
            quantity: `${data.ml || 0} ml/grm & ${data.l || 0} ltr/kg`,
            perLitreMix: data?.perLitreMix || 0,
            instruction: product?.instruction || "",
            category: product?.category,
            rate: product?.rate,
            pricePerAcre: product?.pricePerAcre,
          };
        });

        return {
          weekNumber: week.weekNumber,
          date: week.date,
          perLiter: week.perLiter,
          waterPerAcre: week.waterPerAcre,
          totalAcres: week.totalAcres,
          totalWater: week.totalWater,
          productAmountMg: week.productAmountMg,
          productAmountLtr: week.productAmountLtr,
          useStartDay: week.useStartDay,
          instructions: week.instructions,
          products: selected,
        };
      }),
    };

    // return; // Uncomment this for testing without API call

    try {
      const res = await submitData(cropId, scheduleData); // Send as single object

      if (res) {
        toast.success("Schedules saved successfully.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "light",
        });
      }
      setIsBillReady(true);
      setScheduleId(res._id);
    } catch (err) {
      console.error(err);
      toast.warning("Unable to Save!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    if (cropId && productsLoaded) {
      fetchSchedule();
    }
  }, [cropId, productsLoaded]);
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await getSchedulesByCropId(cropId);

      if (res && res.weeks?.length > 0) {
        const formattedWeeks = res.weeks.map((week) => {
          const productsObject = {};
          if (Array.isArray(week.products)) {
            week.products.forEach((product) => {
              const matched = products.find((p) => p.name === product.name);

              if (matched) {
                const productId = matched._id;
                const [ml = "", l = ""] = product.quantity.split("&").map((q) => q.trim().split(" ")[0]);

                productsObject[productId] = {
                  ml: ml || "",
                  l: l || "",
                  perLitreMix: product.perLitreMix,
                  instruction: product.instruction,
                  category: product?.category,
                  rate: product?.rate,
                };
              }
            });
          }

          return {
            ...week,
            date: week.date ? week.date.slice(0, 10) : "",
            products: productsObject,
          };
        });

        setWeekForms(formattedWeeks);
        setIsBillReady(true);
        setScheduleId(res._id);

        if (res.totalPlants) {
          setTotalPlants(Number(res.totalPlants));
        }
      } else {
        // If no schedule exists, initialize empty weekForms
        setWeekForms(
          Array.from({ length: weeks }, (_, i) => ({
            weekNumber: i + 1,
            date: "",
            perLiter: 0,
            waterPerAcre: 0,
            totalAcres: 0,
            totalWater: 0,
            productAmountMg: 0,
            productAmountLtr: 0,
            useStartDay: "",
            instructions: "",
            products: {},
          }))
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to", `/schedule/${cropId}`);
    navigate(`/schedule/${cropId}`);
  };

  const generateScheduleBill = () => {
    navigate(`/schedulebill/${scheduleId}`);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="bg-green-100 border border-green-300 rounded-xl shadow-md py-6 px-4 mx-2 my-4">
            <div className="text-center">
              <h2 className="text-green-800 font-bold text-lg sm:text-xl md:text-2xl mb-2">{name} का १ एकड का प्लाट और पर्णनेत्र आयुर्वेदीक कृषी प्रणाली का साप्ताहिक शेड्यूल</h2>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-inner max-w-xl mx-auto mt-4 text-gray-800">
              <p className="mb-2">
                <span className="font-semibold text-green-700">🌾 पिकाचे नाव:</span> {name}
              </p>
              <p className="mb-2">
                <span className="font-semibold text-green-700">📅 एकूण आठवडे:</span> {weeks}
              </p>
              <p className="mb-2">
                <span className="font-semibold text-green-700">📅 एकूण एकड :</span> 1
              </p>
              <p>
                <span className="font-semibold text-green-700"> 🧾शेड्यूल बिल:</span> {isBillReady ? <>तयार आहे</> : <>तयार नाही</>}
              </p>
              <div className="mt-3">
                <label>Total Plants (7 Feet x5 Feet)</label>
                <input
                  type="number"
                  value={totalPlants}
                  onChange={(e) => {
                    setTotalPlants(e.target.value);
                  }}
                  placeholder="Enter Total Plants"
                  className="w-full border border-green-300 text-green-800 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          <form>
            <div className="flex justify-center items-start min-h-screen py-10 px-4 bg-green-50 bg-cover bg-fixed" style={{ backgroundImage: `url(${bgImage})` }}>
              <div className="w-full max-w-6xl space-y-5">
                {weekForms.map((week, index) => (
                  <details key={index} className="mb-4 border border-green-300 rounded-xl shadow-md bg-white">
                    <summary className="bg-green-200 text-green-900 px-4 py-3 font-bold text-lg cursor-pointer">🌱 Week {week.weekNumber} - शेड्यूल फॉर्म</summary>
                    <div className="p-4  text-sm text-gray-800">
                      {/* Date Field */}
                      <div className="flex justify-between">
                        <div className="grid gap-3 items-center">
                          <label className="text-green-700 font-medium">Date:</label>
                          <input
                            type="date"
                            value={week.date}
                            onChange={(e) => handleWeekFormChange(index, "date", e.target.value)}
                            className=" border border-green-300 text-green-800 px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
                          />
                        </div>

                        {/* Other Input Fields */}
                        {/* Other Input Fields */}
                        {[
                          { name: "waterPerAcre", label: "पानी / एकड़ (लीटर में)", placeholder: "जैसे: 500" },
                          { name: "totalWater", label: "पानी कुल लीटर", placeholder: "जैसे: 500" },
                          // { name: "useStartDay", label: "आरंभ दिन से उपयोग करने का दिन", placeholder: "जैसे: 5 वें दिन से" },
                        ].map((field, i) => (
                          <div key={i} className="grid gap-3 items-center">
                            <label className="text-green-700 font-medium">{field.label}:</label>
                            <input
                              type="text"
                              value={week[field.name]}
                              onChange={(e) => {
                                handleWeekFormChange(index, field.name, e.target.value);
                                // }
                              }}
                              placeholder={field.placeholder}
                              className="w-full border border-green-300 text-green-800 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
                              // readOnly={field.name === "totalAcres"} // 🔒 Lock the field
                            />
                          </div>
                        ))}
                        <div className="grid gap-3 items-center">
                          <label className="block text-green-700 font-medium mt-2">दिवस:</label>
                          <p className="text-sm text-green-900 font-semibold">{week.useStartDay || ""}</p>
                        </div>
                      </div>

                      <h2 className="text-base font-semibold text-green-700 mt-4">🌿 उत्पाद विवरण - Product Details</h2>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col w-full md:w-1/2">
                          <input type="text" placeholder="Search product..." className="mb-2 border p-1.5 rounded text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                          <div className="flex flex-col gap-2 overflow-y-auto max-h-[260px] pr-2">
                            {filteredProducts.map((product) => {
                              const isSelected = !!week.products[product._id];
                              return (
                                <div key={product._id} className="flex justify-between items-center bg-green-50 p-2 rounded border border-green-200">
                                  <label className="flex items-center gap-3">
                                    <input type="checkbox" checked={isSelected} onChange={() => handleCheckboxChange(index, product._id)} />
                                    <span className="text-sm font-medium text-green-900">{product.name}</span>
                                    <span className="text-sm text-gray-600">₹{product.pricePerAcre} / acre</span>
                                  </label>

                                  <div className="flex gap-1">
                                    <input
                                      type="number"
                                      placeholder="ml"
                                      className="border rounded px-1 py-0.5 w-16 text-xs"
                                      disabled={!isSelected}
                                      value={week.products[product._id]?.ml || ""}
                                      onChange={(e) => handleQuantityChange(index, product._id, "ml", e.target.value, product.category, week.totalWater)}
                                    />
                                    <input
                                      type="number"
                                      placeholder="l"
                                      className="border rounded px-1 py-0.5 w-16 text-xs"
                                      disabled={!isSelected}
                                      value={week.products[product._id]?.l || ""}
                                      onChange={(e) => handleQuantityChange(index, product._id, "l", e.target.value, product.category, week.totalWater)}
                                    />
                                    <input
                                      type="number"
                                      placeholder="प्रति लीटर पानी मे मिली"
                                      className="border rounded px-1 py-0.5 w-28 text-xs"
                                      disabled={!isSelected}
                                      value={week.products[product._id]?.perLitreMix || ""}
                                      onChange={(e) => handlePerLitreChange(index, product._id, e.target.value, product.category, week.totalWater)}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="md:w-1/2 h-[260px] overflow-y-auto border-l border-green-200 pl-3">
                          <h3 className="font-semibold text-green-800 text-sm mb-1">चयनित उत्पाद (Selected Products):</h3>
                          <ul className="list-disc ml-5 text-sm text-gray-700 leading-snug">
                            {Object.entries(week.products).map(([id, data]) => {
                              const productName = products.find((p) => p._id === id)?.name || "Unknown";
                              return (
                                <li key={id}>
                                  {productName}: {data.ml || 0} ml/grm & {data.l || 0} ltr/kg प्रती लिटर पानी मे - {data.perLitreMix}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>

                      <div className="w-full mt-6 ">
                        <label className="text-green-700 font-medium  block w-full mb-2">निर्देश:</label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={week.instructions || ""}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            handleWeekFormChange(index, "instructions", data);
                          }}
                          config={{
                            toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "undo", "redo"],
                            toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "undo", "redo"],
                          }}
                        />
                      </div>
                    </div>
                  </details>
                ))}

                <div className="text-center mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow">
                    {" "}
                    सभी शेड्यूल सेव करें (Save All Schedules)
                  </button>
                  <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">
                    👀 शेड्यूल पहा (View Schedule)
                  </button>
                  <button onClick={() => generateScheduleBill()} disabled={!isBillReady} className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded shadow">
                    ✅ शेड्युल बिल
                  </button>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default Form1;
