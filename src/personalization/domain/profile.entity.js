/**
 * Profile Entity - Representa la información del perfil de usuario
 */
export class UserProfile {
    constructor({
        userId,
        username,
        firstName,
        lastName,
        email,
        dni,
        district,
        createdAt,
        updatedAt
    }) {
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dni = dni;
        this.district = district;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromJson(json) {
        return new UserProfile({
            userId: json.userId,
            username: json.username,
            firstName: json.firstName,
            lastName: json.lastName,
            email: json.email,
            dni: json.dni,
            district: json.district,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt
        });
    }

    toJson() {
        return {
            userId: this.userId,
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            dni: this.dni,
            district: this.district,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

