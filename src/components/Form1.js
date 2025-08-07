import React, { useEffect, useState } from "react";
import { getProductList, getSchedulesByCropId, submitData } from "../api/api";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import bgImage from "../assets/farme.jpg";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Form1 = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [productLists, setProductsLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [weekForms, setWeekForms] = useState([]);
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const weeks = queryParams.get("weeks");
  const cropId = queryParams.get("id");
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [scheduleId, setScheduleId] = useState("");
  const modules = {
    toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["clean"]],
  };

  // Fetch products once
  useEffect(() => {
    fetchProducts();

    // Initialize weekForms
    setWeekForms(
      Array.from({ length: weeks }, (_, i) => ({
        weekNumber: i + 1,
        date: "",
        perLiter: "",
        waterPerAcre: "",
        totalAcres: "",
        totalWater: "",
        productAmountMg: "",
        productAmountLtr: "",
        useStartDay: "",
        instructions: "",
        products: {}, // { productId: { ml: "", l: "" } }
      }))
    );
  }, [weeks]);

  const fetchProducts = async () => {
    const data = await getProductList();
    if (data) {
      setProducts(data);
      setProductsLists(data);

      setProductsLoaded(true);
    }
  };

  const handleWeekFormChange = (weekIndex, field, value) => {
    setWeekForms((prev) => prev.map((week, idx) => (idx === weekIndex ? { ...week, [field]: value } : week)));
  };

  const handleQuantityChange = (weekIndex, productId, field, value) => {
    const numericValue = parseFloat(value);

    setWeekForms((prev) =>
      prev.map((week, idx) => {
        if (idx !== weekIndex) return week;

        let ml = week.products?.[productId]?.ml || "";
        let l = week.products?.[productId]?.l || "";

        if (field === "ml") {
          ml = value;
          l = value ? (numericValue / 1000).toFixed(3) : "";
        } else if (field === "l") {
          l = value;
          ml = value ? (numericValue * 1000).toFixed(0) : "";
        }

        return {
          ...week,
          products: {
            ...week.products,
            [productId]: {
              ...week.products?.[productId],
              ml,
              l,
            },
          },
        };
      })
    );
  };

  const handlePerLitreChange = (weekIndex, productId, value) => {
    setWeekForms((prev) =>
      prev.map((week, idx) => {
        if (idx !== weekIndex) return week;

        return {
          ...week,
          products: {
            ...week.products,
            [productId]: {
              ...week.products?.[productId],
              perLitreMix: value,
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
          updatedProducts[productId] = { ml: "", l: "" };
        }
        return { ...week, products: updatedProducts };
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert weekForms into a single schedule object with weeks array
    const scheduleData = {
      cropId,
      weeks: weekForms.map((week) => {
        const selected = Object.entries(week.products).map(([id, data]) => {
          const product = products.find((p) => p._id === id);
          return {
            name: product?.name || "Unknown",
            quantity: `${data.ml || 0} ml/g & ${data.l || 0} l/kg`,
            perLitreMix: data?.perLitreMix || 0,
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
    const fetchSchedule = async () => {
      try {
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
          console.log("res", res);

          setWeekForms(formattedWeeks);
          setScheduleId(res._id);
        } else {
          // If no schedule exists, initialize empty weekForms
          setWeekForms(
            Array.from({ length: weeks }, (_, i) => ({
              weekNumber: i + 1,
              date: "",
              perLiter: "",
              waterPerAcre: "",
              totalAcres: "",
              totalWater: "",
              productAmountMg: "",
              productAmountLtr: "",
              useStartDay: "",
              instructions: "",
              products: {},
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    if (cropId && productsLoaded) {
      fetchSchedule();
    }
  }, [cropId, productsLoaded, products, weeks]);

  const navigate = useNavigate();

  const handleClick = () => {
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
              <p>
                <span className="font-semibold text-green-700"> 🧾शेड्यूल बिल:</span> {scheduleId ? <>तयार आहे</> : <>तयार नाही</>}
              </p>
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
                          { name: "totalAcres", label: "कुल एकड़", placeholder: "जैसे: 2" },
                          { name: "totalWater", label: "पानी कुल लीटर", placeholder: "जैसे: 1000" },
                          { name: "useStartDay", label: "आरंभ दिन से उपयोग करने का दिन", placeholder: "जैसे: 5वें दिन से" },
                        ].map((field, i) => (
                          <div key={i} className="grid gap-3 items-center">
                            <label className="text-green-700 font-medium">{field.label}:</label>
                            <input
                              type="text"
                              value={week[field.name]}
                              onChange={(e) => handleWeekFormChange(index, field.name, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full border border-green-300 text-green-800 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
                            />
                          </div>
                        ))}
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
                                  <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={isSelected} onChange={() => handleCheckboxChange(index, product._id)} />
                                    <span className="text-sm">{product.name}</span>
                                  </label>
                                  <div className="flex gap-1">
                                    <input
                                      type="number"
                                      placeholder="ml"
                                      className="border rounded px-1 py-0.5 w-16 text-xs"
                                      disabled={!isSelected}
                                      value={week.products[product._id]?.ml || ""}
                                      onChange={(e) => handleQuantityChange(index, product._id, "ml", e.target.value)}
                                    />
                                    <input
                                      type="number"
                                      placeholder="l"
                                      className="border rounded px-1 py-0.5 w-16 text-xs"
                                      disabled={!isSelected}
                                      value={week.products[product._id]?.l || ""}
                                      onChange={(e) => handleQuantityChange(index, product._id, "l", e.target.value)}
                                    />
                                    <input
                                      type="number"
                                      placeholder="प्रति लीटर पानी मे मिली"
                                      className="border rounded px-1 py-0.5 w-28 text-xs"
                                      disabled={!isSelected}
                                      value={week.products[product._id]?.perLitreMix || ""}
                                      onChange={(e) => handlePerLitreChange(index, product._id, e.target.value)}
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
                                  {productName}: {data.ml || 0} ml/g & {data.l || 0} l/kg
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
                  <button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded shadow">
                    ✅ सभी शेड्यूल सेव करें (Save All Schedules)
                  </button>
                  <button onClick={() => generateScheduleBill()} disabled={!scheduleId} className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded shadow">
                    ✅ शेड्युल बिल पाहा
                  </button>
                  <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">
                    👀 शेड्यूल पहा (View Schedule)
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
