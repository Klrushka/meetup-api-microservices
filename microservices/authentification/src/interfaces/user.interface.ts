export interface UserInterface {
    _id: string,
    name: string, 
    surname: string,
    email: string,
    telephone: string,
    hash: string, 
    salt: string,
    createdAt: Date,
    updatedAt: Date,
    roles: Array<string>,
}