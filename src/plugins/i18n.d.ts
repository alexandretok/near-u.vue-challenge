export {};

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string, params?: Object) => string;
  }
}
