import React, { useEffect, useState } from "react";
import { addInstruction, deleteInstruction, editInstruction, getCropById, getInstructions, getProductList, getSchedulesByCropId, submitData } from "../api/api";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import bgImage from "../assets/farme.jpg";
import { CKEditor } from "@ckeditor/ckeditor5-react";

// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import InstructionSelector from "./InstructionSelector";

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
  const [cropWeekInterval, setCropWeekInterval] = useState(0);

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

  const handleWeekFormChange = (index, field, value) => {
    const updatedWeeks = [...weekForms];

    if (field === "date" && index === 0) {
      const startDate = new Date(value);

      // ✅ If invalid start date, just update and stop
      if (isNaN(startDate.getTime())) {
        updatedWeeks[index].date = value || "";
        setWeekForms(updatedWeeks);
        return;
      }

      // ✅ Default to 7 days if cropWeekInterval is missing or invalid
      const interval = Number(cropWeekInterval) || 7;

      updatedWeeks.forEach((week, i) => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i * interval);

        // ✅ Safe conversion
        if (!isNaN(newDate.getTime())) {
          week.date = newDate.toISOString().split("T")[0];
        }

        // ✅ Calculate day difference
        if (i === 0) {
          week.useStartDay = "आरंभ दिवस";
        } else {
          const diffDays = Math.floor((newDate - startDate) / (1000 * 60 * 60 * 24));
          week.useStartDay = `${diffDays} वा दिन`;
        }
      });
    } else if (field === "instructions") {
      updatedWeeks[index].instructions = value;
    } else {
      updatedWeeks[index][field] = value;

      if (field === "date" && index !== 0) {
        const startDate = new Date(updatedWeeks[0].date);
        const currentDate = new Date(value);

        if (!isNaN(startDate.getTime()) && !isNaN(currentDate.getTime())) {
          const diffDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
          updatedWeeks[index].useStartDay = diffDays === 0 ? "आरंभ दिवस" : `${diffDays} वा दिन`;
        }
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

  const handlePerLitreChange = (weekIndex, productId, value, category, totalWater, rate) => {
    const numericValue = parseFloat(value);

    setWeekForms((prev) =>
      prev.map((week, idx) => {
        if (idx !== weekIndex) return week;

        let ml = week.products?.[productId]?.ml || "";
        let l = week.products?.[productId]?.l || "";
        let totalRate = week.products?.[productId]?.totalRate || 0;
        //
        if (category !== "खेत पर पत्तों से धुवा" && totalWater && !isNaN(numericValue)) {
          ml = (numericValue * totalWater).toFixed(0); // total ml
          l = ((numericValue * totalWater) / 1000).toFixed(3); // convert to litres
          totalRate = (parseFloat(ml) * rate).toFixed(2); // 💰 multiply with rate per ml/gm
        } else {
          ml = (numericValue * 1).toFixed(0); // total ml
          l = (numericValue / 1000).toFixed(3); // convert to litres
          totalRate = (parseFloat(ml) * rate).toFixed(2);
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
              totalRate,
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
          totalWater: week.waterPerAcre,
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

        setIsBillReady(true);
        setScheduleId(res.data._id);
      }
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
      getCropDataById(cropId);
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

                // ✅ Calculate totalRate if ml and rate are available
                let totalRate = 0;
                if (ml && product?.rate) {
                  totalRate = (parseFloat(ml) * product.rate).toFixed(2);
                }

                productsObject[productId] = {
                  ml: ml || "",
                  l: l || "",
                  perLitreMix: product.perLitreMix,
                  instruction: product.instruction,
                  category: product?.category,
                  rate: product?.rate,
                  totalRate, // <-- store here
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

  const getCropDataById = async (cropId) => {
    setLoading(true);
    try {
      const res = await getCropById(cropId);
      if (res) {
        setCropWeekInterval(res?.weekInterval);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate quotation");
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/schedule/${cropId}`);
  };

  const generateScheduleBill = () => {
    navigate(`/schedulebill/${scheduleId}`);
  };

  const [instructions, setInstructions] = useState([]);
  const [insLoading, setInsLoading] = useState(false);

  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = async () => {
    setInsLoading(true);
    const data = await getInstructions();
    setInstructions(data);
    setInsLoading(false);
  };

  const [newInstruction, setNewInstruction] = useState("");

  const [open, setOpen] = useState(false);
  // const [newInstruction, setNewInstruction] = useState("");
  // const [instructions, setInstructions] = useState([
  //   "200 लीटर पानी में मिलाकर मिश्रण तैयार करना है।",
  //   "इस मिश्रण का स्प्रे करना है या ड्रिप से देना है।",
  // ]);
  const [editId, setEditId] = useState(null);

  // Add or update
  const handleAddInstruction = async () => {
    if (!newInstruction.trim()) return;

    if (editId !== null) {
      await editInstruction(editId, newInstruction); // ✅ wait for update
      setEditId(null);
    } else {
      await addInstruction(newInstruction); // ✅ wait for add
    }

    await fetchInstructions(); // ✅ fetch after DB update
    setNewInstruction("");
  };

  // Delete
  const handleDelete = (id) => {
    // setInstructions(instructions.filter((_, i) => i !== index));
    deleteInstruction(id);
    fetchInstructions();
  };

  // Edit
  const handleEdit = (inst) => {
    setNewInstruction(inst.text);
    setEditId(inst._id);

    // fetchInstructions()
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
              <div className="w-full max-w-6xl space-y-6">
                {weekForms.map((week, index) => (
                  <details key={index} className="border border-green-300 rounded-2xl shadow-lg bg-white overflow-hidden">
                    <summary className="bg-green-200 text-green-900 px-5 py-4 font-bold text-lg cursor-pointer select-none">🌱 Week {week.weekNumber} - शेड्यूल फॉर्म</summary>

                    <div className="p-6 text-sm text-gray-800 space-y-6">
                      {/* Date + Water Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                          <label className="text-green-700 font-medium mb-1">Date:</label>
                          <input
                            type="date"
                            value={week.date}
                            onChange={(e) => handleWeekFormChange(index, "date", e.target.value)}
                            className="border border-green-300 text-green-800 px-3 py-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-green-700 font-medium mb-1">पानी / एकड़ (लीटर में)</label>
                          <input
                            type="text"
                            value={week.waterPerAcre}
                            onChange={(e) => handleWeekFormChange(index, "waterPerAcre", e.target.value)}
                            placeholder="जैसे: 500"
                            className="border border-green-300 text-green-800 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-green-700 font-medium mb-1">दिवस:</label>
                          <p className="text-base text-green-900 font-semibold border rounded-lg bg-green-50 px-3 py-2">{week.useStartDay || "-"}</p>
                        </div>
                      </div>

                      {/* Product Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product List */}
                        <div>
                          <h3 className="font-semibold text-green-800 text-base mb-2">उत्पाद चयन (Select Products):</h3>
                          <input type="text" placeholder="Search product..." className="mb-3 border p-2 rounded-lg text-sm w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                          <div className="flex flex-col gap-3 overflow-y-auto max-h-[280px] pr-2">
                            {filteredProducts.map((product) => {
                              const isSelected = !!week.products[product._id];
                              return (
                                <div key={product._id} className="flex justify-between items-center bg-green-50 p-2 rounded-lg border border-green-200 hover:bg-green-100 transition">
                                  <label className="flex items-center gap-3">
                                    <input type="checkbox" checked={isSelected} onChange={() => handleCheckboxChange(index, product._id)} />
                                    <span className="text-sm font-medium text-green-900">{product.name}</span>
                                    <span className="text-xs text-gray-600">₹{week.products[product._id]?.totalRate || 0}</span>
                                  </label>

                                  <div className="flex gap-1">
                                    <input
                                      type="number"
                                      placeholder="ml"
                                      className="border rounded px-1 py-0.5 w-16 text-xs"
                                      disabled={!isSelected}
                                      value={week.products[product._id]?.ml || ""}
                                      onChange={(e) => handlePerLitreChange(index, product._id, e.target.value, product.category, week.waterPerAcre, product.rate)}
                                    />
                                    <input
                                      type="number"
                                      placeholder="l"
                                      className="border rounded px-1 py-0.5 w-16 text-xs"
                                      disabled={!isSelected}
                                      value={week.products[product._id]?.l || ""}
                                      onChange={(e) => handlePerLitreChange(index, product._id, e.target.value, product.category, week.waterPerAcre, product.rate)}
                                    />
                                    <input
                                      type="number"
                                      placeholder="प्रति लीटर पानी मे मिली"
                                      className="border rounded px-1 py-0.5 w-28 text-xs"
                                      disabled={!isSelected}
                                      value={week.products[product._id]?.perLitreMix || ""}
                                      onChange={(e) => handlePerLitreChange(index, product._id, e.target.value, product.category, week.waterPerAcre, product.rate)}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Selected Products */}
                        <div>
                          <h3 className="font-semibold text-green-800 text-sm sm:text-base mb-2">चयनित उत्पाद (Selected):</h3>

                          <div className="max-h-40 sm:h-[280px] overflow-y-auto border border-green-200 rounded-lg p-3 bg-green-50">
                            {Object.entries(week.products).length === 0 ? (
                              <p className="text-gray-500 text-xs sm:text-sm">No products selected</p>
                            ) : (
                              <ul className="list-disc ml-4 sm:ml-5 text-xs sm:text-sm text-gray-700 leading-snug space-y-2 break-words">
                                {Object.entries(week.products).map(([id, data]) => {
                                  const productName = products.find((p) => p._id === id)?.name || "Unknown";
                                  return (
                                    <li key={id} className="flex flex-col sm:flex-row sm:items-center">
                                      <span className="font-medium text-green-900 mr-1">{productName}</span>
                                      <span className="text-gray-700">
                                        {data.ml || 0} ml/grm & {data.l || 0} ltr/kg
                                        <span className="block sm:inline text-gray-600"> प्रती लिटर पानी मे - {data.perLitreMix}</span>
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                          <div>
                            {Object.entries(week.products).length > 0 && week.instructions && (
                              <p className="text-sm text-green-900 leading-relaxed">
                                निर्देश :-{" "}
                                {(() => {
                                  // Normal products (not "खेत पर पत्तों से धुवा")
                                  const normalProducts = Object.entries(week.products)
                                    .filter(([id]) => {
                                      const product = products.find((p) => p._id === id);
                                      return product?.category !== "खेत पर पत्तों से धुवा";
                                    })
                                    .map(([id, data]) => {
                                      const productName = products.find((p) => p._id === id)?.name || "Unknown";

                                      let qtyText = "";
                                      if (data.l && parseFloat(data.l) >= 1) {
                                        qtyText = `${data.l} लीटर`;
                                      } else if (data.ml && data.ml > 0) {
                                        qtyText = `${data.ml} ml`;
                                      }

                                      return `${productName} ${qtyText}`;
                                    });

                                  // धुवा products (special case)
                                  const smokeProducts = Object.entries(week.products)
                                    .filter(([id]) => {
                                      const product = products.find((p) => p._id === id);
                                      return product?.category === "खेत पर पत्तों से धुवा";
                                    })
                                    .map(([id, data]) => {
                                      const productName = products.find((p) => p._id === id)?.name || "Unknown";

                                      // Show only Kg for धुवा
                                      let qtyText = "";
                                      if (data.l && parseFloat(data.l) > 0) {
                                        qtyText = `${data.l} किलो`;
                                      }

                                      return `${productName} ${qtyText} धुवा करना.`;
                                    });

                                  // Combine: normal first, then धुवा products at the end
                                  return (
                                    <>
                                      {normalProducts.join(" और ")} को {week.waterPerAcre} लीटर {week.instructions}
                                      {smokeProducts.length > 0 && ` और ${smokeProducts.join(" और ")}`}
                                    </>
                                  );
                                })()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div>
                        <button type="button" onClick={() => setOpen(true)} className="bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800 transition">
                          Manage Instructions
                        </button>
                      </div>
                      <div>
                        <label className="text-green-700 font-medium block mb-2">निर्देश:</label>
                        <select
                          className="w-full border border-green-300 text-green-800 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                          value={week.instructions || ""}
                          onChange={(e) => handleWeekFormChange(index, "instructions", e.target.value)}
                        >
                          <option value="">-- निर्देश चुनें --</option>
                          {instructions.map((instr) => (
                            <option key={instr._id} value={instr.text}>
                              {instr.text}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </details>
                ))}

                {/* Buttons */}
                <div className="text-center mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg shadow font-medium transition">
                    सभी शेड्यूल सेव करें
                  </button>
                  <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
                    👀 शेड्यूल पहा
                  </button>
                  <button
                    onClick={() => generateScheduleBill()}
                    disabled={!isBillReady}
                    className={`px-6 py-2 rounded-lg shadow font-semibold transition ${isBillReady ? "bg-green-700 hover:bg-green-800 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                  >
                    ✅ शेड्युल बिल
                  </button>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-4 sm:p-6 relative">
            {/* Close */}
            <button
              onClick={() => {
                setOpen(false);
                setNewInstruction("");
                setEditId(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-green-800 mb-4">निर्देश प्रबंधन</h2>

            {/* Add/Edit form */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
              <label className="text-green-700 font-medium block mb-2">नया निर्देश जोड़ें / एडिट करें :</label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" placeholder="नया निर्देश लिखें" value={newInstruction} onChange={(e) => setNewInstruction(e.target.value)} className="border rounded px-2 py-2 text-sm w-full" />
                <button type="button" onClick={handleAddInstruction} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                  {editId !== null ? "Update" : "Add"}
                </button>
              </div>
            </div>

            {/* List of instructions */}
            {insLoading ? (
              <>कृपया प्रतीक्षा करे...</>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {instructions.map((inst, i) => (
                  <li key={inst._id || i} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border">
                    <span className="text-sm text-gray-800">{inst.text}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(inst)} className="text-blue-600 hover:text-blue-800 text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(inst._id)} className="text-red-600 hover:text-red-800 text-sm">
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Form1;
