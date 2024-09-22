import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Heart,
  ShoppingCart,
  User,
  Settings,
  Moon,
  LogOut,
  Menu,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { get, del, put } from "@/utils/authUtils";
import SearchBar from "./SearchBar";
import { BACKEND_OTHER_URI } from "@/api";

interface User {
  user_id: string;
  username: string;
  role: string;
}

const MainHeader: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-background_secondary shadow-md h-14 sm:h-16"
    >
      <div className="mx-auto h-full">
        <div className="flex justify-between items-center h-full px-4 sm:px-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => handleNavigation("/")}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://i.ibb.co/CMSJMK3/Brandmark-make-your-logo-in-minutes-removebg-preview.png"
              alt="Logo"
              className="h-6 sm:h-8 w-auto"
            />
          </motion.div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <SearchBar />
            <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
              <NotificationDropdown />
              <AnimatedIconButton
                icon={<Heart size={20} />}
                onClick={() => handleNavigation("/wishlist")}
              />
              <AnimatedIconButton
                icon={<ShoppingCart size={20} />}
                onClick={() => handleNavigation("/cart")}
              />
            </div>
            {currentUser && <UserDropdown currentUser={currentUser} />}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => {
                /* Toggle mobile menu */
              }}
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedIconButton: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
}> = ({ icon, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
  >
    <Button
      variant="ghost"
      size="icon"
      className="text-gray-600 hover:text-primary"
    >
      {icon}
    </Button>
  </motion.div>
);

interface Notification {
  _id: string;
  title: string;
  content: string;
  notification_type: string;
  target_type: "individual" | "group" | "role" | "server-wide";
  target_ids: string[];
  target_role?: string;
  related?: {
    path: string;
  };
  can_delete: boolean;
  can_mark_as_read: boolean;
  is_read: boolean;
  created_at: string;
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await get<{ data: Notification[] }>(
        `/notification/${page}`,
        "other"
      );
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...(Array.isArray(response) ? response : [response]),
      ]);
      setPage((prevPage) => prevPage + 1);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setIsLoading(false);
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    fetchNotifications();
    // Thiết lập kết nối SSE

    const eventSource = new EventSource(
      `${BACKEND_OTHER_URI}/sse?userId=${currentUser.user_id}`
    );

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [currentUser.user_id]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await put(`/notification/mark-as-read/${notificationId}`, "other");
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await del(`/notification/${notificationId}`, "other");
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.can_mark_as_read) {
      handleMarkAsRead(notification._id);
    }
    if (notification.related?.path) {
      navigate(notification.related.path);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-primary"
          >
            <Bell size={20} />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto bg-background_secondary"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification._id}
            className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleNotificationClick(notification)}
            onSelect={(e) => e.preventDefault()}
          >
            <div>
              <h4
                className={`font-semibold ${
                  notification.is_read ? "text-gray-600" : "text-foreground"
                }`}
              >
                {notification.title}
              </h4>
              <p className="text-sm text-gray-500">{notification.content}</p>
              <span className="text-xs text-gray-400">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </div>
            {notification.can_delete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleDelete(notification._id);
                }}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </DropdownMenuItem>
        ))}
        {isLoading && (
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="justify-center"
          >
            Loading...
          </DropdownMenuItem>
        )}
        {!isLoading && notifications.length > 0 && (
          <DropdownMenuItem
            onClick={fetchNotifications}
            onSelect={(e) => e.preventDefault()}
            className="justify-center"
          >
            <p>Load more</p>
          </DropdownMenuItem>
        )}
        {!isLoading && notifications.length === 0 && (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            No notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserDropdown: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full overflow-hidden"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/api/placeholder/40/40"
                alt={currentUser.username}
              />
              <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background_secondary">
        <DropdownMenuItem onClick={() => navigate("/setting")}>
          <User className="mr-2 h-4 w-4" />
          <span>My Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/setting")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Moon className="mr-2 h-4 w-4" />
          <span>Change Theme</span>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainHeader;
