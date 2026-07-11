export const CookieUtils = {
  setCookie(name: string, value: string, expiresAt?: string): void {
    let expires = '';
    if (expiresAt) {
      const date = new Date(expiresAt);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  },

  getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  removeCookie(name: string): void {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },

  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }
};
