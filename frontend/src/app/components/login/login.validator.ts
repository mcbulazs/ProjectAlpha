import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Observable, delay, of } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoginValidator implements AsyncValidator {

    constructor(private authService: AuthService) {}

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        console.log(control.value);
        
        return of(null).pipe(delay(1000));
    }
}