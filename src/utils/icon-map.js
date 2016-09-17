const fileList = require.context('_icons', true, /[\s\S]*$/);

const iconMap = {};
fileList.keys().forEach(x => {
  const filename = x.replace('./', '');

  // eslint-disable-next-line global-require
  iconMap[filename.replace('.svg', '')] = require(`_icons/${filename}`);
});

export default iconMap;
