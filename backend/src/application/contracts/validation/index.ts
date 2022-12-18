export interface IValidator {
  validate: () => Promise<any> | any;
}
