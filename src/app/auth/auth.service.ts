import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface AuthResponseData {
    kind?: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    private signUpURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
    private signInURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';

    constructor(private http: HttpClient) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.signUpURL,
            {
                email: email,
                password: password,
                returnSecureToken: true
            },
            {
                params: new HttpParams().set('key', 'AIzaSyBeDTste8nbnoScdQx6yK652AxPxivrX0Q')
            }
        )
        .pipe(catchError(this.handleError));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.signInURL,
            {
                email: email,
                password: password,
                returnSecureToken: true
            },
            {
                params: new HttpParams().set('key', 'AIzaSyBeDTste8nbnoScdQx6yK652AxPxivrX0Q')
            }
        )
        .pipe(catchError(this.handleError));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS': 
                errorMessage = 'This email exists already.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
        }
        return throwError(errorMessage);
    }
}