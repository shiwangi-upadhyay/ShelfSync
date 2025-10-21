import ProtectedRoute from "@/components/ProtectedRoute";
import TeamDetailPage from "@/components/team/TeamPage";

export default function Page() {
  // const [open, setOpen] = useState(true);

  return (
    <ProtectedRoute>
      <TeamDetailPage/>
    </ProtectedRoute>
  );
}
