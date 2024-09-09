import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer: React.FC = () => {
  const handleSubscribe = () => {
    toast.success("Thank you for subscribing!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <footer className="bg-background_secondary text-text_secondary">
      <ToastContainer />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">About Us</h3>
            <p>
              We are a leading Ecommerce platform offering a wide range of
              products for your shopping needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
              <Link to="/products" className="hover:text-primary">
                Products
              </Link>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">
              Subscribe to our Newsletter
            </h3>
            <div className="space-y-4">
              <p>
                Subscribe to our newsletter to get the latest updates and
                offers.
              </p>
              <div className="bg-white p-2 rounded-md flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent outline-none"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link to="https://www.facebook.com" target="_blank">
                <Facebook className="text-2xl" />
              </Link>
              <Link to="https://www.twitter.com" target="_blank">
                <Twitter className="text-2xl" />
              </Link>
              <Link to="https://www.instagram.com" target="_blank">
                <Instagram className="text-2xl" />
              </Link>
              <Link to="https://www.linkedin.com" target="_blank">
                <Linkedin className="text-2xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background_tertiary py-4 text-center text-sm">
        <p>© 2023 Ecommerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
