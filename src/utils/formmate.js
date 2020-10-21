
const replaceString = (value) => {
  let newValue = ''
  if (value) {
    newValue = value.replace(/&lt;/g, "<");
    newValue = value.replace(/&gt;/g, ">");
    newValue = value.replace(/&apos;/g, "&apos;");
    newValue = value.replace(/&quot;/g, "\"");
    newValue = value.replace(/&nbsp;/g, "\n");
    newValue = value.replace(/&amp;/g, "&");
    return newValue.replace(/&nbsp;/g, "\n");
  } else {
    return ''
  }
}

export {
  replaceString
}