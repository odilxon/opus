import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import {
  AddEvent,
  CalendarInfos,
  HandleClickDate,
  HandleClickDateUser,
} from '../../redux/actions/UserAction';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { CdataUrl, GetUserDateClickUrl } from '../../service';
const Calendar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state);
  const { userAction } = userInfo;
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [end, setEndTime] = useState('');
  const elements = [];

  // statusts.map((e) => {
  //   const infos = {
  //     bajarilmoqda: e.Bajarilmoqda,
  //     bajarilmagan: e.Bajarilmagan,
  //     bajarildi: e.Bajarildi,
  //     sana: e.Sana,
  //   };
  //   setStatusData(infos);
  // });

  const dataRed = useSelector((state) => state);
  const calInf = dataRed.userAction.calendarInfos;
  // console.log();
  // console.log(calInf);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addEvent = async (e) => {
    e.preventDefault();

    const dataEvent = {
      evenetName: name,
      start_time: startTime,
      end_time: end,
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
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        console.log(response);
        dispatch(AddEvent(dataEvent));
        setName('');
        setEndTime('');
        setStartTime('');
        if (dataEvent) {
          navigate('/calendar');
        }
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

  const handleDateClick = async (dateClickInfo) => {
    // console.log(dateClickInfo.dateStr.slice(0, 7));
    dispatch(HandleClickDate(dateClickInfo.dateStr));
    navigate('/tasks');
    await axios({
      method: 'get',
      // url: 'http://26.175.162.142:5000/user/tasks',
      url: GetUserDateClickUrl,
      params: {
        // date: dateClickInfo.dateStr,
        date: dateClickInfo.dateStr,
      },
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        // console.log(response.data);
        const { data } = response;
        dispatch(HandleClickDateUser(data));
        // const dataLocal = {
        //   department: data.department,
        //   email: data.email,
        //   id: data.id,
        //   image: data.image,
        //   name: data.name,
        //   rank: data.rank,
        //   role: data.role,
        // };
        // localStorage.setItem('UserInfos', JSON.stringify(dataLocal));
      })
      .catch((err) => {
        console.log('Err:', err);
      });
  };

  const getCount = async () => {
    await axios({
      method: 'get',
      url: CdataUrl,
      // url: GetUserInfoUrl,
      // params: {
      //   date: userAction.clickDate,
      // },
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        // console.log(response.data);
        const arr = [];
        // const obj = {};
        const { data } = response;
        Object.keys(data).map((e) => arr.push(data[e]));
        // Object.keys(data).map((e) => dispatch(CalendarInfos(arr)));
        dispatch(CalendarInfos(arr));
        // setStatuts(data);
        // console.log(data);
        // const dataLocal = {
        //   department: data.department,
        //   email: data.email,
        //   id: data.id,
        //   image: data.image,
        //   name: data.name,
        //   rank: data.rank,
        //   role: data.role,
        // };
        // localStorage.setItem('UserInfos', JSON.stringify(dataLocal));
      })
      .catch((err) => {
        console.log('Err:', err);
      });
  };
  // console.log(calInf[0].Bajarildi);
  // console.log(calInf);

  calInf.map((e) => {
    // elements.push(e.Sana);
    // const bajarildi = {
    //   title: `Bajarildi   ${calInf[0].Bajarildi}`,
    //   date: calInf[e].Sana,
    // };
    // const bajarilmoqda = {
    //   title: `Bajarilmoqda   ${calInf[e].Bajarilmoqda}`,
    //   date: calInf[e].Sana,
    // };
    // const bajarilmagan = {
    //   title: `Bajarilmoqda   ${calInf[e].Bajarilmagan}`,
    //   date: calInf[e].Sana,
    // };
    // --
    if (e.Bajarildi > 0) {
      elements.push({
        title: `Bajarildi: ${e.Bajarildi} ta`,
        date: e.Sana,
        backgroundColor: '#cff4fc',
        textColor: '#055160',
        borderColor: '#b6effb',
      });
    }
    if (e.Bajarilmoqda > 0) {
      elements.push({
        title: `Bajarilmoqda: ${e.Bajarilmoqda} ta`,
        date: e.Sana,
        backgroundColor: '#fff3cd',
        textColor: '#664d03',
        borderColor: '#ffecb5',
      });
    }
    if (e.Bajarilmagan) {
      elements.push({
        title: `Bajarilmoqda: ${e.Bajarilmagan} ta`,
        date: e.Sana,
        backgroundColor: '#f8d7da',
        textColor: '#842029',
        borderColor: '#f5c2c7',
      });
    }
    // ----
    // if (calInf[e].Bajarildi > 0) {
    //   elements.push({
    //     title: `Bajarildi   ${calInf[e].Bajarildi}`,
    //     date: calInf[e].Sana,
    //   });
    // }
    // if (calInf[e].Bajarilmagan > 0) {
    //   elements.push({
    //     title: `Bajarilmoqda   ${calInf[e].Bajarilmoqda}`,
    //     date: calInf[e].Sana,
    //   });
    // }
    // if (calInf[e].Bajarilmagan) {
    //   elements.push({
    //     title: `Bajarilmoqda   ${calInf[e].Bajarilmagan}`,
    //     date: calInf[e].Sana,
    //   });
    // }
  });

  // if (statusts) {
  //   Object.keys(statusts).forEach((e) => {
  //     const infos = {
  //       bajarilmoqda: statusts[e].Bajarilmoqda,
  //       bajarilmagan: statusts[e].Bajarilmagan,
  //       bajarildi: statusts[e].Bajarildi,
  //       sana: statusts[e].Sana,
  //     };
  //     setStatusData([...statusData, infos]);
  //   });
  // }
  // useEffect(() => {
  //   if (!localStorage.getItem('userToken')) {
  //     navigate('/');
  //     return toast.error("Noto'g'ri amal", {
  //       position: 'bottom-right',
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   }
  // }, [navigate]);

  // console.log(statusts);
  // if (statusts.length > 2) {
  //   Object.keys(statusts).map((key) =>
  //     setStatutsData([...setStatutsData, statusts[key].Sana])
  //   );
  // }
  // console.log(statustsData);

  useEffect(() => {
    getCount();
  }, []);

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
            events={elements}
            // events={[
            //   {
            //     title: 'event 1',
            //     date: '2021-11-21',
            //     backgroundColor: '#f8d7da',
            //     textColor: '#842029',
            //     borderColor: '#f5c2c7',
            //   },
            //   {
            //     title: 'event 1',
            //     date: '2021-11-21',
            //     backgroundColor: '#fff3cd',
            //     textColor: '#664d03',
            //     borderColor: '#ffecb5',
            //   },
            //   {
            //     title: 'event 1',
            //     date: '2021-11-21',
            //     backgroundColor: '#cff4fc',
            //     textColor: '#055160',
            //     borderColor: '#b6effb',
            //   },
            //   {
            //     title: 'event 2',
            //     date: '2021-11-11',
            //     backgroundColor: '#fff3cd',
            //     textColor: '#664d03',
            //     borderColor: '#ffecb5',
            //   },
            //   {
            //     title: 'event 3',
            //     date: '2021-11-18',
            //     backgroundColor: '#cff4fc',
            //     textColor: '#055160',
            //     borderColor: '#b6effb',
            //   },
            // ]}
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
