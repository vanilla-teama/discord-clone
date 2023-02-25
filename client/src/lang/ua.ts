export default {
  settings: {
    items: {
      account: 'Мій Акаунт',
      profile: 'Профіль',
      appearance: 'Зовнішній вигляд',
      keybinds: 'Гарячі клавіші',
      language: 'Мова',
      logout: 'Вийти',
    },
    account: {
      heading: 'Мій Акаунт',
      editUserProfile: 'Редагувати профіль користувача',
      deleteAccount: 'Видалити акаунт',
      deleteQuestion: 'Ви впевнені, що хочете видалити ваш акаунт?',
    },
    profile: {
      heading: 'Профіль',
      avatar: 'Аватар',
      changeAvatar: 'Змінити аватар',
      bannerColor: 'Колір банера',
      about: 'Про мене',
      changesWarning: 'Обережно - є незбережені зміни!',
    },
    appearance: {
      heading: 'Зовнішній вигляд',
      theme: 'Тема',
      dark: 'Темна',
      light: 'Світла',
    },
    keybinds: {
      heading: 'Гарячі клавіші',
      editMessage: 'Редагувати повідомлення',
      deleteMessage: 'Видалити повідомлення',
      reply: 'Відповісти',
      navigationBetweenServers: 'Переміщення між серверами',
      navigationBetweenChannels: 'Переміщенная між каналами',
    },
    language: {
      heading: 'Мова',
      subheading: 'Оберіть мову',
      english: 'Англійська',
      ukrainian: 'Українська',
      russian: 'Російська',
    },
  },
  startbar: {
    personalMessages: 'Персональні повідомлення',
    addServer: 'Додати сервер',
  },
  serverForm: {
    heading: 'Додайте сервер',
    description: 'Персоналізуйте ваш сервер, надавши йому назву та іконку.',
    serverName: `Ім'я сервера`,
  },
  sidebar: {
    friends: 'Друзі',
    selectFriends: 'Виберіть друзів',
    noFriendsMessageOne: 'Ваша самотність вражає.',
    noFriendsMessageTwo: 'Але ви можете піти та знайти друзів',
    personalMessages: 'Персональні повідомлення',
    createDM: 'Створіть персональне повідомлення',
    userSettings: 'Налаштування користувача',
    createChannel: 'Створіть канал',
    createInvite: 'Створіть запрошення',
    channelName: `Ім'я канала`,
    inviteFormHeading: 'Запрошуйте ваших друзів до',
    noFriendsToAdd: 'Усі ваші друзі вже тут!',
  },
  deleteMessageDialog: {
    heading: 'Видалити повідомлення.',
    question: 'Ви впевнені, що хочете видалити його?',
  },
  friends: {
    friends: 'Друзі',
    addFriend: 'Додати друзів',
    searchPlaceholder: 'Шукати по імені або емейл',
  },
  auth: {
    welcome: 'З поверненням!',
    email: 'Е-мейл',
    username: `Ім'я користувача`,
    password: 'Пароль',
    logIn: 'Увійти',
    needAccount: 'Потрібен аккаунт?',
    register: 'Зареєструватися',
    createAccount: 'Створити аккаунт',
    alreadyHaveAccount: 'Маєте аккаунт?',
  },
  common: {
    username: `ім'я користувача`,
    email: 'е-мейл',
    save: 'зберегти',
    cancel: 'відмінити',
    edit: 'редагувати',
    reply: 'відповісти',
    delete: 'видалити',
    apply: 'прийняти',
    accept: 'прийняти',
    reset: 'скинути',
    create: 'створити',
    saveChanges: 'зберегти зміни',
    discordMemberSince: 'У числі учасників Discord з',
    here: 'тут',
    general: 'основний',
    userIsLoading: 'користувач завантажується',
    invite: 'запросити',
    invited: 'запрошено',
    requested: 'запит',
    send: 'надіслати',
    sending: 'надсилається',
    sent: 'надіслано',
    showUserProfile: 'Показати профіль користувача',
    hideUserProfile: 'Сховати профіль користувача',
    showMemberList: 'Показати список учасників',
    hideMemberList: 'Сховати список учасників',
    help: 'Довідка',
    noChat: 'Чат не вибрано',
    noChannel: 'Канал не вибрано',
    noMutualServers: 'Немає спільних серверів',
    xMutualServer: 'Спільний Сервер',
    xMutualServers: 'Спільних Серверів',
    serverOwner: 'Власник сервера',
    messageTo: 'Написати у',
    enterTo: 'enter, щоб',
    escapeTo: 'escape, щоб',
    replyingTo: 'Відповідає на',
  },
  availability: {
    online: 'в мережі',
    offline: 'не в мережі',
    away: 'відійшов',
    doNotDisturb: 'не турбувати',
  },
} as const;
