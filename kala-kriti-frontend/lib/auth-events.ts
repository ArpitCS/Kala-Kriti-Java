type AuthEventType = 'login' | 'logout' | 'refresh' | 'expired';
type AuthEventListener = (event: AuthEventType, data?: any) => void;

class AuthEventEmitter {
  private listeners: AuthEventListener[] = [];

  subscribe(listener: AuthEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(event: AuthEventType, data?: any): void {
    this.listeners.forEach(listener => listener(event, data));
  }
}

export const authEvents = new AuthEventEmitter();