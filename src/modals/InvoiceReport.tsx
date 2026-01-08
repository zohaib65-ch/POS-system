import { Invoice } from "@/types/Invoice";

interface InvoiceReportProps {
  invoice: Invoice;
}

export default function InvoiceReport({ invoice }: InvoiceReportProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8 text-gray-800">
      <div className="text-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold">Invoice Report</h1>
        <p className="text-gray-600">Invoice #{invoice.invoiceId}</p>
      </div>
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Customer:</p>
          <p className="font-semibold">{invoice.customer}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Date:</p>
          <p className="font-semibold">{formatDate(invoice.date)}</p>
        </div>
      </div>
      <table className="w-full border-collapse mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 text-left">Item</th>
            <th className="border px-3 py-2 text-right">Qty</th>
            <th className="border px-3 py-2 text-right">Price</th>
            <th className="border px-3 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i}>
              <td className="border px-3 py-2">{item.name}</td>
              <td className="border px-3 py-2 text-right">{item.quantity}</td>
              <td className="border px-3 py-2 text-right">৳ {item.price.toLocaleString()}</td>
              <td className="border px-3 py-2 text-right">৳ {(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right space-y-1 border-t pt-4 text-sm">
        <p className="text-lg font-bold">Total: ৳ {invoice.total.toLocaleString()}</p>
      </div>
      <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
        <p>Promise Electronics</p>
      </div>
    </div>
  );
}
