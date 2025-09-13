import TransactionForm from "../components/TransactionForm";
import { useNavigate } from "react-router-dom";


export default function AddTransactionPage() {

   const navigate = useNavigate();

  const handleAdd = () => {
    // ✅ redirect to dashboard after successful add
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Add New Transaction</h1>
      <TransactionForm  onAdd={handleAdd}/>
    </div>
  );
}
