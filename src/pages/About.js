const About = () => {
  return (
    <div className="w-full pt-5 bg-white mb-5">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left Image Section */}
          <div className="lg:w-1/2 mb-5 lg:mb-0">
            <div className="flex h-full border-4 border-green-600 pt-4">
              <img className="object-contain h-auto mt-auto mx-auto" src="https://demo.htmlcodex.com/1670/organic-farm-website-template/img/about.png" alt="About" />
            </div>
          </div>

          {/* Right Text Section */}
          <div className="lg:w-1/2 pb-5">
            <div className="mb-3 pb-2">
              <h6 className="text-green-600 uppercase font-semibold text-sm">About Us</h6>
              <h1 className="text-4xl font-bold text-gray-800">We Produce Organic Food For Your Family</h1>
            </div>
            <p className="mb-4 text-gray-600">
              Tempor erat elitr at rebum at at clita. Diam dolor diam ipsum et tempor sit. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod
              magna dolore erat amet magna
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <i className="fa fa-seedling text-5xl text-green-700 mb-2"></i>
                <h4 className="text-lg font-semibold text-gray-800">100% Organic</h4>
                <p className="text-gray-600">Labore justo vero ipsum sit clita erat lorem magna clita nonumy dolor magna dolor vero</p>
              </div>
              <div className="flex flex-col">
                <i className="fa fa-award text-5xl text-green-700 mb-2"></i>
                <h4 className="text-lg font-semibold text-gray-800">Award Winning</h4>
                <p className="text-gray-600">Labore justo vero ipsum sit clita erat lorem magna clita nonumy dolor magna dolor vero</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
