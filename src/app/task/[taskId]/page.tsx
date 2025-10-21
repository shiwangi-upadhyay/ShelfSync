import ProtectedRoute from "@/components/ProtectedRoute";
import TaskDetailPage from "@/components/task/TaskPage";

export default function Page() {
  // const [open, setOpen] = useState(true);

  return (
    <ProtectedRoute>
      <TaskDetailPage/>
    </ProtectedRoute>
  );
}
