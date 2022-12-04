import { Either, left, right } from '../../../shared';

import { Nationalities } from '../../contracts';
import {
  Email,
  Lastname,
  Name,
  Password,
  Document,
  Phone,
  ID,
} from '../../value-objects';

interface Props {
  name: Name;
  phone: Phone;
  lastname: Lastname;
  document: Document;
  email: Email;
  password: Password;
}

interface Input {
  name: string;
  phone: string;
  lastname: string;
  document: string;
  email: string;
  password: string;
}

interface Options {
  encrypted: boolean;
  nationality: Nationalities;
}

export class User {
  private readonly value: { id: string } & Props;

  private constructor(
    private readonly id: string,
    private readonly props: Props,
  ) {
    this.value = {
      id: this.id,
      ...this.props,
    };
  }

  public get(): { id: string } & Props {
    return this.value;
  }

  public static create(
    id: string,
    user: Input,
    options: Options,
  ): Either<Error, User> {
    const { email, lastname, name, password, document, phone } = user;

    const idOrError = ID.create(id);
    const nameOrError = Name.create(name);
    const lastnameOrError = Lastname.create(lastname);
    const documentOrError = Document.create(document, options.nationality);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password, options.encrypted);
    const phoneOrError = Phone.create(phone, options.nationality);

    if (idOrError.isLeft()) {
      return left(idOrError.value);
    }

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (lastnameOrError.isLeft()) {
      return left(lastnameOrError.value);
    }

    if (documentOrError.isLeft()) {
      return left(documentOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    if (phoneOrError.isLeft()) {
      return left(phoneOrError.value);
    }

    return right(
      new User(idOrError.value.get(), {
        email: emailOrError.value,
        lastname: lastnameOrError.value,
        name: nameOrError.value,
        password: passwordOrError.value,
        document: documentOrError.value,
        phone: phoneOrError.value,
      }),
    );
  }
}
