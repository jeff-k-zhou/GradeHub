export function encrypt(input: string) {
    let result = '';
    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i);
        if (charCode >= 33 && charCode <= 126) {
            charCode = 33 + ((charCode + 14) % 94);
        }
        result += String.fromCharCode(charCode);
    }
    return result;
}

export function decrypt(input: string) {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      let charCode = input.charCodeAt(i);
      if (charCode >= 33 && charCode <= 126) {
        // Decrypt the character by rotating it backward by 47 positions
        charCode = 33 + ((charCode - 33 + 47) % 94);
      }
      result += String.fromCharCode(charCode);
    }
    return result;
  }