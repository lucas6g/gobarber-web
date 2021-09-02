import React, { FormEvent, useState, useCallback, useContext } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import getValidationErrors from '../../utils/getValidationErrors';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

import { AuthContext } from '../../context/AuthContext';

import './Signin.css';
import { ToastContext } from '../../context/ToastContext';

interface Errors {
  [key: string]: string;
}

const Signin: React.FC = () => {
  const history = useHistory();

  const { signIn } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Errors>({});

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      try {
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
            password,
          },
          { abortEarly: false },
        );

        await signIn({
          email,
          password,
        });
        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setValidationErrors(getValidationErrors(error));
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro ao tentar fazer login',
          description: 'Email ou senha invalidos',
        });
      }
    },
    [email, password, signIn, addToast, history],
  );

  return (
    <div className="sign-in-container">
      <section className="content">
        <div className="animation-container">
          <img src={logoImg} alt="" />
          <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
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
            <Input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
              error={validationErrors.password}
            />
            <Button type="submit">Entrar</Button>

            <Link to="/forgot-password">Esqueci minha senha</Link>
          </form>
          <Link to="/sign-up">
            <FiLogIn size={16} />
            Ainda não tem uma conta ?
          </Link>
        </div>
      </section>

      <section className="sign-in-background" />
    </div>
  );
};

export default Signin;
