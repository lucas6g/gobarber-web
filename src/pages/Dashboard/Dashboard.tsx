import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { isToday, format, isAfter } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import './Dashboard.css';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FiClock } from 'react-icons/fi';
import { parseISO } from 'date-fns/esm';
import { calendarStyle } from './calendarStyle';

import Header from '../../components/Header/Header';

import Appointment from '../../components/Appointment/Appointment';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const calendarStyleConfig = {
  available: {
    daysOfWeek: [1, 2, 3, 4, 5],
  },
};

interface IAvaibleDay {
  day: number;
  avaible: boolean;
}

interface IAppointment {
  id: string;
  date: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [avaibleDaysInMonth, setAvaibleDaysInMonth] = useState<IAvaibleDay[]>(
    [],
  );
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-avalability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then((response) => {
        setAvaibleDaysInMonth(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get(`/appointments/me`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        setAppointments(response.data);
      });
  }, [selectedDate]);

  /*
    use Meno serve para calcular um valor apenas uma vez independente
    de quantas vezez o componente renderize
  */
  const desableDays = useMemo(() => {
    const dates = avaibleDaysInMonth
      .filter((day) => {
        return day.avaible === false;
      })
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, avaibleDaysInMonth]);

  const seletedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM ", {
      locale: ptBr,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBr,
    });
  }, [selectedDate]);

  // usar o use memo para formatar dados do backend
  const morningAppoitnments = useMemo(() => {
    return appointments.filter((appointment) => {
      return (
        parseISO(appointment.date).getHours() < 12 &&
        isAfter(parseISO(appointment.date), new Date())
      );
    });
  }, [appointments]);

  const eveningAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return (
        parseISO(appointment.date).getHours() >= 12 &&
        isAfter(parseISO(appointment.date), new Date())
      );
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find((appointment) => {
      return isAfter(parseISO(appointment.date), new Date());
    });
  }, [appointments]);

  const handleDayChange = useCallback((date: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(date);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-content">
        <div className="schedule">
          <h1>Seja Bem vindo</h1>
          <p>
            <span>{isToday(selectedDate) && `Hoje | `}</span>
            <span>{`${seletedDateAsText} | `}</span>
            <span>{`${selectedWeekDay}`}</span>
          </p>
          <div className="next-appointment">
            {isToday(selectedDate) && nextAppointment && (
              <>
                <strong>atendimento a seguir</strong>

                <div className="next">
                  <img
                    src="https://pbs.twimg.com/profile_images/1255676902112669696/qmD-Uuxn.jpg"
                    alt=""
                  />
                  <strong>{nextAppointment.user.name}</strong>

                  <span>
                    <FiClock />
                    {format(parseISO(nextAppointment.date), "hh':'mm")}
                  </span>
                </div>
              </>
            )}

            <section>
              <strong>Manha</strong>
              {morningAppoitnments.map((appointment) => {
                return (
                  <Appointment
                    key={appointment.id}
                    avatar_url="https://pbs.twimg.com/profile_images/1255676902112669696/qmD-Uuxn.jpg"
                    name={appointment.user.name}
                    schedule={format(parseISO(appointment.date), "hh':'mm")}
                  />
                );
              })}
            </section>
            <section>
              <strong>Tarde</strong>
              {eveningAppointments.map((appointment) => {
                return (
                  <Appointment
                    key={appointment.id}
                    avatar_url="https://pbs.twimg.com/profile_images/1255676902112669696/qmD-Uuxn.jpg"
                    name={appointment.user.name}
                    schedule={format(parseISO(appointment.date), "hh':'mm")}
                  />
                );
              })}
            </section>
          </div>
        </div>

        <aside className="calendar">
          <style>{calendarStyle}</style>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            modifiers={calendarStyleConfig}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...desableDays]}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
            onDayClick={handleDayChange}
            onMonthChange={(month) => {
              handleMonthChange(month);
            }}
          />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;
