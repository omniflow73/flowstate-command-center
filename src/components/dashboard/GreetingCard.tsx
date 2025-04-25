
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
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border-2 border-primary/20">
        <AvatarImage src={profile.avatarUrl} alt={profile.username} />
        <AvatarFallback>{profile.username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">{getCurrentTimeOfDay()}, {profile.username}</h2>
        <p className="text-sm text-muted-foreground">Ready to achieve your goals today?</p>
      </div>
    </div>
  );
}
