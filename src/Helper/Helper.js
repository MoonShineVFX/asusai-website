export const setUsernameToCookie = (username) => {
  // 設定 cookie 的過期時間（此例為一天）
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);

  // 將 username 存入 cookie
  document.cookie = `username=${username}; expires=${expirationDate.toUTCString()}; path=/`;
};
export const getUsernameFromCookie = () => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'username') {
      return value;
    }
  }
  return null;
};