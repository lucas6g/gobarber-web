import React, { FormEvent, useState, useCallback, useContext } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

import './ForgotPassword.css';
import { ToastContext } from '../../context/ToastContext';

interface Errors {
  [key: string]: string;
}

const ForgotPassword: React.FC = () => {
  const history = useHistory();

  const { addToast } = useContext(ToastContext);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Errors>({});

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      try {
        setIsLoading(true);
        setValidationErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email é obrigatorio')
            .email('Digite um email valido'),
          password: Yup.string().min(6, 'No minimo 6 digitos'),
        });

        await schema.validate(
          {
            email,
          },
          { abortEarly: false },
        );

        await api.post('/password/forgot', {
          email,
        });

        addToast({
          type: 'success',
          title: 'email de recuperação enviado',
          description: 'enviamos um email para confirmar a recuperacao ',
        });
        // history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setValidationErrors(getValidationErrors(error));
          return;
        }
        addToast({
          type: 'error',
          title: 'erro na recuperação de senha',
          description:
            'Ocorreu um erro na recuperacao de senha tente novamente mais tarde',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [email, addToast, history],
  );

  return (
    <div className="forgot-password-container">
      <section className="content">
        <div className="animation-container">
          <img src={logoImg} alt="" />
          <form onSubmit={handleSubmit}>
            <h1>Recuperação de senha</h1>
            <Input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              icon={FiMail}
              name="email"
              type="email"
              placeholder="Email"
              error={validationErrors.email}
            />

            <Button isLoading={isLoading} type="submit">
              Recuperar
            </Button>
          </form>
          <Link to="/">
            <FiLogIn size={16} />
            Voltar Para Tela de login
          </Link>
        </div>
      </section>

      <section className="forgot-password-background" />
    </div>
  );
};

export default ForgotPassword;
