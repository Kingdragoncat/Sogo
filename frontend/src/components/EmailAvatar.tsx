"use client";

import { useEffect, useState } from "react";
import { getAvatar, getAvatarSync, type AvatarResult } from "@/lib/avatars";
import { Shield } from "lucide-react";

interface EmailAvatarProps {
  email: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base",
};

export function EmailAvatar({ email, name, size = "md", className = "" }: EmailAvatarProps) {
  const [avatar, setAvatar] = useState<AvatarResult>(() => getAvatarSync(email, name));
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Try to get BIMI logo asynchronously
    getAvatar(email, name).then(setAvatar);
  }, [email, name]);

  const sizeClass = sizeClasses[size];

  // If image failed to load or we have initials, show initials
  if (imageError || avatar.type === 'initials' || (!avatar.url && avatar.initials)) {
    return (
      <div className={`${sizeClass} ${className} rounded-full gold-gradient flex items-center justify-center shrink-0 relative`}>
        <span className="text-white font-semibold">
          {avatar.initials}
        </span>
        {avatar.verified && (
          <Shield className="absolute -bottom-1 -right-1 h-4 w-4 text-mythofy-gold bg-background-dark rounded-full p-0.5" />
        )}
      </div>
    );
  }

  // Show image (Gravatar or BIMI)
  return (
    <div className={`${sizeClass} ${className} rounded-full shrink-0 relative overflow-hidden`}>
      <img
        src={avatar.url}
        alt={name || email}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
      {avatar.verified && (
        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-mythofy-gold rounded-full flex items-center justify-center">
          <Shield className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  );
}
