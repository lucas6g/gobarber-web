import React, { FormEvent, useState, useCallback, useContext } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import './Signup.css';
import { ToastContext } from '../../context/ToastContext';

interface Errors {
  [key: string]: string;
}

const Signup: React.FC = () => {
  const history = useHistory();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({} as Errors);
  const { addToast } = useContext(ToastContext);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setValidationErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatorio'),
          email: Yup.string()
            .required('Email é obrigatorio')
            .email('Digite um email valido'),
          password: Yup.string().min(6, 'No minimo 6 digitos'),
        });

        await schema.validate(
          {
            name,
            email,
            password,
          },
          { abortEarly: false },
        );

        await api.post('/users', {
          name,
          email,
          password,
        });

        addToast({
          type: 'success',
          title: 'Faça logo seu login viado',
          description: 'conseguio guerrero',
        });
        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setValidationErrors(getValidationErrors(error));
          return;
        }
        addToast({
          type: 'error',
          title: 'fudeu tudo man',
          description: 'se fude viado',
        });
      }
    },
    [name, email, password, addToast, history],
  );

  return (
    <div className="sign-up-container">
      <section className="sign-up-background" />
      <section className="content">
        <div className="animation-container">
          <img src={logoImg} alt="" />
          <form onSubmit={handleSubmit}>
            <h1>Cadastrar-Se</h1>
            <Input
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
              icon={FiUser}
              name="name"
              type="text"
              placeholder="Nome"
              error={validationErrors.name}
            />

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

            <Button type="submit">Cadastrar</Button>
          </form>
          <Link to="/">
            <FiArrowLeft size={16} />
            Já possui uma conta ?
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Signup;
