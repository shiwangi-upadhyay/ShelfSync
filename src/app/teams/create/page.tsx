"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import CreateTeamPage from "@/components/team/Create";

export default function Page() {
  // const [open, setOpen] = useState(true);

  return (
    <ProtectedRoute>
      <CreateTeamPage/>
    </ProtectedRoute>
  );
}
