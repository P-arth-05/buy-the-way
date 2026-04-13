import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useProductWorkflow } from "@/contexts/ProductWorkflowContext";

const CategoriesPage = () => {
  const { products } = useProductWorkflow(); 

  const [newCategory, setNewCategory] = useState("");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products.map((p) => p.category?.trim()).filter(Boolean)
    );
    return Array.from(uniqueCategories);
  }, [products]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists");
      return;
    }

    toast.success("Category will be added when a product uses it");
    setNewCategory("");
  };

  const handleDeleteCategory = () => {
    toast.error("Cannot delete category. Remove related products instead.");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Manage Categories</h2>

      {/* Add Category Section */}
      <div className="bg-card rounded-2xl shadow-soft p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
        <div className="flex gap-3">
          <Input
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            className="flex-1"
          />
          <Button onClick={handleAddCategory} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h3 className="text-lg font-semibold mb-4">Existing Categories</h3>

        {categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No categories found.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category}
                className="bg-muted/50 rounded-xl p-4 flex items-center justify-between"
              >
                <span className="font-medium">{category}</span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteCategory}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;