import { useState } from "react";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Package, Mail, Phone } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  productsCount: number;
  status: "active" | "inactive";
  joinDate: string;
}

const VendorsPage = () => {
  // Extract unique vendors from products and create vendor objects
  const vendors: Vendor[] = [
    {
      id: "1",
      name: "LuxHome",
      email: "contact@luxhome.com",
      phone: "+1 (555) 123-4567",
      productsCount: MOCK_PRODUCTS.filter(p => p.vendor === "LuxHome").length,
      status: "active",
      joinDate: "2023-01-15"
    },
    {
      id: "2",
      name: "GreenCraft",
      email: "hello@greencraft.com",
      phone: "+1 (555) 234-5678",
      productsCount: MOCK_PRODUCTS.filter(p => p.vendor === "GreenCraft").length,
      status: "active",
      joinDate: "2023-02-20"
    },
    {
      id: "3",
      name: "CozyThreads",
      email: "info@cozythreads.com",
      phone: "+1 (555) 345-6789",
      productsCount: MOCK_PRODUCTS.filter(p => p.vendor === "CozyThreads").length,
      status: "active",
      joinDate: "2023-03-10"
    },
    {
      id: "4",
      name: "WoodWorks",
      email: "support@woodworks.com",
      phone: "+1 (555) 456-7890",
      productsCount: MOCK_PRODUCTS.filter(p => p.vendor === "WoodWorks").length,
      status: "active",
      joinDate: "2023-04-05"
    }
  ];

  const [vendorsList, setVendorsList] = useState(vendors);

  const toggleVendorStatus = (vendorId: string) => {
    setVendorsList(prev =>
      prev.map(vendor =>
        vendor.id === vendorId
          ? { ...vendor, status: vendor.status === "active" ? "inactive" : "active" }
          : vendor
      )
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Vendors</h2>

      {vendorsList.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-soft p-8 text-center text-muted-foreground">
          No vendors found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendorsList.map((vendor) => (
            <div key={vendor.id} className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{vendor.name}</h3>
                      <Badge variant={vendor.status === "active" ? "default" : "secondary"} className="text-xs">
                        {vendor.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{vendor.productsCount} products</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant={vendor.status === "active" ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleVendorStatus(vendor.id)}
                    className="w-full"
                  >
                    {vendor.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorsPage;