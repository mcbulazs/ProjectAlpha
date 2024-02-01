import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const PasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    
    if (passwordConfirm?.invalid)
    return { passwordInvalid: true };
    
    if (password?.value === passwordConfirm?.value)
    return null;

    let error = { match: false };
    passwordConfirm?.setErrors(error);
    return error;
}