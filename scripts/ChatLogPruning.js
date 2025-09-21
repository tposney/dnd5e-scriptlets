export class ChatLogPruning extends foundry.applications.sidebar.tabs.ChatLog {

  async pruneElement() {
    const scroll = this.element.querySelector(".chat-scroll .chat-log");
    const count = scroll?.children.length ?? 0;
    const maxSize = CONFIG.ChatMessage.batchSize ?? 15;
    if (count > maxSize) {
      for (let index = 0; index < count - maxSize; index++) {
        const messageId = scroll.firstElementChild.dataset.messageId;
        const message = game.messages?.get(messageId);
        if (message) message.logged = false;
        removeElementAndListeners(scroll.firstElementChild)
      }
    }
  }

  async scrollBottom({ popout = false, waitImages = false, scrollOptions = {} } = {}) {
    this.pruneElement();
    this.popout && this.popout.pruneElement();
    return super.scrollBottom({ popout, waitImages, scrollOptions });
  }
}


const origAdd = EventTarget.prototype.addEventListener;
const origRemove = EventTarget.prototype.removeEventListener;

EventTarget.prototype.addEventListener = function (type, fn, opts) {
  if (this) {
    if (!this._listeners) this._listeners = [];
    this._listeners.push({ type, fn, opts });
  }
  return origAdd.call(this, type, fn, opts);
};

EventTarget.prototype.removeEventListener = function (type, fn, opts) {
  if (this) {
    if (this._listeners) {
      this._listeners = this._listeners.filter(
        l => l.type !== type || l.fn !== fn || l.opts !== opts
      );
    }
  }
  return origRemove.call(this, type, fn, opts);
};

function removeElementAndListeners(el) {
  if (!el) return;
  if (el._listeners) {
    for (const { type, fn, opts } of el._listeners) {
      el.removeEventListener(type, fn, opts);
    }
    el._listeners = [];
  }
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
}