declare let auth: {
    getToken(): string;
    askCredentials(): void;
}   

export default auth;