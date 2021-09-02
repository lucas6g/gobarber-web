import React, { FormEvent, useState, useCallback, useContext } from 'react';
import { FiLock } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

import './ResetPassword.css';
import { ToastContext } from '../../context/ToastContext';

interface Errors {
  [key: string]: string;
}

const ResetPassword: React.FC = () => {
  const history = useHistory();

  const location = useLocation();

  const token = location.search.replace('?token=', '');

  const { addToast } = useContext(ToastContext);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Errors>({});

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      try {
        setIsLoading(true);
        setValidationErrors({});
        const schema = Yup.object().shape({
          newPassword: Yup.string().min(6, 'No minimo 6 digitos'),
          confirmPassword: Yup.string().oneOf(
            [Yup.ref('newPassword'), undefined],
            'As senhas não coincidem',
          ),
        });

        await schema.validate(
          {
            newPassword,
            confirmPassword,
          },
          { abortEarly: false },
        );

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          newPassword,
          newPasswordConfirmation: confirmPassword,
          token,
        });

        history.push('/');

        addToast({
          type: 'success',
          title: 'Senha alterada com sucessso',
          description: 'Redirecionando para a pagina de signin',
        });
        // history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setValidationErrors(getValidationErrors(error));
          return;
        }
        addToast({
          type: 'error',
          title: 'erro ao criar nova senha',
          description:
            'Ocorreu um erro na recuperacao de senha tente novamente mais tarde',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addToast, newPassword, history, confirmPassword, token],
  );

  return (
    <div className="reset-password-container">
      <section className="content">
        <div className="animation-container">
          <img src={logoImg} alt="" />
          <form onSubmit={handleSubmit}>
            <h1>Criar Nova Senha</h1>

            <Input
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              value={newPassword}
              icon={FiLock}
              name="new-password"
              type="password"
              placeholder="Nova Senha"
              error={validationErrors.newPassword}
            />
            <Input
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              value={confirmPassword}
              icon={FiLock}
              name="confirm-password"
              type="password"
              placeholder="Confirme a Senha"
              error={validationErrors.confirmPassword}
            />

            <Button isLoading={isLoading} type="submit">
              Alterar Senha
            </Button>
          </form>
        </div>
      </section>

      <section className="reset-password-background" />
    </div>
  );
};

export default ResetPassword;
