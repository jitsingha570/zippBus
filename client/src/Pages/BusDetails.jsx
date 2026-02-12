import { useParams } from "react-router-dom";

export default function BusDetails() {
  const { slug } = useParams();

  return (
    <div className="pt-20 p-6">
      <h1 className="text-2xl font-bold text-purple-700">
        Bus Details Page
      </h1>
      <p className="mt-4 text-gray-600">
        Bus ID: {slug}
      </p>
    </div>
  );
}
