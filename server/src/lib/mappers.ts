import { User } from "@prisma/client";
import { UserDTO } from "@ai-explorers/shared";

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    language: user.language,
    ageGroup: user.ageGroup,
    totalXp: user.totalXp,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    createdAt: user.createdAt.toISOString(),
  };
}
