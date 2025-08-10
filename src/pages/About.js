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
      <div className="font-sans text-gray-800">
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center h-[80vh] flex items-center justify-center text-white"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6')", // farmer field bg
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">🌾 Krishi Seva Kendra</h1>
            <p className="text-lg md:text-xl mb-6">Bringing modern solutions for farmers with crop schedules, quotations, and more.</p>
            <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg shadow-lg transition duration-300">Get Started</button>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="w-full overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0.00,49.98 C150.00,150.00 349.27,-50.00 500.00,49.98 L500.00,0.00 L0.00,0.00 Z" className="fill-white"></path>
          </svg>
        </div>

        {/* Services Section */}

        {/* About Section */}
        <section className="bg-green-700 text-white py-12 px-6 md:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-lg leading-relaxed">
              We are dedicated to empowering farmers with digital tools that make farming more efficient, profitable, and sustainable. From detailed crop schedules to expert advice, we’ve got
              everything you need to grow better.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 text-center bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">Ready to improve your farming?</h2>
          <p className="text-gray-600 mb-6">Start using our services today and take your farming to the next level.</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300">Contact Us</button>
        </section>

        {/* Footer */}
        <footer className="bg-green-800 text-white py-6 mt-8">
          <div className="text-center text-sm">© {new Date().getFullYear()} Krishi Seva Kendra. All Rights Reserved.</div>
        </footer>
      </div>
    </div>
  );
};

export default About;
