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
  serverForm: {
    heading: 'Create your server',
    description: 'Give your new server a personality with a name and an icon. You can always change it later.',
    serverName: 'Server name',
  },
  sidebar: {
    friends: 'Friends',
    selectFriends: 'Select friends',
    noFriendsMessageOne: 'Your loneliness impresses.',
    noFriendsMessageTwo: 'But you can go and find folks',
    personalMessages: 'Personal messages',
    createDM: 'Create DM',
    userSettings: 'User settings',
    createChannel: 'Create channel',
    createInvite: 'Create invite',
    channelName: 'Channel name',
    inviteFormHeading: 'Invite friends to',
    noFriendsToAdd: 'All your friends already here!',
  },
  deleteMessageDialog: {
    heading: 'Delete message.',
    question: 'Are you sure you want to delete this?',
  },
  friends: {
    friends: 'Friends',
    addFriend: 'Add Friends',
    searchPlaceholder: 'Search by name or email',
  },
  common: {
    username: 'username',
    email: 'email',
    save: 'save',
    cancel: 'cancel',
    edit: 'edit',
    delete: 'delete',
    reply: 'reply',
    apply: 'apply',
    accept: 'accept',
    reset: 'reset',
    create: 'create',
    saveChanges: 'save changes',
    discordMemberSince: 'Discord member since',
    here: 'here',
    general: 'general',
    userIsLoading: 'user is loading',
    invite: 'invite',
    invited: 'invited',
    requested: 'requested',
    send: 'send',
    sending: 'sending',
    sent: 'sent',
    showUserProfile: 'Show user profile',
    hideUserProfile: 'Hide user profile',
    showMemberList: 'Show member list',
    hideMemberList: 'Hide member list',
    help: 'Help',
    noChat: 'No chat selected',
    noChannel: 'No channel selected',
    noMutualServers: 'No mutual servers',
    xMutualServer: 'Mutual Server',
    xMutualServers: 'Mutual Servers',
    serverOwner: 'Server owner',
    messageTo: 'Message',
    enterTo: 'enter to',
    escapeTo: 'escape to',
    replyingTo: 'Replying to',
  },
  availability: {
    online: 'online',
    offline: 'offline',
    away: 'away',
    doNotDisturb: 'do not disturb',
  },
} as const;
