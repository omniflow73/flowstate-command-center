import React from "react";
import { BackButton } from "@/components/ui/back-button";

export default function FocusModePage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <BackButton />
      <h1>Focus Mode</h1>
      <p>Stay focused and block out distractions.</p>
    </div>
  );
}
