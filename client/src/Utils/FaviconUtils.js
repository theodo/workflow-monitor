export const setFavicon = icon => {
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = `${process.env.PUBLIC_URL}/${icon}.ico`;
  document.getElementsByTagName('head')[0].appendChild(link);
};
