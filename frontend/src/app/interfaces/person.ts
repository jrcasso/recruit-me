export interface PersonBase { }


export interface GenericPerson extends PersonBase {
    username: String
}


export interface NamedPerson extends PersonBase {
    firstName: String
    middleName?: String
    lastName?: String
}
export interface Professional extends NamedPerson {
        title: String
        headerImageURL?: String
    }
