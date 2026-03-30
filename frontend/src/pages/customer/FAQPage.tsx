import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept multiple payment methods including Credit/Debit Cards, UPI, Net Banking, Digital Wallets, and Cash on Delivery (COD).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How can I track my order?</AccordionTrigger>
          <AccordionContent>
            Once your order is placed, you will receive an Order ID. You can enter this ID on our "Track Order" page to see real-time updates on your delivery status (Processing, Shipped, Out for Delivery, Delivered).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How do I return an item?</AccordionTrigger>
          <AccordionContent>
            If you are not satisfied with your purchase, you can initiate a return request from the "Track Order" page within 14 days of delivery. Once approved, we will arrange for reverse logistics to pick up the item.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Are all your vendors verified?</AccordionTrigger>
          <AccordionContent>
            Yes! Every vendor on the ESOMS platform goes through a strict administrative approval process before they are allowed to list products, ensuring high quality and authenticity.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}