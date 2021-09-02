import React, {
  FormEvent,
  useState,
  useCallback,
  useContext,
  ChangeEvent,
} from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import './Profile.css';
import { ToastContext } from '../../context/ToastContext';
import { AuthContext } from '../../context/AuthContext';

interface Errors {
  [key: string]: string;
}

const Profile: React.FC = () => {
  const history = useHistory();
  const { user, updateUser } = useContext(AuthContext);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  const [validationErrors, setValidationErrors] = useState({} as Errors);
  const { addToast } = useContext(ToastContext);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setValidationErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          oldPassword: Yup.string().required(),
          newPassword: Yup.string()
            .when('oldPassword', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .required(),
          newPasswordConfirmation: Yup.string()
            .when('oldPassword', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(
          {
            name,
            email,
            oldPassword,
            newPassword,
            newPasswordConfirmation,
          },
          { abortEarly: false },
        );

        const formData = {
          name,
          email,
          ...(oldPassword
            ? {
                oldPassword,
                newPassword,
                newPasswordConfirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso',
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
    [
      addToast,
      history,
      newPassword,
      newPasswordConfirmation,
      oldPassword,
      name,
      email,
      updateUser,
    ],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);
        api.patch('/users/avatar', data).then((response) => {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <div className="profile-container">
      <header>
        <Link to="/dashboard">
          <FiArrowLeft />
        </Link>
      </header>
      <section className="content">
        <form onSubmit={handleSubmit}>
          <div className="avatar-input">
            <img
              src="https://i.pinimg.com/736x/64/01/f9/6401f990d444f01143bfcd01a28d7cb6.jpg"
              alt={user.name}
            />
            <label htmlFor="avatar">
              <FiCamera />
              <input onChange={handleAvatarChange} type="file" id="avatar" />
            </label>
          </div>
          <h1>Meu perfil</h1>

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
            containerStyle={{ marginBottom: 24 }}
            value={email}
            icon={FiMail}
            name="email"
            type="email"
            placeholder="Email"
            error={validationErrors.email}
          />
          <Input
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            value={oldPassword}
            icon={FiLock}
            name="old-password"
            type="password"
            placeholder="Senha Atual"
            error={validationErrors.oldPassword}
          />
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
              setNewPasswordConfirmation(e.target.value);
            }}
            value={newPasswordConfirmation}
            icon={FiLock}
            name="new-password-confirmation"
            type="password"
            placeholder="Confirmar Nova Senha"
            error={validationErrors.newPasswordConfirmation}
          />

          <Button type="submit">Confirmar mudanças </Button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
