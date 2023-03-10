export default {
  settings: {
    items: {
      account: 'Мой Акаунт',
      profile: 'Профиль',
      appearance: 'Внешний вид',
      keybinds: 'Горячие клавиши',
      language: 'Язык',
      logout: 'Выйти',
    },
    account: {
      heading: 'Мой Акаунт',
      editUserProfile: 'Редактировать профиль пользователя',
      deleteAccount: 'Удалить акаунт',
      deleteQuestion: 'Вы уверены, что хотите удалить ваш акаунт?',
    },
    profile: {
      heading: 'Профиль',
      avatar: 'Аватар',
      changeAvatar: 'Изменить аватар',
      bannerColor: 'Цвет баннера',
      about: 'Обо мне',
      changesWarning: 'Осторожно - есть несохраненные изменения!',
      uploadImage: 'Загрузите изображение',
    },
    appearance: {
      heading: 'Внешний вид',
      theme: 'Тема',
      dark: 'Темная',
      light: 'Светлая',
    },
    keybinds: {
      heading: 'Горячие клавиши',
      closePopup: 'Закрыть попап',
      editMessage: 'Редактировать сообщение',
      deleteMessage: 'Удалить сообщение',
      reply: 'Ответить',
      navigationBetweenServers: 'Перемещение между серверами',
      navigationBetweenChannels: 'Перемещение между каналами',
    },
    language: {
      heading: 'Язык',
      subheading: 'Выберите язык',
      english: 'Английский',
      ukrainian: 'Украинский',
      russian: 'Русский',
    },
  },
  startbar: {
    personalMessages: 'Личные сообщения',
    addServer: 'Добавить сервер',
  },
  serverForm: {
    heading: 'Создайте сервер',
    description: 'Персонализируйте свой новый сервер, выбрав ему название и значок.',
    serverName: `Имя сервера`,
  },
  sidebar: {
    friends: 'Друзья',
    selectFriends: 'Выберите друзей',
    noFriendsMessageOne: 'Ваше одиночество поражает.',
    noFriendsMessageTwo: 'Но вы можете пойти и найти друзей',
    personalMessages: 'Личные сообщения',
    createDM: 'Создайте ЛС',
    userSettings: 'Настройки пользователя',
    createChannel: 'Создайте канал',
    createInvite: 'Создайте приглашение',
    channelName: 'Имя канала',
    inviteFormHeading: 'Пригласите друзей на',
    noFriendsToAdd: 'Все ваши друзья уже тут!',
  },
  deleteMessageDialog: {
    heading: 'Удалить сообщение.',
    question: 'Вы уверены, что хотите удалить его?',
  },
  friends: {
    friends: 'Друзья',
    addFriend: 'Добавить друзей',
    searchPlaceholder: 'Искать по имени или емейл',
    notFound: 'Пользователей не найдено',
    noFriends: 'Нет друзей',
  },
  auth: {
    welcome: 'С возвращением!',
    email: 'Е-мейл',
    username: `Имя пользователя`,
    password: 'Пароль',
    logIn: 'Войти',
    needAccount: 'Нужен аккаунт?',
    register: 'Зарегистрироваться',
    createAccount: 'Создать аккаунт',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    emailNotFound: 'Е-мейл не найден',
    invalidEmailOrPassword: 'Неверный емейл или пароль',
    accountAlreadyExists: 'Аккаунт с таким емейл уже существует',
    passwordLengthError: 'Пароль должен состоять из как минимум 4-х символов',
  },
  common: {
    username: 'имя пользователя',
    email: 'е-мейл',
    save: 'сохранить',
    cancel: 'отменить',
    edit: 'редактировать',
    reply: 'ответить',
    delete: 'удалить',
    apply: 'принять',
    accept: 'принять',
    reset: 'сбросить',
    create: 'создать',
    saveChanges: 'сохранить изменения',
    discordMemberSince: 'В числе участников Discord с',
    here: 'здесь',
    general: 'основной',
    userIsLoading: 'пользователь загружается',
    invite: 'пригласить',
    invited: 'приглашен',
    requested: 'запрос',
    send: 'отправить',
    sending: 'отправляется',
    sent: 'отправлено',
    showUserProfile: 'Показать профиль пользователя',
    hideUserProfile: 'Скрыть профиль пользователя',
    showMemberList: 'Показать список участников',
    hideMemberList: 'Скрыть список участников',
    help: 'Справка',
    noChat: 'Чат не выбран',
    noChannel: 'Канал не выбран',
    noMutualServers: 'Нет общих серверов',
    xMutualServer: 'Общий Сервер',
    xMutualServers: 'Общих Серверов',
    serverOwner: 'Владелец сервера',
    messageTo: 'Написать в',
    enterTo: 'enter, чтобы',
    escapeTo: 'escape, чтобы',
    replyingTo: 'Отвечает на',
  },
  availability: {
    online: 'в сети',
    offline: 'не в сети',
    away: 'отошел',
    doNotDisturb: 'не беспокоить',
  },
} as const;
