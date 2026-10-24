export const OPEN_CHAT_EVENT = 'ornen:open-chat'

export function openLeadChat() {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT))
}
