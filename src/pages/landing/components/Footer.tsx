import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  // Smooth scrolling function for footer links
  const handleSmoothScroll = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <footer className="bg-black text-white py-10" id="footer">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-5">
        {/* About Us Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">About Us</h3>
          <p className="text-sm">
            Empowering Ethiopian communities through cooperative development
            and sustainable growth.
          </p>
        </div>

        {/* Quick Links Section 1 */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="#home" 
                className="hover:underline cursor-pointer transition-colors hover:text-cyan-400"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('home');
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className="hover:underline cursor-pointer transition-colors hover:text-cyan-400"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('about');
                }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#services" 
                className="hover:underline cursor-pointer transition-colors hover:text-cyan-400"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('services');
                }}
              >
                Services
              </a>
            </li>
            <li>
              <a 
                href="#contact-us" 
                className="hover:underline cursor-pointer transition-colors hover:text-cyan-400"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('contact-us');
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links Section 2 */}
        <div>
          <h3 className="text-lg font-bold mb-4">More Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="#features" 
                className="hover:underline cursor-pointer transition-colors hover:text-cyan-400"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('features');
                }}
              >
                Features
              </a>
            </li>
            <li>
              <a 
                href="#statistics" 
                className="hover:underline cursor-pointer transition-colors hover:text-cyan-400"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('statistics');
                }}
              >
                Statistics
              </a>
            </li>
            <li>
              <a 
                href="#testimonials" 
                className="hover:underline cursor-pointer transition-colors hover:text-cyan-400"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('testimonials');
                }}
              >
                Testimonials
              </a>
            </li>
            <li>
              <a 
                href="#call-to-action" 
                className="hover:underline cursor-pointer transition-colors hover:text-cyan-400"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('call-to-action');
                }}
              >
                Get Started
              </a>
            </li>
          </ul>
        </div>

        {/* Connect With Us Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
