import { Footprints, Flame, Star, TrendingUp, Crown, Brain, MessageCircle, HelpCircle, LucideIcon } from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  flame: Flame,
  star: Star,
  "trending-up": TrendingUp,
  crown: Crown,
  brain: Brain,
  "message-circle": MessageCircle,
};

export function iconFor(key: string): LucideIcon {
  return ICONS[key] ?? HelpCircle;
}
