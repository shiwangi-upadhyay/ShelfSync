import ProtectedRoute from "@/components/ProtectedRoute";
import TeamEditPage from "@/components/team/TeamEditPage";

export default function Page() {
  // const [open, setOpen] = useState(true);

  return (
    <ProtectedRoute>
      <TeamEditPage/>
    </ProtectedRoute> 
  );
}
