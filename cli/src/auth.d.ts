declare let auth: {
    getToken(): string;
    askCredentials(): void|Promise<void>;
}   

export default auth;