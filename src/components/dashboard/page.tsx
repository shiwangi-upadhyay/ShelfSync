import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckSquare } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Shelfexecution</h1>
        <p className="text-gray-500">Manage your teams, collaborate on tasks, and stay connected.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <CardTitle className="text-lg">Teams</CardTitle>
            <CardDescription>Collaborate with your team members</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full cursor-pointer">View Teams</Button>
          </CardContent>
        </Card>

        {/* <Card className="border border-gray-200 shadow-sm hover:shadow-md transition">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5 text-violet-600" />
            </div>
            <CardTitle className="text-lg">Messages</CardTitle>
            <CardDescription>Stay connected with direct messages</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">Open Messages</Button>
          </CardContent>
        </Card> */}

        <Card className=" flex justify-between  border border-gray-200 shadow-sm hover:shadow-md transition ">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
              <CheckSquare className="w-5 h-5 text-violet-600" />
            </div>
            <CardTitle className="text-lg">Tasks</CardTitle>
            <CardDescription>Track and manage your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full cursor-pointer">View Tasks</Button>
          </CardContent>
        </Card>

        {/* <Card className="border border-gray-200 shadow-sm hover:shadow-md transition">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <CardTitle className="text-lg">Analytics</CardTitle>
            <CardDescription>Monitor team performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">View Stats</Button>
          </CardContent>
        </Card> */}
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Follow these steps to set up your workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-100">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Create Your First Team</h3>
              <p className="text-sm text-gray-500">Start by creating a team and inviting members to collaborate.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-100">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Set Up Your Profile</h3>
              <p className="text-sm text-gray-500">Customize your profile with a photo and information.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-100">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Start Collaborating</h3>
              <p className="text-sm text-gray-500">Create tasks, send messages, and work together with your team.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;