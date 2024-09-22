import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { postPublic } from "@/utils/authUtils";
import { useGoogleLogin } from "@react-oauth/google";
import { FaFacebook, FaGoogle, FaGithub } from "react-icons/fa";

interface ApiError extends Error {
  response?: {
    status: number;
  };
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleEmailSubmit = async () => {
    try {
      await postPublic("/auth/email-verify", "user", {
        email,
        role: "customer",
      });
      setShowOTPInput(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      if (
        error instanceof Error &&
        "response" in error &&
        (error as ApiError).response?.status === 400
      ) {
        toast.error("Email already registered");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error("Error sending email verification");
      }
    }
  };

  const handleOTPSubmit = async () => {
    try {
      const response = await postPublic("/auth/register-otp", "user", {
        email,
        otp,
        username,
        password,
        role: "customer",
      });
      setCustomerId(response.user_id);
      setShowDetailsDialog(true);
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  const handleDetailsSubmit = async () => {
    try {
      await postPublic("/user/create/user-detail/customer", "user", {
        customer_id: customerId,
        name,
        age,
      });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Error saving customer details");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-background p-4 sm:p-6 md:p-8"
    >
      <Card className="w-full max-w-md shadow-lg bg-background_secondary rounded-lg">
        <CardHeader className="space-y-1 text-center">
          <motion.img
            src="https://i.ibb.co/CMSJMK3/Brandmark-make-your-logo-in-minutes-removebg-preview.png"
            alt="logo"
            className="h-8 sm:h-10 md:h-12 mx-auto"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-400">
            Create an account
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Experience many new things
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <AnimatePresence>
            {showOTPInput && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="password"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-4"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-4"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            className="w-full bg-white hover:bg-blue-700 text-black transition-colors duration-300 text-sm sm:text-base"
            onClick={showOTPInput ? handleOTPSubmit : handleEmailSubmit}
          >
            {showOTPInput ? "Verify OTP" : "Register"}
          </Button>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-4">
              Continue with...
            </p>
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled
              >
                <FaFacebook className="text-blue-600" />
                <span>Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled
              >
                <FaGoogle className="text-red-500" />
                <span>Google</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled
              >
                <FaGithub className="text-gray-800" />
                <span>Github</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <div className="text-center pb-4">
          <p className="text-xs sm:text-sm text-gray-600">
            Already have an account?
          </p>
          <motion.p
            className="text-xs sm:text-sm text-blue-600 cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
          >
            Login here
          </motion.p>
        </div>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              placeholder="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleDetailsSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default RegisterPage;
