import { IValidator } from '../../../contracts/validation';

/**
 * @author Rodrigo Manguinho <rodrigo.manguinho@gmail.com>
 * @desc Compose a linear list structure validation with the same contract
 * It uses the {@link https://refactoring.guru/design-patterns/composite Composite} design pattern
 */
export class TokenValidationComposite implements IValidator {
  constructor(private readonly validators: IValidator[]) {}

  validate(): void {
    this.validators.forEach(validator => {
      validator.validate();
    });
  }
}
