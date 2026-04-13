import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Package } from "lucide-react";
import { getAllProfiles, ProfileDTO } from "@/lib/profileApi";
import { useProductWorkflow } from "@/contexts/ProductWorkflowContext";

interface Vendor {
  id: string;
  name: string;
  productsCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

const VendorsPage = () => {
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
  const { products } = useProductWorkflow();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await getAllProfiles();

        const vendorProfiles = response.data.filter(
          (profile: ProfileDTO) => profile.role === "vendor"
        );

        const mappedVendors: Vendor[] = vendorProfiles.map((profile) => ({
          id: profile.id,
          name: profile.name,
          productsCount: 0,
          status: "active", 
          createdAt: profile.created_at,
        }));

        setVendorsList(mappedVendors);
      } catch (error) {
        console.error("Failed to fetch vendors", error);
      }
    };

    fetchVendors();
  }, []);

  const vendorsWithCounts = useMemo(() => {
    return vendorsList.map((vendor) => ({
      ...vendor,
      productsCount: products.filter(
        (p) => p.vendor === vendor.name
      ).length,
    }));
  }, [vendorsList, products]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Vendors</h2>

      {vendorsWithCounts.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-soft p-8 text-center text-muted-foreground">
          No vendors found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendorsWithCounts.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-card rounded-2xl shadow-soft overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{vendor.name}</h3>
                    <Badge className="text-xs">active</Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>{vendor.productsCount} products</span>
                  </div>

                  <div>
                    Joined:{" "}
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorsPage;