import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';

class SettingsKeybindingsView extends View {
  static readonly classNames = {
    titleKeybind: 'title-key-bibnd',
    contKeybind: 'container-key-bibnd',
    listKey: 'list-key-bind',
    listItem: 'list-item-key',
    titleKey: 'title-key',
    buttonKey: 'button-key',
    conButtons: 'conttainer-button-key',
  };

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsKeybindingsView.throwNoRootInTheDomError('Settings-Keybindings');
    }
    super($root);
  }
  build(): void {
    const $contKeybind = $('div', SettingsKeybindingsView.classNames.contKeybind);
    const $titleKeybind = Object.assign($('div', SettingsKeybindingsView.classNames.titleKeybind), {
      textContent: 'Горячие клавиши',
    });
    const $listKey = $('ul', SettingsKeybindingsView.classNames.listKey);
    const $editMess = $('li', SettingsKeybindingsView.classNames.listItem);
    const $titleEditMess = Object.assign($('div', SettingsKeybindingsView.classNames.titleKey), {
      textContent: 'Редактировать',
    });
    const $buttonEditMess = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: 'Е',
    });
    $editMess.append($titleEditMess, $buttonEditMess);
    const $deleteMess = $('li', SettingsKeybindingsView.classNames.listItem);
    const $titledeleteMess = Object.assign($('div', SettingsKeybindingsView.classNames.titleKey), {
      textContent: 'Удалить сообщение',
    });
    const $buttondeleteMess = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: 'BACKSPACE',
    });
    $deleteMess.append($titledeleteMess, $buttondeleteMess);
    const $reply = $('li', SettingsKeybindingsView.classNames.listItem);
    const $titleReply = Object.assign($('div', SettingsKeybindingsView.classNames.titleKey), {
      textContent: 'Ответить',
    });
    const $buttonReply = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: 'R',
    });
    $reply.append($titleReply, $buttonReply);
    const $navChats = $('li', SettingsKeybindingsView.classNames.listItem);
    const $titleNavChats = Object.assign($('div', SettingsKeybindingsView.classNames.titleKey), {
      textContent: 'Перемещение между каналами',
    });
    const $conButtonsChats = $('div');
    const $conButtonsChatsOne = $('div', SettingsKeybindingsView.classNames.conButtons);
    const $conButtonsChatsTwo = $('div', SettingsKeybindingsView.classNames.conButtons);
    const $buttonNavChats = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: 'ALT',
    });
    const $buttonNavChatsTwo = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: '\u2191',
    });
    const $buttonNavChatsThree = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: 'ALT',
    });
    const $buttonNavChatsFour = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: '\u2193',
    });
    $conButtonsChatsOne.append($buttonNavChats, $buttonNavChatsTwo);
    $conButtonsChatsTwo.append($buttonNavChatsThree, $buttonNavChatsFour);
    $conButtonsChats.append($conButtonsChatsOne, $conButtonsChatsTwo);
    $navChats.append($titleNavChats, $conButtonsChats);
    const $navServer = $('li', SettingsKeybindingsView.classNames.listItem);
    const $titleNavServer = Object.assign($('div', SettingsKeybindingsView.classNames.titleKey), {
      textContent: 'Перемещение между серверами',
    });
    const $conButtonsServer = $('div');
    const $conButtonsServerOne = $('div', SettingsKeybindingsView.classNames.conButtons);
    const $conButtonsServerTwo = $('div', SettingsKeybindingsView.classNames.conButtons);
    const $buttonNavServer = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: 'ALT',
    });
    const $buttonNavServerTwo = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: '\u2191',
    });
    const $buttonNavServerThree = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: 'ALT',
    });
    const $buttonNavServerFour = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: '\u2193',
    });
    const $buttonNavServerCtrlOne = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: 'CTRL',
    });
    const $buttonNavServerCtrlTwo = Object.assign($('button', SettingsKeybindingsView.classNames.buttonKey), {
      textContent: 'CTRL',
    });
    $conButtonsServerOne.append($buttonNavServerCtrlOne, $buttonNavServer, $buttonNavServerTwo);
    $conButtonsServerTwo.append($buttonNavServerCtrlTwo, $buttonNavServerThree, $buttonNavServerFour);
    $conButtonsServer.append($conButtonsServerOne, $conButtonsServerTwo);
    $navServer.append($titleNavServer, $conButtonsServer);
    $listKey.append($editMess, $deleteMess, $reply, $navChats, $navServer);
    $contKeybind.append($titleKeybind, $listKey);
    this.$container.append($contKeybind);
  }
}

export default SettingsKeybindingsView;
