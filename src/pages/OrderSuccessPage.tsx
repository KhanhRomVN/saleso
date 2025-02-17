import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-background_secondary shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-green-600">
              Đặt hàng thành công!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div
              className="mb-4 flex justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được đơn hàng của bạn và
              sẽ xử lý nó trong thời gian sớm nhất.
            </p>
            <p className="font-semibold text-sm sm:text-base">Mã đơn hàng: #12345</p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto hover:bg-blue-100 transition-colors duration-300"
              onClick={() => navigate("/order")}
            >
              Xem chi tiết đơn hàng
            </Button>
            <Button
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 transition-colors duration-300"
              onClick={() => navigate("/")}
            >
              Tiếp tục mua sắm
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
