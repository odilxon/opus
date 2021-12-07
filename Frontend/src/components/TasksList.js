import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
  ADDEventUrl,
  GetUserDateClickUrl,
  globalURL,
  TaskAddUrl,
} from '../service';
import { AiOutlinePlus } from 'react-icons/ai';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  HandleClickDateUser,
  HandleHistory,
} from '../redux/actions/UserAction';
import { FileIcon } from 'react-file-icon';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const TasksList = () => {
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
  const { t } = useTranslation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClickHist = (array) => {
    dispatch(HandleHistory(array));
    setClickHist(true);
  };

  const addEvent = async (e) => {
    e.preventDefault();
    var bodyFormData = new FormData();

    bodyFormData.append('desc', nameAd);
    bodyFormData.append('start_date', userAction.clickedDate);
    bodyFormData.append('end_date', end);
    if (addFile.length < 10) {
      for (let i = 0; i < addFile.length; i++) {
        bodyFormData.append(`file${[]}`, addFile[i]);
      }
    } else {
      return toast.warning('Fayllar keragidan ortib ketdi', {
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
      params: {
        date: localStorage.getItem('ckickedDate'),
      },
      url: TaskAddUrl,
      data: bodyFormData,
      headers: { 'x-access-token': localStorage.getItem('userToken') },
    })
      .then((response) => {
        console.log(response.data);
        dispatch(HandleClickDateUser(response.data));
        setNamead('');
        setEndTime('');
        navigate('/tasks');
      })
      .catch((err) => {
        console.log('Err:', err);
        return toast.error(t('tasks.alertwarn'), {
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

    var bodyFormData = new FormData();
    bodyFormData.append('task_id', taskId);
    bodyFormData.append('desc', descName);
    bodyFormData.append('status', checkDesc);
    await axios({
      method: 'post',
      url: ADDEventUrl,
      params: {
        date: localStorage.getItem('ckickedDate'),
      },
      data: bodyFormData,
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        console.log(response.data);
        dispatch(HandleClickDateUser(response.data));
        setDescName('');
        setClickDesc(false);
      })
      .catch((err) => {
        console.log('Err:', err);
        return toast.error(t('tasks.alerterr'), {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
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
  const compareDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const todayDate = today.getDate();

    const lYear = parseFloat(localStorage.getItem('ckickedDate').slice(0, 4));
    const lMonth = parseFloat(localStorage.getItem('ckickedDate').slice(5, 8));
    const lDate = parseFloat(localStorage.getItem('ckickedDate').slice(8, 10));

    if (lYear > year) {
      return true;
    } else if (year === lYear) {
      if (lMonth > month) {
        return true;
      } else if (lMonth === month) {
        if (lDate >= todayDate) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      navigate('/');
    }
  }, [navigate]);

  const FetchDateInfos = async () => {
    await axios({
      method: 'get',
      url: GetUserDateClickUrl,
      params: {
        date: localStorage.getItem('ckickedDate'),
      },
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        const { data } = response;
        dispatch(HandleClickDateUser(data));
      })
      .catch((err) => {
        console.log('Err:', err);
      });
  };

  useEffect(() => {
    FetchDateInfos();
  }, []);
  return (
    <>
      <div className="container">
        <div className="row justify-content-end">
          <div className="col-5 col-sm-4 col-md-3 col-lg-2">
            <Link
              className="btn btn-outline-primary mt-3 mb-2 d-flex align-items-center justify-content-center"
              to="/calendar"
            >
              <HiOutlineArrowNarrowLeft className="me-3" />
              {t('tasks.back')}
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-sm my-md-2 p-4 rounded">
          <div className="row align-items-center">
            <div className="col-md-6 text-start">
              <h1 className="pt-2 pb-4">{t('tasks.title')}</h1>
            </div>

            {userAction.clickedDate.length > 0 ? (
              <>
                <div className="col-md-4 text-end">
                  {userAction.clickedDate}
                </div>

                {compareDate() ? (
                  <div className="col-md-2 text-end">
                    <button
                      onClick={handleShow}
                      className="btn btn-primary d-flex justify-content-between align-items-center"
                    >
                      <AiOutlinePlus /> {t('tasks.addEvent')}
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
          {userAction.clickDate.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col"> {t('tasks.desc')}</th>
                    <th scope="col">{t('tasks.files')}</th>
                    <th scope="col">{t('tasks.start')}</th>
                    <th scope="col">{t('tasks.end')}</th>
                    <th scope="col">{t('tasks.status')}</th>
                    <th scope="col">{t('tasks.hist')}</th>
                    <th scope="col">{t('tasks.plus')}</th>
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
                            <a
                              key={i}
                              href={globalURL + e.value}
                              target="_blank"
                              download
                            >
                              <span title={e.key}>
                                {/* {console.log(e.value.slice(e.value.length - 4))} */}
                                <FileIcon
                                  extension={
                                    e.value[e.value.length - 4] === '.'
                                      ? e.value.slice(e.value.length - 3)
                                      : e.value[e.value.length - 5] === '.'
                                      ? e.value.slice(e.value.length - 4)
                                      : 'file'
                                  }
                                  gradientColor={
                                    e.value.slice(e.value.length - 3) ===
                                      'doc' ||
                                    e.value.slice(e.value.length - 3) === 'ocx'
                                      ? '#2c5898'
                                      : e.value.slice(e.value.length - 3) ===
                                          'xls' ||
                                        e.value.slice(e.value.length - 3) ===
                                          'xml' ||
                                        e.value.slice(e.value.length - 3) ===
                                          'lsx'
                                      ? 'green'
                                      : e.value.slice(e.value.length - 3) ===
                                        'pdf'
                                      ? 'red'
                                      : e.value.slice(e.value.length - 3) ===
                                          'png' ||
                                        e.value.slice(e.value.length - 3) ===
                                          'peg' ||
                                        e.value.slice(e.value.length - 3) ===
                                          'jpg'
                                      ? 'yellow'
                                      : 'white'
                                  }
                                  labelColor={
                                    e.value.slice(e.value.length - 3) ===
                                      'doc' ||
                                    e.value.slice(e.value.length - 3) === 'ocx'
                                      ? '#2c5898'
                                      : e.value.slice(e.value.length - 3) ===
                                          'xls' ||
                                        e.value.slice(e.value.length - 3) ===
                                          'xml' ||
                                        e.value.slice(e.value.length - 3) ===
                                          'lsx'
                                      ? 'green'
                                      : e.value.slice(e.value.length - 3) ===
                                        'pdf'
                                      ? 'red'
                                      : e.value.slice(e.value.length - 3) ===
                                          'png' ||
                                        e.value.slice(e.value.length - 3) ===
                                          'peg' ||
                                        e.value.slice(e.value.length - 3) ===
                                          'jpg'
                                      ? 'yellow'
                                      : 'white'
                                  }
                                  // gradientOpacity={0.5}
                                  gradientOpacity={1}
                                  // {e.value[e.value.length - 4] === '.'
                                  // ? e.value.slice(e.value.length - 3)
                                  // : e.value[e.value.length - 5] === '.'
                                  // ? e.value.slice(e.value.length - 4)
                                  // : 'file'}

                                  // {...defaultStyles.docx}
                                />
                              </span>
                            </a>
                          ))
                        ) : (
                          <p>{t('tasks.fileNo')}</p>
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
                          ? t('calendar.bjdti')
                          : e.status === 1
                          ? t('calendar.bjdm')
                          : e.status === 3
                          ? t('calendar.bjd')
                          : t('calendar.no')}
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
                          <p>{t('tasks.infoNo')}</p>
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
            <h2 className="text-center py-2 h4">{t('tasks.noGetInfo')}</h2>
          )}
        </div>
      </div>

      {/* add eventni bosganda  */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.addEvent')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={addEvent} className="p-3">
            {/* <h2 className="text-center h3">Sign In to Metronic</h2> */}

            <div className=" py-2 ">
              <label className="form-label  text-dark">
                {t('modal.eventName')}
              </label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="text"
                name="name"
                placeholder={t('modal.eventNameplc')}
                value={nameAd}
                onChange={(e) => setNamead(e.target.value)}
              />

              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className=" py-2 ">
              <label className="form-label  text-dark">{t('tasks.end')}</label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="date"
                name="end_time"
                placeholder={t('modal.endplc')}
                value={end}
                onChange={(e) => setEndTime(e.target.value)}
                min={localStorage.getItem('ckickedDate')}
              />
              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className="py-2">
              <label
                className="addFile"
                title={t('modal.fileAdd')}
                htmlFor="pic"
                onChange={(e) => setaddFile(e.target.files)}
              >
                <input multiple id="file" type="file" name="file" />
              </label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleClose}>
            {t('myacc.back')}
          </Button>
          <Button onClick={addEvent} variant="primary">
            {t('myacc.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Historyni bosganda */}
      {userAction.clickedHistoryRedux.length > 0 ? (
        <Modal show={clickHist} onHide={() => setClickHist(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{t('modal.hist')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table ">
                <thead>
                  <tr>
                    <th scope="col">№</th>
                    <th scope="col">{t('tasks.desc')}</th>
                    <th scope="col">{t('modal.name')}</th>
                    <th scope="col">{t('modal.depart')}</th>
                    <th scope="col">{t('modal.time')}</th>
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
              <label className="form-label  text-dark">
                {t('modal.addDesc')}
              </label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="text"
                name="description"
                placeholder={t('modal.descName')}
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
                {'   '} {t('modal.checkBox')}
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
            {t('myacc.back')}
          </Button>
          <Button onClick={addDesc} variant="primary">
            {t('myacc.save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TasksList;
