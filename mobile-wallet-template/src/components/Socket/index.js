import io from 'socket.io-client';
export default class SocketManager {
  static socket = null;
  constructor() {
    this.socket = io('https://explorer.unichain.world');
  }
  /**
   * @returns {SocketManager}
   */
  static getInstance() {
    if (!this.socket) {
      this.socket = new SocketManager().socket;
    }
    return this.socket;
  }
  static disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
