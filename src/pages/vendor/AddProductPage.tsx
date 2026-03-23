import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AddProductPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Product submitted for approval!");
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-soft p-6 space-y-5">
        <div><Label>Product Name</Label><Input required placeholder="e.g. Ceramic Vase" className="mt-1.5" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Price ($)</Label><Input required type="number" step="0.01" placeholder="29.99" className="mt-1.5" /></div>
          <div><Label>Category</Label><Input required placeholder="e.g. Decor" className="mt-1.5" /></div>
        </div>
        <div>
          <Label>Image URL</Label>
          <Input placeholder="https://..." className="mt-1.5" />
        </div>
        <div>
          <Label>Description</Label>
          <textarea required placeholder="Describe your product..." className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm min-h-[100px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <Button type="submit">Submit Product</Button>
      </form>
    </div>
  );
};

export default AddProductPage;
