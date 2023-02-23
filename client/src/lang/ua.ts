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
    language: {
      heading: 'Мова',
      subheading: 'Оберіть мову',
      english: 'Англійська',
      ukrainian: 'Українська',
      russian: 'Російська',
    },
  },
  common: {
    username: `ім'я користувача`,
    email: 'е-мейл',
    save: 'зберегти',
    cancel: 'відмінити',
    edit: 'редагувати',
    delete: 'видалити',
  },
} as const;
