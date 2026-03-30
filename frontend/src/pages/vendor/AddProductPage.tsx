import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductWorkflow } from "@/contexts/ProductWorkflowContext";
import { toast } from "sonner";

const AddProductPage = () => {
  const { categories, addProduct, requestCategory } = useProductWorkflow();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = category.trim();
    if (!finalCategory) {
      toast.error("Please enter a category.");
      return;
    }

    addProduct({
      name: name.trim(),
      price: Number(price),
      category: finalCategory,
      image: image.trim() || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
      description: description.trim(),
      stock: Number(stock),
      vendor: "Current Vendor",
    });

    toast.success("Product submitted and sent for admin approval.");
    setName("");
    setPrice("");
    setCategory("");
    setImage("");
    setDescription("");
    setStock("");
  };

  const handleCategoryRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const result = requestCategory(newCategoryName, "Current Vendor");
    if (!result.created) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setNewCategoryName("");
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-soft p-6 space-y-5">
        <div>
          <Label>Product Name</Label>
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ceramic Vase" className="mt-1.5" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Price (₹)</Label>
            <Input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" placeholder="29.99" className="mt-1.5" />
          </div>
          <div>
            <Label>Category</Label>
            <Input required value={category} onChange={(e) => setCategory(e.target.value)} list="vendor-categories" placeholder="e.g. Decor" className="mt-1.5" />
            <datalist id="vendor-categories">
              {categories.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>
        </div>
        <div>
          <Label>Image URL</Label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="mt-1.5" />
        </div>
        <div>
          <Label>Stock</Label>
          <Input required type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" placeholder="e.g. 10" className="mt-1.5" />
        </div>
        <div>
          <Label>Description</Label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe your product..." className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm min-h-[100px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <Button type="submit">Submit Product</Button>
      </form>

      <form onSubmit={handleCategoryRequest} className="bg-card rounded-2xl shadow-soft p-6 mt-6 space-y-4">
        <h3 className="text-base font-semibold">Request New Category</h3>
        <div>
          <Label>Category Name</Label>
          <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required placeholder="e.g. Office Decor" className="mt-1.5" />
        </div>
        <Button type="submit">Submit Category for Approval</Button>
      </form>
    </div>
  );
};

export default AddProductPage;
