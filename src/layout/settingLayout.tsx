import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  User,
  Home,
  CreditCard,
  Bell,
  MessageCircle,
  Settings,
} from "lucide-react";

interface SettingLayoutProps {
  children: ReactNode;
}

const SettingLayout: React.FC<SettingLayoutProps> = ({ children }) => {
  const location = useLocation();

  const tabs = [
    { id: "account", label: "Account", icon: User, path: "/setting/account" },
    { id: "address", label: "Address", icon: Home, path: "/setting/address" },
    { id: "orders", label: "Orders", icon: Package, path: "/setting/order" },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
      path: "/setting/payment",
    },
    {
      id: "notification",
      label: "Notification",
      icon: Bell,
      path: "/setting/notification",
    },
    {
      id: "message",
      label: "Message",
      icon: MessageCircle,
      path: "/setting/message",
    },
    { id: "other", label: "Other", icon: Settings, path: "/setting/other" },
  ];

  return (
    <div className="flex w-full flex-col gap-4 pt-8">
      <h1 className="text-3xl ml-4 font-bold">Setting</h1>
      <div className="flex flex-col md:flex-row flex-grow pb-40">
        <nav className="w-full md:w-64 md:mr-8">
          <ul className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <Link
                  to={tab.path}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === tab.path
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{tab.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-grow bg-background_secondary rounded-lg shadow-lg ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SettingLayout;
