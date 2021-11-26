import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import { HandleClickDateUser } from '../../redux/actions/UserAction';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { GetUserInfoUrl } from '../../service';
const Calendar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [end, setEndTime] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const addEvent = async (e) => {
    e.preventDefault();

    const dataEvent = {
      evenetName: name,
      start_time: startTime,
      end_time: end,
      token: localStorage.getItem('userToken'),
    };

    if (!name || !end || !startTime) {
      return toast.warning("Iltimos to'liq ma'lumot kiriting!", {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    await axios({
      method: 'post',
      // url: LoginUrl,
      url: 'https://jsonplaceholder.typicode.com/posts',
      data: dataEvent,
      // data: { email: email, password: password },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        console.log(response);
        setName('');
        setEndTime('');
        setStartTime('');
      })
      .catch((err) => {
        console.log('Err:', err);
        return toast.error("Noto'g'ri", {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    setShow(false);
  };

  const data = useSelector((state) => state);
  console.log(data);
  const handleDateClick = (dateClickInfo: any) => {
    dispatch(HandleClickDateUser(dateClickInfo.dateStr));
  };

  const getUserInfo = async () => {
    await axios
      .post(GetUserInfoUrl, {
        headers: {
          'x-access-token': localStorage.getItem('userToken'),
        },
      })

      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log('Err:', err);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      navigate('/');
      return toast.warning("Ro'yhatdan o'tmagansiz!", {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [navigate]);

  useEffect(() => {
    getUserInfo();
  });

  return (
    <div className="calendar">
      <div className="container shadow-sm rounded my-md-3   bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3 px-3 pt-3">Calendar</h1>
          <div>
            <button
              onClick={handleShow}
              className="btn btn-primary d-flex justify-content-between align-items-center"
            >
              <AiOutlinePlus /> Add event
            </button>
          </div>
        </div>
        <hr />
        <div className="p-md-3">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridDay,dayGridWeek,dayGridMonth',
            }}
            initialView="dayGridMonth"
            selectable="true"
            dateClick={handleDateClick}
            // themeSystem="bootstrap"
          />
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={addEvent} className="p-3">
            <h2 className="text-center h3">Sign In to Metronic</h2>

            <div className=" py-2 ">
              <label className="form-label  text-dark">Event name</label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="text"
                name="name"
                placeholder="Event name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className=" py-2 ">
              <label className="form-label  text-dark">Event start time</label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="date"
                name="start_time"
                placeholder="Event start time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className=" py-2 ">
              <label className="form-label  text-dark">Event end time</label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="date"
                name="end_time"
                placeholder="Event end time"
                value={end}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={addEvent} variant="primary">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
