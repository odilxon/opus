import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { ADDEventUrl, globalURL, TaskAddUrl } from '../service';
import { AiOutlinePlus } from 'react-icons/ai';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AddEvent, HandleHistory } from '../redux/actions/UserAction';
import { defaultStyles, FileIcon } from 'react-file-icon';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';

const TasksList = () => {
  // const [name, setName] = useState('');
  // const [startTime, setStartTime] = useState('');
  const [end, setEndTime] = useState('');
  const [show, setShow] = useState(false);
  const [nameAd, setNamead] = useState('');
  const [clickHist, setClickHist] = useState(false);
  const [addFile, setaddFile] = useState(null);
  const [taskId, setTaskId] = useState('');
  const [clickDesc, setClickDesc] = useState(false);
  const [descName, setDescName] = useState('');
  const [checkDesc, setCheckDesc] = useState(false);

  console.log(addFile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state);
  const { userAction } = userInfo;

  console.log(userAction.clickDate);
  // console.log(userAction.clickedDate);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClickHist = (array) => {
    dispatch(HandleHistory(array));
    setClickHist(true);
  };

  // const timestamp = Date.now();

  // console.log(
  //   new Intl.DateTimeFormat('to', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //   }).format(timestamp)
  // );

  const addEvent = async (e) => {
    e.preventDefault();

    const dataEvent = {
      evenetName: nameAd,
      start_time: userAction.clickedDate,
      end_time: end,
      file: addFile,
    };

    console.log(dataEvent);
    await axios({
      method: 'post',
      url: TaskAddUrl,
      data: dataEvent,
      headers: { 'x-access-token': localStorage.getItem('userToken') },
    })
      .then((response) => {
        console.log(response);
        dispatch(AddEvent(dataEvent));
        setNamead('');
        setEndTime('');
        if (dataEvent) {
          navigate('/tasks');
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
  const handleClickPlus = (id) => {
    setTaskId(id);
    setClickDesc(true);
  };

  const addDesc = async (e) => {
    e.preventDefault();

    const dataEvent = {
      tasc_id: taskId,
      desc: descName,
      // start_time: localStorage.getItem('ckickedDate'),
      status: checkDesc,
    };

    console.log(dataEvent);
    await axios({
      method: 'post',
      url: ADDEventUrl,
      data: dataEvent,
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        console.log(response);
        setDescName('');
        setClickDesc(false);
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

    setClickDesc(false);
  };

  const converTime = (a) => {
    const date = new Date(a * 1000);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = '0' + date.getDay();

    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();
    const formattedTime =
      day +
      '-' +
      month +
      '-' +
      year +
      ' | ' +
      hours +
      ':' +
      minutes.substr(-2) +
      ':' +
      seconds.substr(-2);
    return formattedTime;
  };

  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <>
      <div className="container">
        <div className="row justify-content-end">
          <div className="col-5 col-sm-4 col-md-3 col-lg-2">
            <Link
              className="btn btn-outline-primary mt-3 mb-2 d-flex align-items-center justify-content-center"
              to="/calendar"
            >
              <HiOutlineArrowNarrowLeft className="me-3" /> Orqaga
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-sm my-md-2 p-4 rounded">
          <div className="row align-items-center">
            <div className="col-md-6 text-start">
              <h1 className="pt-2 pb-4">Tasklar ro'yhati</h1>
            </div>

            {userAction.clickedDate ? (
              <>
                <div className="col-md-4 text-end">
                  {userAction.clickedDate}
                </div>
                <div className="col-md-2 text-end">
                  <button
                    onClick={handleShow}
                    className="btn btn-primary d-flex justify-content-between align-items-center"
                  >
                    <AiOutlinePlus /> Add event
                  </button>
                </div>
              </>
            ) : null}
          </div>
          {userAction.clickDate ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">Description</th>
                    <th scope="col">files</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">history</th>
                    <th scope="col">+</th>
                  </tr>
                </thead>
                <tbody>
                  {userAction.clickDate.map((e, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{e.desc}</td>
                      <td className="iconDiv">
                        {e.attributes.length > 0 ? (
                          e.attributes.map((e, i) => (
                            <Link
                              key={i}
                              to={globalURL + e.value}
                              target="_blank"
                              download
                            >
                              <span title={e.key}>
                                <FileIcon
                                  extension={
                                    e.value[e.value.length - 4] == '.'
                                      ? e.value.slice(e.value.length - 3)
                                      : e.value[e.value.length - 5] == '.'
                                      ? e.value.slice(e.value.length - 4)
                                      : 'file'
                                  }
                                  {...(defaultStyles +
                                    `.${
                                      e.value[e.value.length - 4] == '.'
                                        ? e.value.slice(e.value.length - 3)
                                        : e.value[e.value.length - 5] == '.'
                                        ? e.value.slice(e.value.length - 4)
                                        : 'c'
                                    }`)}
                                />
                              </span>
                            </Link>
                          ))
                        ) : (
                          <p>File mavjud emas</p>
                        )}

                        {/* <span>
                          <FileIcon extension="pdf" {...defaultStyles.pdf} />
                        </span>
                        <span>
                          <FileIcon extension="ppt" {...defaultStyles.ppt} />
                        </span>
                        <span>
                          <FileIcon extension="xls" {...defaultStyles.xls} />
                        </span> */}
                      </td>
                      <td>{e.start_date}</td>
                      <td>{e.end_date}</td>
                      <td
                        className={
                          e.status === 2
                            ? 'bg-warning'
                            : e.status === 1
                            ? 'bg-danger text-white'
                            : 'bg-success text-white'
                        }
                      >
                        {e.status === 2
                          ? 'Bajarilmoqda'
                          : e.status === 1
                          ? 'Bajarilmagan'
                          : e.status === 3
                          ? 'Bajarildi'
                          : 'Statussiz'}
                      </td>
                      <td className="history text-center ">
                        {e.history.length > 0 ? (
                          <>
                            {/* <button
                              onClick={() => setClickHist(true)}
                              className="btn btn-link "
                            >
                              {e.history[e.history.length - 1].desc}
                            </button> */}

                            <button
                              onClick={() => handleClickHist(e.history)}
                              className="btn btn-link "
                            >
                              {e.history[e.history.length - 1].desc}
                            </button>

                            {/* <div className="table-responsive history-table p-2 bg-white rounded shadow">
                              <table className="table ">
                                <thead>
                                  <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">name</th>
                                    <th scope="col">Depart</th>
                                    <th scope="col">vaqt</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {e.history.map((e, i) => (
                                    <tr key={i}>
                                      <th scope="row">{i + 1}</th>
                                      <td>{e.desc}</td>
                                      <td>{e.user_name}</td>
                                      <td>{e.user_depart}</td>
                                      <td className="date">
                                        {converTime(e.timestamp)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div> */}
                          </>
                        ) : (
                          <p>Ma'lumot mavjud emas</p>
                        )}
                      </td>
                      <td className="text-center">
                        {/* <button className="btn btn-outline-primary d-flex justify-content-between align-items-center mx-auto">
                          <AiOutlinePlus />
                        </button> */}

                        <button
                          onClick={() => handleClickPlus(e.id)}
                          className="btn btn-outline-primary d-flex justify-content-between align-items-center mx-auto"
                        >
                          <AiOutlinePlus />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h2 className="text-center py-2 h4">
              Bu sanada hech qanday ma'lumot yo'q...
            </h2>
          )}
        </div>
      </div>

      {/* add eventni bosganda  */}
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
                value={nameAd}
                onChange={(e) => setNamead(e.target.value)}
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

            <div className="py-2">
              <label
                className="addFile"
                title="Fayl qo'shish"
                htmlFor="pic"
                onChange={(e) => setaddFile(e.target.files[0])}
              >
                <input id="file" type="file" name="file" />
              </label>
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

      {/* Historyni bosganda */}
      {userAction.clickedHistoryRedux.length > 0 ? (
        <Modal show={clickHist} onHide={() => setClickHist(false)}>
          <Modal.Header closeButton>
            <Modal.Title>History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table ">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">Description</th>
                    <th scope="col">name</th>
                    <th scope="col">Depart</th>
                    <th scope="col">vaqt</th>
                  </tr>
                </thead>
                <tbody>
                  {userAction.clickedHistoryRedux.map((e, i) => (
                    <tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{e.desc}</td>
                      <td>{e.user_name}</td>
                      <td>{e.user_depart}</td>
                      <td className="date">{converTime(e.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
        </Modal>
      ) : null}

      {/* plusni bosganda */}
      <Modal show={clickDesc} onHide={() => setClickDesc(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Plus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={addDesc} className="p-3">
            <div className=" py-2 ">
              <label className="form-label  text-dark">Add Desc</label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="text"
                name="description"
                placeholder="Your Description"
                value={descName}
                onChange={(e) => setDescName(e.target.value)}
              />
            </div>

            <div className=" py-2 ">
              <label className="form-label  text-dark">
                <input
                  type="checkbox"
                  checked={checkDesc}
                  onChange={() => setCheckDesc(!checkDesc)}
                />
                {'   '} Bajarildi
              </label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setClickDesc(false)}
          >
            Close
          </Button>
          <Button onClick={addDesc} variant="primary">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TasksList;
