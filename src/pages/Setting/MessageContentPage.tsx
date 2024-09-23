import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PhoneIcon, VideoIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { get, post } from "@/utils/authUtils";
import { motion } from "framer-motion";
import dayjs from "dayjs";

interface Conversation {
  _id: string;
  customer_id: string;
  seller_id: string;
  last_message: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  _id: string;
  conversation_id: string;
  message: string;
  image_uri: string[];
  sender_id: string;
  created_at: string;
  updated_at: string;
}

const MessageContentPage: React.FC = () => {
  const { conversation_id } = useParams<{ conversation_id: string }>();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const user_id = currentUser.user_id;

  const fetchConversations = async () => {
    try {
      const response = await get("/conversation", "other");
      setConversations(response);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await get(`/message/${conversationId}/1`, "other");
      setMessages(response);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    fetchConversations();

    if (conversation_id) {
      fetchMessages(conversation_id);
    }
  }, [conversation_id]);

  const handleSendMessage = async () => {
    try {
      await post(`/message/${conversation_id}`, "other", {
        message: newMessage,
        image_uri: [],
      });
      setNewMessage("");
      await fetchMessages(conversation_id || "");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const conversationList = useMemo(
    () =>
      conversations.map((conversation) => (
        <motion.div
          key={conversation._id}
          className="border-b border-gray-700 pb-4 cursor-pointer bg-background_secondary flex items-center"
          onClick={() => navigate(`/setting/message/${conversation._id}`)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center mb-2">
            <img
              src="https://via.placeholder.com/40"
              alt="avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-blue-400">
                {conversation.customer_id}
              </span>
              <span className="text-gray-400 text-sm">
                {dayjs(conversation.updated_at).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          </div>
          <p className="text-gray-300">{conversation.last_message}</p>
        </motion.div>
      )),
    [conversations, navigate]
  );

  return (
    <div className="flex h-screen bg-background text-white bg-gray-900">
      <div className="w-1/3 border-r border-gray-700 bg-background_secondary">
        <Card className="bg-background_secondary text-white">
          <CardContent className="space-y-6 pt-4">
            {conversationList}
          </CardContent>
        </Card>
      </div>
      {conversation_id && (
        <div className="w-3/4 flex flex-col">
          <Card className="bg-background text-white flex-grow">
            <CardHeader className="w-full bg-background_secondary h-14">
              <div className="flex items-center justify-between h-full">
                <div className="flex space-x-2 items-center">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="avatar"
                    className="w-9 h-9 rounded-full"
                  />
                  <CardTitle className="text-xl">Hello</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className=" rounded-full bg-transparent">
                    <PhoneIcon className="w-5 h-5 text-white" />
                  </Button>
                  <Button className=" rounded-full bg-transparent">
                    <VideoIcon className="w-5 h-5 text-white" />
                  </Button>
                  <div className="relative">
                    <MoreHorizontal
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-background_secondary rounded-md shadow-lg z-10">
                        <ul>
                          <li className="px-4 py-2 hover:bg-background cursor-pointer">
                            Setting
                          </li>
                          <li className="px-4 py-2 hover:bg-background cursor-pointer">
                            View
                          </li>
                          <li className="px-4 py-2 hover:bg-background cursor-pointer">
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 overflow-y-auto pt-4 ">
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  className={`flex ${
                    message.sender_id === user_id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      message.sender_id === localStorage.getItem("user_id")
                        ? "bg-blue-600"
                        : "bg-gray-700"
                    }`}
                  >
                    <p className="text-gray-300">{message.message}</p>
                    <span className="text-gray-400 text-xs">
                      {dayjs(message.created_at).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
          <div className="flex mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 rounded-l-lg bg-background_secondary text-gray-300"
            />
            <Button
              onClick={handleSendMessage}
              className="rounded-r-lg bg-blue-600 text-white"
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContentPage;
