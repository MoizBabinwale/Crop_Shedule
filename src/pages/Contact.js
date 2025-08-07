const Contact = () => {
  return (
    <div className="w-full py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto text-center mb-10 max-w-xl">
          <h6 className="text-green-600 uppercase text-sm font-semibold mb-3">संपर्क करा</h6>
          <h1 className="text-4xl font-bold text-gray-800">कृपया आमच्याशी मोकळेपणाने संपर्क साधा</h1>
        </div>

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-0 shadow-lg">
          {/* Left Form Section */}
          <div className="lg:w-7/12 bg-green-600 p-6 lg:p-10 text-white">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="तुमचं नाव" className="bg-white text-gray-800 border-0 px-4 py-3 rounded w-full" style={{ height: "55px" }} />
                <input type="email" placeholder="तुमचा ईमेल" className="bg-white text-gray-800 border-0 px-4 py-3 rounded w-full" style={{ height: "55px" }} />
                <input type="text" placeholder="विषय" className="bg-white text-gray-800 border-0 px-4 py-3 rounded w-full col-span-1 md:col-span-2" style={{ height: "55px" }} />
                <textarea rows="3" placeholder="संदेश" className="bg-white text-gray-800 border-0 px-4 py-3 rounded w-full col-span-1 md:col-span-2"></textarea>
                <button type="submit" className="bg-gray-100 text-green-700 font-semibold w-full py-3 rounded col-span-1 md:col-span-2 hover:bg-white transition">
                  संदेश पाठवा
                </button>
              </div>
            </form>
          </div>

          {/* Right Contact Info Section */}
          <div className="lg:w-5/12 bg-gray-700 text-white p-6 lg:p-10">
            <h2 className="text-2xl font-bold mb-6">संपर्कात रहा</h2>

            <div className="flex items-start mb-6">
              <div className="bg-green-600 rounded-full w-[60px] h-[60px] flex items-center justify-center">
                <i className="bi bi-geo-alt text-white text-2xl"></i>
              </div>
              <div className="ml-4">
                <h5 className="text-lg font-semibold">आमचं कार्यालय</h5>
                <p>१२३, मुख्य रस्ता, पुणे, भारत</p>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <div className="bg-green-600 rounded-full w-[60px] h-[60px] flex items-center justify-center">
                <i className="bi bi-envelope-open text-white text-2xl"></i>
              </div>
              <div className="ml-4">
                <h5 className="text-lg font-semibold">ईमेल</h5>
                <p>info@example.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-600 rounded-full w-[60px] h-[60px] flex items-center justify-center">
                <i className="bi bi-phone-vibrate text-white text-2xl"></i>
              </div>
              <div className="ml-4">
                <h5 className="text-lg font-semibold">फोन</h5>
                <p>+९१ ९८७६५ ४३२१०</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
