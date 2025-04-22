
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { UserCircle } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const [username, setUsername] = useState("User");
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleSave = () => {
    // For now, just show a success message. Later this would connect to backend
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile information
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              <UserCircle className="h-20 w-20" />
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" className="w-full max-w-xs">
            Change Avatar
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
