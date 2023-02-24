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
    },
    appearance: {
      heading: 'Внешний вид',
      theme: 'Тема',
      dark: 'Темная',
      light: 'Светлая',
    },
    keybinds: {
      heading: 'Горячие клавиши',
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
  common: {
    username: 'имя пользователя',
    email: 'е-мейл',
    save: 'сохранить',
    cancel: 'отменить',
    edit: 'редактировать',
    delete: 'удалить',
    apply: 'принять',
    reset: 'сбросить',
    saveChanges: 'сохранить изменения',
    discordMemberSince: 'В числе участников Discord с',
  },
} as const;
