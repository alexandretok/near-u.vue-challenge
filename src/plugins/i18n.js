import locale from '../assets/locales/en.json';

export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return locale[key] || key;
    }
  }
}