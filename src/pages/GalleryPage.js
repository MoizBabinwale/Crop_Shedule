import React, { useState } from "react";
import img1 from "../assets/Galleryimg/1.jpeg";
import img2 from "../assets/Galleryimg/2.jpeg";
import img3 from "../assets/Galleryimg/3.jpeg";
import img4 from "../assets/Galleryimg/4.jpeg";
import img5 from "../assets/Galleryimg/5.jpeg";
import img6 from "../assets/Galleryimg/6.jpeg";
import img7 from "../assets/Galleryimg/7.jpeg";
import img8 from "../assets/Galleryimg/8.jpeg";
import img9 from "../assets/Galleryimg/9.jpeg";
import img10 from "../assets/Galleryimg/10.jpeg";
import img11 from "../assets/Galleryimg/11.jpeg";
import img12 from "../assets/Galleryimg/12.jpeg";
import img13 from "../assets/Galleryimg/13.jpeg";
import img14 from "../assets/Galleryimg/14.jpeg";
import img15 from "../assets/Galleryimg/15.jpeg";
import img16 from "../assets/Galleryimg/16.jpeg";
import img17 from "../assets/Galleryimg/17.jpeg";
import img18 from "../assets/Galleryimg/18.jpeg";
import img19 from "../assets/Galleryimg/19.jpeg";
import img20 from "../assets/Galleryimg/20.jpeg";
import poster1 from "../assets/1.jpg";
import poster2 from "../assets/2.jpg";
import poster3 from "../assets/3.jpg";
import poster4 from "../assets/4.jpg";
import poster5 from "../assets/5.jpg";
import poster6 from "../assets/6.jpg";
import poster7 from "../assets/7.jpg";
import poster8 from "../assets/8.jpg";

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const imagesSrc = [img11, img12, img13, img14, img15, img16, img17, img18, img19, img20];
  const posters = [poster1, poster2, poster3, poster4, poster5, poster6, poster7, poster8];

  const sections = [
    {
      images: [img1, img2, img3, img4],
      text: `आमच्या शेतकरी मित्रांना आम्ही सेंद्रिय शेतीचे फायदे सांगितले. रासायनिक खतांच्या अतिवापरामुळे जमिनीची सुपीकता कमी होते, पिकांची गुणवत्ता घटते आणि पाण्याचे प्रदूषण वाढते. सेंद्रिय शेतीमुळे जमिनीची आरोग्य टिकून राहते, उत्पादनातील पोषणमूल्य वाढते आणि बाजारात चांगला दर मिळतो.`,
    },
    {
      images: [img5, img6],
      text: `आम्ही 'वाइज इन्कम' संकल्पना समजावली. कमी खर्चात अधिक नफा मिळविण्यासाठी पिकांची फेरपालट, मिश्रपीक पद्धती आणि सेंद्रिय खतांचा वापर या गोष्टींचा अवलंब करण्याचे महत्त्व पटवून दिले.`,
    },
    {
      images: [img7, img8, img9, img10],
      text: `सेंद्रिय शेतीतून तयार झालेले उत्पादन निर्यात करण्यासाठी योग्य दर्जा व प्रमाणपत्र मिळविण्याची माहिती दिली. तसेच, बाजारपेठेत थेट विक्री करण्याच्या संधींबद्दल चर्चा केली.`,
    },
  ];

  return (
    <div className="bg-green-50 min-h-screen px-4 py-8">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">📢 Awareness Posters</h2>

      {/* Poster Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {posters.map((src, index) => (
          <div key={index} className="cursor-pointer overflow-hidden rounded-xl shadow-md border border-green-200 hover:scale-105 transition-transform" onClick={() => setSelectedImage(src)}>
            <img src={src} alt={`Awareness Poster ${index + 1}`} className="w-full aspect-square object-cover" />
          </div>
        ))}
      </div>
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-8">
        🌱 Awareness Camp of Organic Food Farming
        <span className="block text-lg md:text-xl text-green-600 mt-2">With Wise Income Explanation</span>
      </h1>

      <div className="flex  gap-3 flex-1 mb-5">
        {/* First Row of Images */}
        <div className="grid grid-cols-2 gap-3 w-1/2">
          {imagesSrc.slice(0, 4).map((src, imgIndex) => (
            <img
              key={imgIndex}
              src={src}
              alt={`Awareness Camp - ${imgIndex + 1}`}
              className="w-full h-32 object-cover rounded-xl shadow-md border border-green-200 hover:scale-105 transition-transform"
              onClick={() => setSelectedImage(src)}
            />
          ))}
        </div>

        {/* Second Row of Images */}
        <div className="grid grid-cols-2 gap-3 w-1/2">
          {imagesSrc.slice(5, 9).map((src, imgIndex) => (
            <img
              key={imgIndex + 5}
              src={src}
              alt={`Awareness Camp - ${imgIndex + 6}`}
              className="w-full h-32 object-cover rounded-xl shadow-md border border-green-200 hover:scale-105 transition-transform"
              onClick={() => setSelectedImage(src)}
            />
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {sections.map((section, index) => (
          <div key={index} className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
            {/* Image collage */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {section.images.map((src, imgIndex) => (
                <img
                  key={imgIndex}
                  src={src}
                  alt={`Awareness Camp ${index + 1}-${imgIndex + 1}`}
                  className="w-full h-40 object-cover rounded-xl shadow-md border border-green-200 hover:scale-105 transition-transform"
                  onClick={() => setSelectedImage(src)}
                />
              ))}
            </div>

            {/* Text content */}
            <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-green-200">
              <p className="text-green-700 text-lg leading-relaxed">{section.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-center text-green-600 mt-8 text-sm">Promoting sustainable farming for better health & income 🌾</p>
      {/* Modal for enlarged image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <button className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 font-bold text-green-700 hover:bg-green-200" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <img src={selectedImage} alt="Enlarged view" className="max-w-full max-h-[90vh] rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
