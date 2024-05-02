export interface LoginPost {
    user_account:string;
    user_password:string;
}

export interface ChangePassword{
    oldPassword:string;
    newPassword:string;
    confirmNewPassword:string;
}