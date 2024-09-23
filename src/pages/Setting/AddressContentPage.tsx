import { useState, useEffect } from "react";
import { get, put } from "@/utils/authUtils";
import { toast } from "react-toastify";
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
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Address {
  country: string;
  address: string;
  isDefault?: boolean;
}

const AddressContent: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    country: "",
    address: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await get("/user/user-detail", "user");
      setAddresses(response.address || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (index: number) => {
    const updatedAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));

    try {
      await put("/user/update/user-detail", "user", {
        address: updatedAddresses,
      });
      setAddresses(updatedAddresses);
      toast.success("Default address updated successfully");
    } catch (error) {
      console.error("Error updating default address:", error);
      toast.error("Failed to update default address");
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewAddress = async () => {
    try {
      const updatedAddresses = [...addresses, newAddress];
      await put("/user/update/user-detail", "user", {
        address: updatedAddresses,
      });
      setAddresses(updatedAddresses);
      setIsAddingNew(false);
      setNewAddress({ country: "", address: "" });
      toast.success("New address added successfully");
    } catch (error) {
      console.error("Error adding new address:", error);
      toast.error("Failed to add new address");
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

  return (
    <div className="space-y-8 p-6 bg-background_secondary text-gray-100">
      <h2 className="text-2xl font-bold text-blue-300">Addresses</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((address, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-300">
                <span>Address {index + 1}</span>
                {address.isDefault && (
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    Default
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>{address.address}</p>
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
                  onClick={() => handleSetDefault(index)}
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
                    value={newAddress[field as keyof Address] as string}
                    onChange={(e) =>
                      handleAddressChange(
                        field as keyof Address,
                        e.target.value
                      )
                    }
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

export default AddressContent;
