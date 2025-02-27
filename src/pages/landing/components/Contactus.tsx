import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./ContactForm";

const ContactUs = () => {
  return (
    <div
      className="flex flex-col lg:flex-row items-center justify-between p-8 bg-gray-50"
      id="contact"
    >
      <ContactInfo />
      <ContactForm />
    </div>
  );
};

export default ContactUs;

const ContactInfo = () => {
  return (
    <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
      <button className="bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
        Contact Us
      </button>
      <h2 className="text-3xl font-bold text-gray-900 mt-4">Get in Touch</h2>
      <p className="text-gray-600 mt-2 text-lg">
        Have questions? We're here to help and would love to hear from you.
      </p>
      <div className="mt-6 space-y-4">
        <p className="flex items-center text-gray-600">
          <Mail size={18} />
          <span className="ml-2">contact@ethiopiancooperative.org</span>
        </p>
        <p className="flex items-center text-gray-600">
          <Phone size={18} /> <span className="ml-2">+251 11 234 5678</span>
        </p>
        <p className="flex items-center text-gray-600">
          <MapPin size={18} />
          <span className="ml-2">Addis Ababa, Ethiopia</span>
        </p>
      </div>
    </div>
  );
};
