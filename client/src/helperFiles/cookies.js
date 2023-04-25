function getCookie(name){
  return document.cookie.split(';').some(c => {
      return c.trim().startsWith(name + '=');
  });
}

function deleteCookies(name) {
  let cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split('=')[0].trim();
    let deleteString = cookie + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT" + "; domain=" + document.domain + "; path=/";
    if (name && (cookie === name)) {
      document.cookie = deleteString;
      break;
    } else if (!name) {
      document.cookie = deleteString;
    }
  }
}

function makeCookieObject() {
  let cookies = {}
  document.cookie.split('; ')
    .map((cookie) => cookie.split('='))
    .forEach((cookie) => {
      cookies[cookie[0]] = cookie[1];
    });

  return cookies;
}

function setCookies(cookies, override) {
  const date = new Date();
  date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  let cookiesObject = makeCookieObject();

  for (let i = 0; i < cookies.length; i++) {
    let { name, value } = cookies[i];
    if (override || !cookiesObject.hasOwnProperty(name) || name === 'socketId') {
      document.cookie = `${name}=${value}${expires}; domain=${document.domain}; path=/`;
    }
  }
}

module.exports = {
  getCookie,
  deleteCookies,
  makeCookieObject,
  setCookies
}