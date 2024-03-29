import { DomListener } from "@core/DomListener";

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || "";
    this.emitter = options.emitter;
    this.subscribe = options.subscribe || [];
    this.store = options.store;
    this.unsubscribers = [];
    // this.storeSub = null;

    this.prepare();
  }
  // настраиваем компонент до init
  prepare() {}
  //возвращает шаблон компонента
  toHTML() {
    return "";
  }
  //уведомляем слушателей про событие event
  $emit(event, ...agrs) {
    this.emitter.emit(event, ...agrs);
  }
  // подписываемся на событие event
  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn);
    this.unsubscribers.push(unsub);
  }

  $dispatch(action) {
    this.store.dispatch(action);
  }

  // $subscribe(fn) {
  //   this.storeSub = this.store.subscribe(fn);
  // }

  storeChanged() {}

  isWatching(key) {
    return this.subscribe.includes(key);
  }

  // инициализируем компонента
  // добавляем DOM слушателей
  init() {
    this.initDOMListeners();
  }
  // удаляем компонет
  //чистим слушателей
  destroy() {
    this.removeDOMListeners();
    this.unsubscribers.forEach((unsub) => unsub());
    // this.storeSub.unsubscribe();
  }
}
