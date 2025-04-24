
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  label?: string;
}

export function BackButton({ label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Button 
      variant="ghost" 
      className="flex items-center gap-1 mb-2" 
      onClick={handleBack}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
