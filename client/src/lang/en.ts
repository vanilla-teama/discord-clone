export default {
  settings: {
    items: {
      account: 'My Account',
      profile: 'Profile',
      appearance: 'Appearance',
      keybinds: 'Keybinds',
      language: 'Language',
      logout: 'Log Out',
    },
    account: {
      heading: 'My Account',
      editUserProfile: 'Edit User Profile',
      deleteAccount: 'Delete Account',
      deleteQuestion: 'Are you sure you want to delete your Account?',
    },
    profile: {
      heading: 'Profile',
      avatar: 'Avatar',
      changeAvatar: 'Change avatar',
      bannerColor: 'Banner color',
      about: 'About me',
      changesWarning: 'Careful - You have unsaved changes!',
    },
    appearance: {
      heading: 'Appearance',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
    },
    keybinds: {
      heading: 'Keybinds',
      editMessage: 'Edit message',
      deleteMessage: 'Delete message',
      reply: 'Reply',
      navigationBetweenServers: 'Navigation between servers',
      navigationBetweenChannels: 'Navigation between channels',
    },
    language: {
      heading: 'Language',
      subheading: 'Select Language',
      english: 'English',
      ukrainian: 'Ukrainian',
      russian: 'Russian',
    },
  },
  startbar: {
    personalMessages: 'Personal messages',
    addServer: 'Add server',
  },
  common: {
    username: 'username',
    email: 'email',
    save: 'save',
    cancel: 'cancel',
    edit: 'edit',
    delete: 'delete',
    apply: 'apply',
    reset: 'reset',
    saveChanges: 'save changes',
    discordMemberSince: 'Discord member since',
  },
} as const;
