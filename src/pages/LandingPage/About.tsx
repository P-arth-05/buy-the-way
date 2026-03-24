import { Building2, ShoppingBag, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Buy the Way</h1>
        <p className="text-lg text-muted-foreground">
          Transforming our trusted physical retail presence into a modern, seamless online marketplace.
        </p>
      </div>

      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-6 text-primary">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl mb-3">Verified Vendors</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">We strictly manage and approve every vendor on our platform to ensure only the highest quality products reach you.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-6 text-primary">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl mb-3">Secure Platform</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Your safety is our priority. With secure authentication and trusted payment gateways, you can shop with total peace of mind.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-6 text-primary">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl mb-3">Unified Experience</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">From browsing our extensive catalog to cart management and final delivery tracking, we provide a seamless end-to-end shopping journey.</p>
          </div>
        </div>
      </div>
    </div>
  );
}