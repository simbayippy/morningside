"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Provider } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

const OauthButton: React.FC<{ provider: Provider }> = ({ provider }) => {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("OAuth error:", error);
      window.location.href = "/login?message=" + encodeURIComponent(error.message);
    }
  };

  return (
    <Button
      variant="outline"
      className="mb-2 w-full font-normal text-muted-foreground"
      onClick={() => handleLogin().catch(console.error)}
    >
      <div className="flex items-center gap-2">
        <FcGoogle />
        <p>Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}</p>
      </div>
    </Button>
  );
};

export default OauthButton;
