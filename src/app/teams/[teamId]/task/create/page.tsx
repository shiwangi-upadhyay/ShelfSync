import ProtectedRoute from "@/components/ProtectedRoute";
import CreateTaskPage from "@/components/task/CreateTaskPage";

export default function Page() {
  // const [open, setOpen] = useState(true);

  return (
    <ProtectedRoute>
      <CreateTaskPage/>
    </ProtectedRoute>
  );
}
