
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { ArrowLeft, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/context/UserProfileContext";

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserProfile();
  const [username, setUsername] = useState(profile.username);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatarUrl = e.target?.result as string;
        setAvatarUrl(newAvatarUrl);
        updateProfile({ username, avatarUrl: newAvatarUrl });
        toast.success("Avatar updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }
    updateProfile({ username, avatarUrl });
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button 
            variant="outline" 
            className="w-full max-w-xs"
            onClick={() => fileInputRef.current?.click()}
          >
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
