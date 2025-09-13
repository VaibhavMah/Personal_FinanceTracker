import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function EditTransaction() {
  const { id } = useParams();

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Edit Transaction</h2>
        <p className="text-gray-600">Editing transaction with ID: {id}</p>
      </div>
    </div>
  );
}
