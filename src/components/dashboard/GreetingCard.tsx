
import { Card, CardContent } from "@/components/ui/card";
import QuickAdd from "./QuickAdd";
import { useUserProfile } from "@/context/UserProfileContext";

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
          <h2 className="text-2xl sm:text-3xl font-bold">{getCurrentTimeOfDay()}, {profile.username}</h2>
          <p className="text-muted-foreground">
            Ready to achieve your goals today? Your AI assistant is here to help.
          </p>
        </div>
        <QuickAdd />
      </CardContent>
    </Card>
  );
}
