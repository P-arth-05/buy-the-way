import { useState } from "react";
import { CATEGORIES } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CategoriesPage = () => {
  const [categories, setCategories] = useState(CATEGORIES.filter(cat => cat !== "All"));
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists");
      return;
    }

    setCategories(prev => [...prev, newCategory.trim()]);
    setNewCategory("");
    toast.success("Category added successfully");
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(prev => prev.filter(cat => cat !== categoryToDelete));
    toast.success("Category deleted successfully");
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
            onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
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
              <div key={category} className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                <span className="font-medium">{category}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCategory(category)}
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