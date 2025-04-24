
import { Card, CardContent } from "@/components/ui/card";
import { useUserProfile } from "@/context/UserProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GreetingCard() {
  const { profile } = useUserProfile();

  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={profile.avatarUrl} alt={profile.username} />
              <AvatarFallback>{profile.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl sm:text-3xl font-bold">{getCurrentTimeOfDay()}, {profile.username}</h2>
          </div>
          <p className="text-muted-foreground">
            Ready to achieve your goals today? Your AI assistant is here to help.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
