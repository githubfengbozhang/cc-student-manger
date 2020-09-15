
const replaceString = (value) => {
    debugger
    let newValue = ''
    if(value){
        newValue = value.replace(/&lt;/g, "<");  
        newValue = value.replace(/&gt;/g, ">");  
        newValue = value.replace(/&apos;/g, "&apos;");  
        newValue = value.replace(/&quot;/g, "\"");  
        newValue = value.replace(/&amp;/g, "&");
        newValue = value.replace(/&nbsp;/g, "\n");  
        return newValue;
    }else{
        return ''
    }
}

export {
    replaceString
}