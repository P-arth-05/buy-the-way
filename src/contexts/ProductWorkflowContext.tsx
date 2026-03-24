import { createContext, useContext, useMemo, useState } from "react";
import { CATEGORIES, MOCK_PRODUCTS, Product } from "@/data/mockData";

type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ManagedProduct extends Product {
  categoryStatus?: ApprovalStatus;
}

export interface CategoryRequest {
  id: string;
  name: string;
  status: ApprovalStatus;
  vendor: string;
}

interface AddProductInput {
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  vendor: string;
}

interface ProductWorkflowContextType {
  products: ManagedProduct[];
  categories: string[];
  categoryRequests: CategoryRequest[];
  addProduct: (input: AddProductInput) => void;
  requestCategory: (name: string, vendor: string) => { created: boolean; message: string };
  updateProductStatus: (productId: string, status: Exclude<ApprovalStatus, "pending">) => void;
  updateCategoryStatus: (requestId: string, status: Exclude<ApprovalStatus, "pending">) => void;
  updateProductDescription: (productId: string, description: string) => void;
}

const ProductWorkflowContext = createContext<ProductWorkflowContextType | undefined>(undefined);

const normalizeText = (value: string) => value.trim().toLowerCase();

export const ProductWorkflowProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<ManagedProduct[]>(
    MOCK_PRODUCTS.map((product) => ({ ...product, categoryStatus: "approved" }))
  );
  const [categories, setCategories] = useState<string[]>(CATEGORIES.filter((category) => category !== "All"));
  const [categoryRequests, setCategoryRequests] = useState<CategoryRequest[]>([]);

  const requestCategory = (name: string, vendor: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { created: false, message: "Category name is required." };
    }

    const normalizedName = normalizeText(trimmedName);
    const existsInCategories = categories.some((category) => normalizeText(category) === normalizedName);
    const existingRequest = categoryRequests.find((request) => normalizeText(request.name) === normalizedName);

    if (existsInCategories) {
      return { created: false, message: "Category already exists." };
    }

    if (existingRequest) {
      return { created: false, message: `Category request is already ${existingRequest.status}.` };
    }

    const newRequest: CategoryRequest = {
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmedName,
      status: "pending",
      vendor,
    };

    setCategoryRequests((prevRequests) => [newRequest, ...prevRequests]);
    return { created: true, message: "Category sent for admin approval." };
  };

  const addProduct = (input: AddProductInput) => {
    const normalizedCategory = normalizeText(input.category);
    const categoryExists = categories.some((category) => normalizeText(category) === normalizedCategory);

    if (!categoryExists) {
      requestCategory(input.category, input.vendor);
    }

    const newProduct: ManagedProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: input.name,
      price: input.price,
      image: input.image,
      category: input.category.trim(),
      description: input.description,
      stock: input.stock,
      status: "pending",
      vendor: input.vendor,
      rating: 0,
      reviews: 0,
      categoryStatus: categoryExists ? "approved" : "pending",
    };

    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  const updateProductStatus = (productId: string, status: Exclude<ApprovalStatus, "pending">) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === productId ? { ...product, status } : product))
    );
  };

  const updateCategoryStatus = (requestId: string, status: Exclude<ApprovalStatus, "pending">) => {
    let requestName = "";

    setCategoryRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id !== requestId) return request;
        requestName = request.name;
        return { ...request, status };
      })
    );

    if (!requestName) return;

    if (status === "approved") {
      setCategories((prevCategories) => {
        const exists = prevCategories.some((category) => normalizeText(category) === normalizeText(requestName));
        return exists ? prevCategories : [...prevCategories, requestName];
      });
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (normalizeText(product.category) !== normalizeText(requestName)) {
          return product;
        }

        if (status === "rejected") {
          return { ...product, categoryStatus: "rejected", status: "rejected" };
        }

        return { ...product, categoryStatus: "approved" };
      })
    );
  };

  const updateProductDescription = (productId: string, description: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, description } : product
      )
    );
  };

  const value = useMemo(
    () => ({
      products,
      categories,
      categoryRequests,
      addProduct,
      requestCategory,
      updateProductStatus,
      updateCategoryStatus,
      updateProductDescription,
    }),
    [products, categories, categoryRequests]
  );

  return <ProductWorkflowContext.Provider value={value}>{children}</ProductWorkflowContext.Provider>;
};

export const useProductWorkflow = () => {
  const context = useContext(ProductWorkflowContext);
  if (!context) {
    throw new Error("useProductWorkflow must be used within ProductWorkflowProvider");
  }
  return context;
};
