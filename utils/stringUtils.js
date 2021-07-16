export function titleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

export function stringValue(str) {
  let sum = 0;
  let i = str.length;
  while (i--) {
    sum += str.charCodeAt(i)
  }
  return sum
}

export function urlBaseName(str) {
  return str.split('/').pop()
}

export function removeExtension(str) {
  return str.split('.').slice(0, -1).join('.')
}
