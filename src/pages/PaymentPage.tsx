import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaQrcode, FaWallet, FaUniversity, FaCreditCard } from 'react-icons/fa';

const QRPayment: React.FC<{ logo: string; name: string; qrCode: string }> = ({ logo, name, qrCode }) => (
  <div className="space-y-4">
    <img src={logo} alt={`${name} Logo`} className="w-16 h-16 mx-auto" />
    <p className="text-center text-sm text-gray-300">Quét mã QR bằng ứng dụng {name} để thanh toán</p>
    <div className="flex justify-center">
      <img src={qrCode} alt="QR Code" className="w-40 h-40 shadow-md rounded-lg" />
    </div>
  </div>
);

const MomoPayment: React.FC = () => (
  <QRPayment 
    logo="https://i.ibb.co/hYNsL2M/momo-logo.png"
    name="Momo"
    qrCode="https://i.ibb.co/XZxrXyP/momo-qr.jpg"
  />
);

const ZaloPayPayment: React.FC = () => (
  <QRPayment 
    logo="https://i.ibb.co/9ZfWVF9/zalo-logo.png"
    name="ZaloPay"
    qrCode="https://i.ibb.co/zxKHSzt/zalo-qr.jpg"
  />
);

const VNBankPayment: React.FC = () => (
  <div className="space-y-4">
    <Label htmlFor="bank" className="text-sm text-gray-300">Chọn ngân hàng của bạn</Label>
    <select id="bank" className="w-full p-2 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-300">
      {['Vietcombank', 'Techcombank', 'BIDV', 'Agribank'].map(bank => (
        <option key={bank}>{bank}</option>
      ))}
    </select>
    <Input type="text" placeholder="Số tài khoản" className="w-full p-2 text-sm bg-gray-800 text-gray-300" />
    <Button className="w-full py-2 text-sm bg-blue-600 hover:bg-blue-700">Tiếp tục đến Internet Banking</Button>
  </div>
);

const IntlBankPayment: React.FC = () => (
  <div className="space-y-4">
    <Label htmlFor="card-number" className="text-sm text-gray-300">Thông tin thẻ</Label>
    <Input type="text" id="card-number" placeholder="Số thẻ" className="w-full p-2 text-sm bg-gray-800 text-gray-300" />
    <div className="grid grid-cols-2 gap-4">
      <Input type="text" placeholder="MM/YY" className="p-2 text-sm bg-gray-800 text-gray-300" />
      <Input type="text" placeholder="CVC" className="p-2 text-sm bg-gray-800 text-gray-300" />
    </div>
    <Input type="text" placeholder="Tên chủ thẻ" className="w-full p-2 text-sm bg-gray-800 text-gray-300" />
    <Button className="w-full py-2 text-sm bg-blue-600 hover:bg-blue-700">Thanh toán ngay</Button>
  </div>
);

const PaymentMethod: React.FC<{ icon: React.ElementType; label: string; value: string; activeColor: string }> = 
  ({ icon: Icon, label, value, activeColor }) => (
  <TabsTrigger value={value} className={`flex flex-col items-center p-2 data-[state=active]:${activeColor} text-gray-300`}>
    <Icon className="w-6 h-6 mb-1" />
    <span className="text-xs">{label}</span>
  </TabsTrigger>
);

const OrderSummary: React.FC = () => (
  <Card className="shadow-lg bg-gray-900">
    <CardHeader className="bg-gray-800">
      <CardTitle className="text-xl text-gray-100">Tóm tắt đơn hàng</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pt-4">
      <div className="flex justify-between items-center text-sm text-gray-300">
        <span>Tổng số mặt hàng:</span>
        <span className="font-semibold">3</span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-300">
        <span>Tổng tiền:</span>
        <span className="font-semibold text-lg text-green-400">2,299,000 ₫</span>
      </div>
      <div className="pt-4 border-t border-gray-700">
        <h3 className="font-semibold text-sm mb-2 text-gray-200">Địa chỉ giao hàng:</h3>
        <p className="text-xs text-gray-400">123 Đường Lê Lợi, Quận 1, TP.HCM</p>
      </div>
    </CardContent>
  </Card>
);

const PaymentOptions: React.FC = () => (
  <Card className="shadow-lg bg-gray-900">
    <CardHeader className="bg-gray-800">
      <CardTitle className="text-xl text-gray-100">Phương thức thanh toán</CardTitle>
      <CardDescription className="text-sm text-gray-300">Chọn phương thức thanh toán ưa thích của bạn</CardDescription>
    </CardHeader>
    <CardContent className="pt-4">
      <Tabs defaultValue="momo">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-800">
          <PaymentMethod icon={FaQrcode} label="Momo" value="momo" activeColor="bg-purple-900" />
          <PaymentMethod icon={FaWallet} label="ZaloPay" value="zalopay" activeColor="bg-blue-900" />
          <PaymentMethod icon={FaUniversity} label="VN Bank" value="vnbank" activeColor="bg-green-900" />
          <PaymentMethod icon={FaCreditCard} label="Intl Bank" value="intlbank" activeColor="bg-yellow-900" />
        </TabsList>
        <TabsContent value="momo"><MomoPayment /></TabsContent>
        <TabsContent value="zalopay"><ZaloPayPayment /></TabsContent>
        <TabsContent value="vnbank"><VNBankPayment /></TabsContent>
        <TabsContent value="intlbank"><IntlBankPayment /></TabsContent>
      </Tabs>
    </CardContent>
    <CardFooter className="pt-4">
      <Button className="w-full text-sm py-3 bg-green-600 hover:bg-green-700 transition-colors">
        Xác nhận thanh toán
      </Button>
    </CardFooter>
  </Card>
);

export default function PaymentPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl  text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderSummary />
        <PaymentOptions />
      </div>
    </div>
  );
}