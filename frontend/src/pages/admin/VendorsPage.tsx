import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const { products } = useProductWorkflow();

  const normalize = (value: string) => value.trim().toLowerCase();

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
        (p) => normalize(p.vendor) === normalize(vendor.name)
      ).length,
    }));
  }, [vendorsList, products]);

  const selectedVendorProducts = useMemo(() => {
    if (!selectedVendor) {
      return [];
    }

    return products.filter((product) => normalize(product.vendor) === normalize(selectedVendor.name));
  }, [products, selectedVendor]);

  const selectedVendorSummary = useMemo(() => {
    const approved = selectedVendorProducts.filter((product) => product.status === "approved").length;
    const pending = selectedVendorProducts.filter((product) => product.status === "pending").length;
    const rejected = selectedVendorProducts.filter((product) => product.status === "rejected").length;

    return { approved, pending, rejected };
  }, [selectedVendorProducts]);

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

                <Button variant="soft" size="sm" className="w-full" onClick={() => setSelectedVendor(vendor)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={selectedVendor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedVendor(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedVendor?.name || "Vendor details"}</DialogTitle>
            <DialogDescription>
              Vendor activity and product catalog details.
            </DialogDescription>
          </DialogHeader>

          {selectedVendor ? (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Vendor ID</p>
                  <p className="font-medium break-all">{selectedVendor.id}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(selectedVendor.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Total products</p>
                  <p className="font-medium">{selectedVendorProducts.length}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{selectedVendor.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Approved</p>
                  <p className="font-semibold">{selectedVendorSummary.approved}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Pending</p>
                  <p className="font-semibold">{selectedVendorSummary.pending}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-muted-foreground">Rejected</p>
                  <p className="font-semibold">{selectedVendorSummary.rejected}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Products</h4>
                {selectedVendorProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products found for this vendor.</p>
                ) : (
                  <div className="max-h-56 overflow-y-auto rounded-xl border">
                    {selectedVendorProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between gap-2 border-b last:border-b-0 p-3 text-sm">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.category} • stock {product.stock}
                          </p>
                        </div>
                        <Badge className="capitalize">{product.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorsPage;