export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "diagnosis":
      return "bg-purple-100 text-purple-800";
    case "parts-ordered":
      return "bg-orange-100 text-orange-800";
    case "repairing":
      return "bg-indigo-100 text-indigo-800";
    case "testing":
      return "bg-cyan-100 text-cyan-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
