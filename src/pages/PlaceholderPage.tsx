
import React from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PlaceholderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.replace('/', '') || 'unknown';

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8 min-h-screen">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="space-y-2 text-center py-12">
        <h1 className="text-3xl font-bold">{pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page</h1>
        <p className="text-muted-foreground">
          This page is a placeholder for the {pageName} feature, which would be fully implemented in a production app.
        </p>
      </div>
    </div>
  );
}
