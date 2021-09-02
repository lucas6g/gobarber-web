import { ValidationError } from 'yup';

// para colocar qualquer chave como nome da propriedade de um obejeto usamos []
interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(
  validationError: ValidationError,
): Errors {
  const errors: Errors = {};
  validationError.inner.forEach((error) => {
    errors[error.path] = error.message;
  });

  return errors;
}
