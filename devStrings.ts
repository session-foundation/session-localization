/**
 * Dev-only strings — English only, not yet official.
 *
 * These tokens use a "Dev" suffix so they never collide with
 * the Crowdin-generated tokens.  They are resolved by localeTools
 * before the normal lookup chain, and always return the English value
 * regardless of the active locale.
 *
 * Once a string is promoted to the official translation pipeline,
 * remove it from here and add it via the shared-scripts generator.
 */
export const devSimpleNoArgs = {
  serverUnbanUserDev: 'Unban User from Server',
  globalUserUnbanFailedDev: 'Unban failed! Are you a global admin/mod?',
  serverBanUserDev: 'Ban User from Server',
  serverBanUserAndDeleteAllDev: 'Ban from Server and Delete All',
  addUploadPermissionDev: 'Allow sending attachments',
  clearUploadPermissionDev: 'Remove attachment exception',
  userPermissionsChangedDev: 'Changed user permissions successfully',
  failedToChangeUserPermissionsDev: 'Failed to change user permissions',
  globalUserBanFailedDev: 'Ban failed! Are you a global admin/mod?',
  communityChangePermissionsDev: 'Edit Permissions',
  communityPermissionAccessDescriptionDev: 'Anyone can see the room (+a)',
  communityPermissionAccessEnableDev: 'Enable room visibility',
  communityPermissionReadDescriptionDev: 'Anyone can read messages (+r)',
  communityPermissionReadEnableDev: 'Enable reading',
  communityPermissionUploadDescriptionDev: 'Anyone can upload files (+u)',
  communityPermissionUploadEnableDev: 'Enable uploads',
  communityPermissionWriteDescriptionDev: 'Anyone can send messages (+w)',
  communityPermissionWriteEnableDev: 'Enable writing',
  communityChangePermissionsDescriptionDev:
    "For compatibility reasons, we don't know which permissions were enabled to begin with, but you can set new values below regardless.",
  conversationIdDev: 'Conversation ID:',
  messageHashDev: 'Message Hash:',
  serverIdDev: 'Server ID:',
  timestampDev: 'Timestamp:',
  serverTimestampDev: 'Server Timestamp:',
  expirationTypeDev: 'Expiration Type:',
  expirationDurationDev: 'Expiration Duration:',
  disappearsDev: 'Disappears:',
  charactersDev: 'Characters:',
} as const;

export type TokenDevNoArgs = keyof typeof devSimpleNoArgs;
