function getCookie(name){
  return document.cookie.split(';').some(c => {
      return c.trim().startsWith(name + '=');
  });
}

function deleteCookies() {
  let cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split('=')[0].trim();

    document.cookie = cookie + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT" + "; domain=" + document.domain + "; path=/";

  }
  console.log('cookies: ', document.cookie.split(';'));
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

function setCookies(cookies) {
  const date = new Date();
  date.setTime(date.getTime() + (1 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  let cookiesObject = makeCookieObject();

  for (let i = 0; i < cookies.length; i++) {
    let { name, value } = cookies[i];
    if (cookiesObject.hasOwnProperty('uid')) {

    }
    console.log('name: ', name);
    console.log('value: ', value);
    document.cookie = `${name}=${value}${expires}; domain=${document.domain}; path=/`;
  }
}

module.exports = {
  getCookie,
  deleteCookies,
  makeCookieObject,
  setCookies
}