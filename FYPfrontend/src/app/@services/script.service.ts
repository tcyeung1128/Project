import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  constructor() { }

  removeSpecialCharacters(string: string) {
    let regex = /[^a-zA-Z0-9]/g;
    return string.replace(regex, "");
  }

  IsEmptyOrNull(string: string) {
    if (string === null || string.trim() === "") {
      return true;
    } else {
      return false;
    }
  }

  validateString(input:string) {
    let regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    
    if (regex.test(input)) {
      return true;
    } else {
      return false;
    }
  }
}
