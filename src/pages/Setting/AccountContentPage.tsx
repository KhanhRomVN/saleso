import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { get, put, post } from "@/utils/authUtils";
import { Skeleton } from "@/components/ui/skeleton";

const AccountContent: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isForgettingPassword, setIsForgettingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState("");
  const [newPasswordForReset, setNewPasswordForReset] = useState("");
  const [resetPasswordOtp, setResetPasswordOtp] = useState("");
  const [showResetPasswordInputs, setShowResetPasswordInputs] = useState(false);
  const [verifyPurpose, setVerifyPurpose] = useState<
    "email" | "password" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await get("/user/", "user");
      const userDetailData = await get("/user/user-detail", "user");
      setUser(userData);
      setUserDetail(userDetailData);
      setEditedUser({ ...userData, ...userDetailData });
      setCurrentEmail(userData.email);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again later.");
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await put("/user/update/username", "user", {
        username: editedUser.username,
      });
      await put("/user/update/user-detail", "user", {
        name: editedUser.name,
        birthdate: editedUser.birthdate,
      });
      setUser((prev: any) => ({ ...prev, username: editedUser.username }));
      setUserDetail((prev: any) => ({
        ...prev,
        name: editedUser.name,
        birthdate: editedUser.birthdate,
      }));
      setIsEditing(false);
      toast.success("Account information updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update account information");
    }
  };

  const handleVerifyAccount = async () => {
    try {
      await post("/auth/verify/account", "user", {
        email: currentEmail,
        password: currentPassword,
      });
      setIsVerifying(false);
      if (verifyPurpose === "email") {
        setIsChangingEmail(true);
      } else if (verifyPurpose === "password") {
        setIsChangingPassword(true);
      }
      toast.success("Account verified successfully");
    } catch (error) {
      console.error("Error verifying account:", error);
      toast.error("Failed to verify account");
    }
  };

  const handleInitiateEmailChange = async () => {
    try {
      await put("/user/new-email", "user", { newEmail });
      toast.success("OTP sent to new email");
    } catch (error) {
      console.error("Error initiating email change:", error);
      toast.error("Failed to initiate email change");
    }
  };

  const handleConfirmEmailChange = async () => {
    try {
      await put("/user/update/new-email", "user", { newEmail, otp });
      setUser((prev: any) => ({ ...prev, email: newEmail }));
      setCurrentEmail(newEmail);
      setIsChangingEmail(false);
      setNewEmail("");
      setOtp("");
      toast.success("Email updated successfully");
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    }
  };

  const handleChangePassword = async () => {
    try {
      await put("/user/update/password", "user", { newPassword });
      setIsChangingPassword(false);
      setNewPassword("");
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  const handleSendForgetPasswordEmail = async () => {
    try {
      await put("/user/forget/password", "user", {
        email: forgetPasswordEmail,
      });
      setShowResetPasswordInputs(true);
      toast.success("OTP sent to your email. Please check your inbox.");
    } catch (error) {
      console.error("Error sending forget password email:", error);
      toast.error("Failed to send forget password email");
    }
  };

  const handleResetPassword = async () => {
    try {
      await put("/user/update/forget-password", "user", {
        email: forgetPasswordEmail,
        newPassword: newPasswordForReset,
        otp: resetPasswordOtp,
      });
      setIsForgettingPassword(false);
      setForgetPasswordEmail("");
      setNewPasswordForReset("");
      setResetPasswordOtp("");
      setShowResetPasswordInputs(false);
      toast.success("Password has been successfully reset.");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password");
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardHeader className="border-b border-gray-800">
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t border-gray-800 pt-4">
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-2xl font-bold text-red-400">
            Error Loading Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-red-900/30 border border-red-700 rounded-md p-4">
            <p className="text-red-300">{error}</p>
          </div>
          <Button
            onClick={fetchUserData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 shadow-lg">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-2xl font-bold text-blue-400">
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-blue-300">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={isEditing ? editedUser.username : user.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-blue-300">
              Email
            </Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-gray-800 border-gray-700 text-blue-100"
            />
          </div>
          <Separator className="bg-gray-800" />
          <div>
            <Label htmlFor="name" className="text-blue-300">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={isEditing ? editedUser.name : userDetail.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="birthdate" className="text-blue-300">
              Birthdate
            </Label>
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              value={isEditing ? editedUser.birthdate : userDetail.birthdate}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
            />
          </div>
        </div>
        <div className=" mt-6 flex items-center justify-between gap-4">
          <Button
            onClick={() => {
              setIsVerifying(true);
              setVerifyPurpose("email");
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
          >
            Change Email
          </Button>
          <Button
            onClick={() => {
              setIsVerifying(true);
              setVerifyPurpose("password");
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
          >
            Change Password
          </Button>
        </div>

        <Dialog open={isVerifying} onOpenChange={setIsVerifying}>
          <DialogContent className="bg-gray-900 text-blue-100">
            <DialogHeader>
              <DialogTitle className="text-blue-400">
                Verify Account
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Current Email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
              />
              <Input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
              />
              <Button
                onClick={handleVerifyAccount}
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
              >
                Verify Account
              </Button>
              <Button
                variant="link"
                onClick={() => {
                  setIsVerifying(false);
                  setIsForgettingPassword(true);
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                Forget Password?
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isChangingEmail} onOpenChange={setIsChangingEmail}>
          <DialogContent className="bg-gray-900 text-blue-100">
            <DialogHeader>
              <DialogTitle className="text-blue-400">Change Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
              />
              <Button
                onClick={handleInitiateEmailChange}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              >
                Send OTP
              </Button>
              <Input
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
              />
              <Button
                onClick={handleConfirmEmailChange}
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
              >
                Confirm Change
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
          <DialogContent className="bg-gray-900 text-blue-100">
            <DialogHeader>
              <DialogTitle className="text-blue-400">
                Change Password
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
              />
              <Button
                onClick={handleChangePassword}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
              >
                Change Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isForgettingPassword}
          onOpenChange={setIsForgettingPassword}
        >
          <DialogContent className="bg-gray-900 text-blue-100">
            <DialogHeader>
              <DialogTitle className="text-blue-400">
                Forget Password
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Email"
                value={forgetPasswordEmail}
                onChange={(e) => setForgetPasswordEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
              />
              <Button
                onClick={handleSendForgetPasswordEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              >
                Send Reset Email
              </Button>
              {showResetPasswordInputs && (
                <>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPasswordForReset}
                    onChange={(e) => setNewPasswordForReset(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
                  />
                  <Input
                    placeholder="OTP"
                    value={resetPasswordOtp}
                    onChange={(e) => setResetPasswordOtp(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-blue-100 focus:border-blue-500"
                  />
                  <Button
                    onClick={handleResetPassword}
                    className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
                  >
                    Reset Password
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 border-t border-gray-800 pt-4">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-blue-500 text-blue-400 hover:bg-blue-900"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
            >
              Save Changes
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
          >
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AccountContent;
