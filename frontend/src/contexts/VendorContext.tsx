import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export interface VendorInfo {
  userId: string;
  name: string;
  email: string;
}

interface VendorContextType {
  vendor: VendorInfo | null;
  loading: boolean;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendor = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setVendor(null);
          navigate("/login");
          return;
        }

        let vendorName = user.user_metadata?.name as string | undefined || "";

        const { data: profile } = await supabase
          .from("profiles")
          .select("name, role")
          .eq("id", user.id)
          .single();

        if (profile) {
          vendorName = profile.name || vendorName;
        }

        setVendor({
          userId: user.id,
          name: vendorName || "Unknown Vendor",
          email: user.email || "",
        });
      } catch (error) {
        console.error("Failed to load vendor info", error);
        setVendor(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    void loadVendor();
  }, [navigate]);

  return (
    <VendorContext.Provider value={{ vendor, loading }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendor must be used within VendorProvider");
  }
  return context;
};
