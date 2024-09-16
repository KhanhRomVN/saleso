import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Cropper, { Area } from "react-easy-crop";
import {
  handleImageSelect,
  cropImageFile,
  handleUploadCroppedImage,
} from "@/utils/imageUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  Mail,
  Lock,
  Camera,
  Info,
  Loader2,
  Package,
  CheckCircle,
  XCircle,
  DollarSign,
  ShoppingCart,
  CreditCard,
  MessageCircle,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Plus,
  MapPin,
  Calendar,
} from "lucide-react";
import { get, post, put } from "@/utils/authUtils";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type TabId = "account" | "address" | "orders" | "payment" | "message" | "other";

const SettingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("account");

  const tabs = [
    { id: "account" as const, label: "Account", icon: "👤" },
    { id: "address" as const, label: "Address", icon: "🏠" },
    { id: "orders" as const, label: "Orders", icon: "📦" },
    { id: "payment" as const, label: "Payment", icon: "💳" },
    { id: "message" as const, label: "Message", icon: "✉️" },
    { id: "other" as const, label: "Other", icon: "⚙️" },
  ];

  const contentComponents: Record<TabId, React.FC> = {
    account: AccountContent,
    address: AddressContent,
    orders: OrderContent,
    payment: PaymentContent,
    message: MessageContent,
    other: OtherContent,
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabId);
  };

  return (
    <div className="flex w-full flex-col gap-4 pt-8">
      <p className="text-3xl ml-4 font-bold">Setting</p>
      <Tabs
        orientation="horizontal"
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col md:flex-row flex-grow pb-40"
      >
        <div className="w-[15%] pt-[100px]">
          <TabsList className="flex flex-col bg-transparent items-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex justify-start"
              >
                <span className="mr-2 text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="w-[85%] bg-background_secondary rounded-lg shadow-lg">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {React.createElement(contentComponents[tab.id])}
              </motion.div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

const AccountContent: React.FC = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [customerDetail, setCustomerDetail] = useState({
    avatar_uri: "",
    name: "",
    age: 0,
  });

  const [dialogState, setDialogState] = useState({
    verify: false,
    email: false,
    password: false,
    avatar: false,
    otp: false,
    forgetPassword: false,
    newPassword: false,
  });

  const [formState, setFormState] = useState({
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    verifyEmail: "",
    verifyPassword: "",
    forgetPasswordEmail: "",
    newPasswordForReset: "",
    otp: "",
    emailOtp: "",
  });

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [verifyPurpose, setVerifyPurpose] = useState<
    "email" | "password" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchCustomerDetail();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await get<{
        username: string;
        email: string;
        role: string;
      }>("/user");
      setUser(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerDetail = async () => {
    try {
      setIsLoading(true);
      const response = await get<{
        avatar_uri: string;
        name: string;
        age: number;
      }>("/user/user-detail");
      setCustomerDetail(response);
    } catch (error) {
      console.error("Error fetching customer detail:", error);
      toast.error("Failed to fetch customer detail");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field === "username") {
      setUser((prevUser) => ({ ...prevUser, [field]: String(value) }));
    } else {
      setCustomerDetail((prevDetail) => ({ ...prevDetail, [field]: value }));
    }
  };

  const handleUpdate = async (field: string) => {
    try {
      setIsLoading(true);
      if (field === "username") {
        await put("/user/update/username", { username: user.username });
      } else {
        await put("/user/update/user-detail", customerDetail);
      }
      toast.success(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } updated successfully!`
      );
      if (field === "username") {
        fetchUserData();
      } else {
        fetchCustomerDetail();
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(
        croppedAreaPixels as unknown as React.SetStateAction<null>
      );
    },
    []
  );

  const handleAvatarUpload = async () => {
    if (selectedImage && croppedAreaPixels) {
      try {
        setIsLoading(true);
        const croppedImage = await cropImageFile(
          croppedAreaPixels,
          selectedImage
        );
        if (croppedImage) {
          const imageUrl = await handleUploadCroppedImage(croppedImage);
          if (imageUrl) {
            await handleUpdate("avatar_uri");
            setDialogState((prev) => ({ ...prev, avatar: false }));
            toast.success("Avatar updated successfully!");
          }
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Failed to update avatar");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Existing functions remain unchanged
  const handleVerifyAccount = async () => {
    try {
      setIsLoading(true);
      await post("/user/verify", {
        email: formState.verifyEmail,
        password: formState.verifyPassword,
      });
      setDialogState((prev) => ({
        ...prev,
        verify: false,
        ...(verifyPurpose ? { [verifyPurpose]: true } : {}),
      }));
    } catch (error) {
      console.error("Error verifying account:", error);
      toast.error("Failed to verify account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async () => {
    try {
      setIsLoading(true);
      await post("/user/verify/new-email", { newEmail: formState.newEmail });
      setDialogState((prev) => ({ ...prev, email: false, otp: true }));
      toast.success("OTP sent to your new email. Please check your inbox.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmEmailChange = async () => {
    try {
      setIsLoading(true);
      await post("/user/update-email", {
        newEmail: formState.newEmail,
        otp: formState.emailOtp,
      });
      setDialogState((prev) => ({ ...prev, otp: false }));
      fetchUserData();
      toast.success("Email updated successfully!");
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setIsLoading(true);
      await post("/user/update/password", {
        newPassword: formState.newPassword,
      });
      setDialogState((prev) => ({ ...prev, password: false }));
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendForgetPasswordEmail = async () => {
    try {
      setIsLoading(true);
      await post("/user/forget-password", {
        email: formState.forgetPasswordEmail,
      });
      toast.success(
        "Password reset email sent. Please check your inbox for the OTP."
      );
      setDialogState((prev) => ({
        ...prev,
        forgetPassword: false,
        newPassword: true,
      }));
    } catch (error) {
      console.error("Error sending forget password email:", error);
      toast.error("Failed to send forget password email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      await post("/user/update/forget-password", {
        otp: formState.otp,
        newPassword: formState.newPasswordForReset,
      });
      toast.success("Password has been successfully reset.");
      setDialogState((prev) => ({ ...prev, newPassword: false }));
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenVerifyDialog = (purpose: "email" | "password") => {
    setVerifyPurpose(purpose);
    setDialogState((prev) => ({ ...prev, verify: true }));
  };

  const renderDialog = (
    key: keyof typeof dialogState,
    title: string,
    description: string,
    content: React.ReactNode
  ) => (
    <Dialog
      open={dialogState[key]}
      onOpenChange={(open) =>
        setDialogState((prev) => ({ ...prev, [key]: open }))
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-6 bg-background_secondary text-gray-100"
    >
      <Card className="bg-background border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-400">
            <User className="w-6 h-6" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Avatar className="w-24 h-24 border-2 border-blue-500">
              <AvatarImage src={customerDetail.avatar_uri} />
              <AvatarFallback className="bg-blue-600 text-xl">
                {customerDetail.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              onClick={() =>
                setDialogState((prev) => ({ ...prev, avatar: true }))
              }
              variant="outline"
              className="bg-gray-700 text-blue-400 border-blue-500 hover:bg-gray-600"
            >
              <Camera className="w-4 h-4 mr-2" /> Change Avatar
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["username", "name", "age"].map((field) => (
              <motion.div
                key={field}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="space-y-2"
              >
                <Label htmlFor={field} className="text-gray-300">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={field}
                    value={
                      field === "username"
                        ? user[field]
                        : customerDetail[field as keyof typeof customerDetail]
                    }
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100 flex-grow"
                  />
                  <Button
                    onClick={() => handleUpdate(field)}
                    disabled={isLoading}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-400">
            <Info className="w-6 h-6" />
            <span>Account Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {["email", "password"].map((field) => (
            <motion.div
              key={field}
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Label htmlFor={field} className="text-gray-300 w-24">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                type={field === "password" ? "password" : "text"}
                value={
                  field === "password"
                    ? "********"
                    : user[field as keyof typeof user]
                }
                readOnly
                className="flex-grow bg-gray-700 border-gray-600 text-gray-100"
              />
              <Button
                onClick={() =>
                  handleOpenVerifyDialog(field as "email" | "password")
                }
                variant="outline"
                className="bg-gray-700 text-blue-400 border-blue-500 hover:bg-gray-600"
              >
                {field === "email" ? (
                  <Mail className="w-4 h-4 mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}{" "}
                Change
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <AnimatePresence>
        {renderDialog(
          "avatar",
          "Change Avatar",
          "Upload and crop your new avatar image.",
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageSelect(
                  e as React.ChangeEvent<HTMLInputElement>,
                  setSelectedImage as unknown as React.Dispatch<
                    React.SetStateAction<File[]>
                  >,
                  () => setDialogState((prev) => ({ ...prev, avatar: true }))
                )
              }
            />
            {selectedImage && (
              <div className="relative h-64">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
            <Button onClick={handleAvatarUpload} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Upload New Avatar
            </Button>
          </>
        )}

        {renderDialog(
          "verify",
          "Verify Account",
          "Please enter your email and password to verify your account.",
          <>
            <Input
              placeholder="Email"
              value={formState.verifyEmail}
              onChange={(e) => handleFormChange("verifyEmail", e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={formState.verifyPassword}
              onChange={(e) =>
                handleFormChange("verifyPassword", e.target.value)
              }
            />
            <Button onClick={handleVerifyAccount} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Verify Account
            </Button>
            <Button
              onClick={() =>
                setDialogState((prev) => ({
                  ...prev,
                  verify: false,
                  forgetPassword: true,
                }))
              }
            >
              Forgot Password
            </Button>
          </>
        )}

        {renderDialog(
          "email",
          "Change Email",
          "Enter your new email address.",
          <>
            <Input
              placeholder="New Email"
              value={formState.newEmail}
              onChange={(e) => handleFormChange("newEmail", e.target.value)}
            />
            <Button onClick={handleEmailChange} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Update Email
            </Button>
          </>
        )}

        {renderDialog(
          "otp",
          "Confirm Email Change",
          "Enter the OTP sent to your new email address.",
          <>
            <Input
              placeholder="New Email"
              value={formState.newEmail}
              readOnly
            />
            <Input
              placeholder="OTP"
              value={formState.emailOtp}
              onChange={(e) => handleFormChange("emailOtp", e.target.value)}
            />
            <Button onClick={handleConfirmEmailChange} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Change Email
            </Button>
          </>
        )}

        {renderDialog(
          "password",
          "Change Password",
          "Enter your new password.",
          <>
            <Input
              type="password"
              placeholder="New Password"
              value={formState.newPassword}
              onChange={(e) => handleFormChange("newPassword", e.target.value)}
            />
            <Button onClick={handlePasswordChange} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Update Password
            </Button>
          </>
        )}

        {renderDialog(
          "forgetPassword",
          "Forgot Password",
          "Enter your email to receive a password reset link.",
          <>
            <Input
              placeholder="Email"
              value={formState.forgetPasswordEmail}
              onChange={(e) =>
                handleFormChange("forgetPasswordEmail", e.target.value)
              }
            />
            <Button
              onClick={handleSendForgetPasswordEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Send Reset Email
            </Button>
          </>
        )}

        {renderDialog(
          "newPassword",
          "Reset Password",
          "Enter your new password and the OTP sent to your email.",
          <>
            <Input
              type="password"
              placeholder="New Password"
              value={formState.newPasswordForReset}
              onChange={(e) =>
                handleFormChange("newPasswordForReset", e.target.value)
              }
            />
            <Input
              placeholder="OTP"
              value={formState.otp}
              onChange={(e) => handleFormChange("otp", e.target.value)}
            />
            <Button onClick={handleChangePassword} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Change Password
            </Button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const AddressContent: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "Home",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
      isDefault: true,
    },
    {
      id: "2",
      type: "Work",
      street: "456 Office Blvd",
      city: "Workville",
      state: "NY",
      zipCode: "67890",
      country: "USA",
      isDefault: false,
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState<
    Omit<Address, "id" | "isDefault">
  >({
    type: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleAddressChange = (field: string, value: string) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewAddress = () => {
    const newAddr: Address = {
      ...newAddress,
      id: (addresses.length + 1).toString(),
      isDefault: false,
    };
    setAddresses([...addresses, newAddr]);
    setIsAddingNew(false);
    setNewAddress({
      type: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };

  return (
    <div className="space-y-8 p-6 bg-background_secondary text-gray-100">
      <h2 className="text-2xl font-bold text-blue-300">Addresses</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-300">
                <span>{address.type}</span>
                {address.isDefault && (
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    Default
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>{address.street}</p>
              <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
              <p>{address.country}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="bg-gray-700 text-blue-300 border-blue-500 hover:bg-gray-600"
              >
                Edit
              </Button>
              {!address.isDefault && (
                <Button
                  variant="secondary"
                  onClick={() => handleSetDefault(address.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Set as Default
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {isAddingNew ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-blue-300">Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.keys(newAddress).map((field) => (
                <div key={field}>
                  <Label htmlFor={field} className="text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    value={newAddress[field as keyof typeof newAddress]}
                    onChange={(e) => handleAddressChange(field, e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddingNew(false)}
              className="bg-gray-700 text-blue-300 border-blue-500 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNewAddress}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Address
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Address
        </Button>
      )}
    </div>
  );
};

interface Order {
  _id: string;
  product_id: string;
  quantity: number;
  sku: string;
  total_amount: number;
  shipping_fee: number;
  shipping_address: string;
  customer_id: string;
  seller_id: string;
  order_status: string;
  created_at: string;
  sku_name: string;
  product_image: string;
  product_name: string;
  product_address: string;
}

const OrderContent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await get<Order[]>(
          `/order/${activeTab.toLowerCase()}`
        );
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const statusIcons = useMemo(
    () => ({
      Pending: <Package className="w-6 h-6 text-yellow-500" />,
      Accepted: <CheckCircle className="w-6 h-6 text-green-500" />,
      Refused: <XCircle className="w-6 h-6 text-red-500" />,
    }),
    []
  );

  const renderOrderCard = (order: Order) => (
    <motion.div
      key={order._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 hover:shadow-lg transition-shadow duration-300 bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-gray-200">
            <span className="text-sm md:text-base">
              Order #{order._id.slice(-6)}
            </span>
            <Badge variant="outline" className="bg-gray-700 text-yellow-400">
              {activeTab}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <img
              src={order.product_image}
              alt={order.product_name}
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md mr-4"
            />
            <div>
              <h3 className="font-semibold text-sm md:text-base text-gray-200">
                {order.product_name}
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                SKU: {order.sku_name}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm mb-4 text-gray-300">
            <p className="flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2 text-blue-400" /> Quantity:{" "}
              {order.quantity}
            </p>
            <p className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-400" /> Total: $
              {order.total_amount.toFixed(2)}
            </p>
            <p className="flex items-center col-span-2">
              <MapPin className="w-4 h-4 mr-2 text-purple-400" /> Shipping:{" "}
              {order.shipping_address}
            </p>
            <p className="flex items-center col-span-2">
              <Calendar className="w-4 h-4 mr-2 text-red-400" /> Ordered:{" "}
              {format(new Date(order.created_at), "PPP")}
            </p>
          </div>
          <div className="text-xs md:text-sm text-gray-400">
            <p className="font-semibold text-gray-300">Shipping Route:</p>
            <p>
              {order.shipping_address} → {order.product_address}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto p-4 bg-background_secondary text-gray-100">
      <Tabs
        defaultValue="Pending"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-800">
          {Object.keys(statusIcons).map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="flex items-center justify-center py-2 data-[state=active]:bg-gray-700"
            >
              {statusIcons[status as keyof typeof statusIcons]}
              <span className="ml-2 text-xs md:text-sm">{status}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(statusIcons).map((status) => (
          <TabsContent key={status} value={status}>
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center text-gray-200">
              {statusIcons[status as keyof typeof statusIcons]}
              <span className="ml-2">{status} Orders</span>
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <Card key={n} className="mb-4 bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-2/3 mb-4 bg-gray-700" />
                      <Skeleton className="h-20 w-full mb-4 bg-gray-700" />
                      <Skeleton className="h-4 w-1/2 mb-2 bg-gray-700" />
                      <Skeleton className="h-4 w-1/3 bg-gray-700" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map(renderOrderCard)
                  ) : (
                    <p className="text-center text-gray-400">
                      No {status.toLowerCase()} orders found.
                    </p>
                  )}
                </div>
              </AnimatePresence>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const PaymentContent: React.FC = () => {
  return (
    <Card className="bg-background_secondary text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-6 h-6" />
          <span>Payment Methods</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Credit/Debit Card</Label>
          <Input placeholder="Card Number" className="bg-input" />
          <div className="flex space-x-4">
            <Input placeholder="MM/YY" className="bg-input w-1/2" />
            <Input placeholder="CVV" className="bg-input w-1/2" />
          </div>
          <Button className="w-full">Add Card</Button>
        </div>
        <Separator />
        <div>
          <Label>Saved Payment Methods</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span>Visa ending in 1234</span>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>PayPal</span>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MessageContent: React.FC = () => {
  return (
    <Card className="bg-background_secondary text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6" />
          <span>Message Preferences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive order updates via email
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>SMS Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive order updates via SMS
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications on your device
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};

const OtherContent: React.FC = () => {
  return (
    <Card className="bg-background_secondary text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="w-6 h-6" />
          <span>Other Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </div>
          <Button variant="outline">Manage</Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Security</span>
          </div>
          <Button variant="outline">Review</Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Help & Support</span>
          </div>
          <Button variant="outline">Contact</Button>
        </div>
        <Separator />
        <Button variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default SettingPage;
