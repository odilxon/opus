import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
  ADDEventUrl,
  GetUserDateClickUrl,
  globalURL,
  TaskAddUrl,
} from '../../service';
import { AiOutlinePlus } from 'react-icons/ai';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  HandleClickDateUser,
  HandleHistory,
} from '../../redux/actions/UserAction';
import { defaultStyles, FileIcon } from 'react-file-icon';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { MultiSelect } from 'react-multi-select-component';

const AllTasksToday = () => {
  const [end, setEndTime] = useState('');
  const [show, setShow] = useState(false);
  const [nameAd, setNamead] = useState('');
  const [clickHist, setClickHist] = useState(false);
  const [addFile, setaddFile] = useState(null);
  const [taskId, setTaskId] = useState('');
  const [clickDesc, setClickDesc] = useState(false);
  const [descName, setDescName] = useState('');
  const [checkDesc, setCheckDesc] = useState(false);
  const [selectValue, setSelectValue] = useState([]);

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
    if (addFile) {
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
    }
    if (localStorage.getItem('role') === 'adminClicked') {
      let users = [];
      selectValue.map((e) => {
        users.push(e.value);
      });
      console.log(users);

      console.log(users);
      users.push(localStorage.getItem('clickedUserId'));
      users.forEach((e) => bodyFormData.append(`users${[]}`, e));
      await axios({
        method: 'post',
        params: {
          date: localStorage.getItem('ckickedDate'),
          userId: localStorage.getItem('clickedUserId'),
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
          setSelectValue([]);
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
    } else {
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
    }

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

    if (localStorage.getItem('role') === 'adminClicked') {
      await axios({
        method: 'post',
        url: ADDEventUrl,
        params: {
          date: localStorage.getItem('ckickedDate'),
          userId: localStorage.getItem('clickedUserId'),
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
    } else {
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
    }
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

  const FetchDateInfos = async () => {
    await axios({
      method: 'get',
      url: GetUserDateClickUrl,
      params: {
        userId: localStorage.getItem('myId'),
      },
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        const { data } = response;
        console.log(data);
        dispatch(HandleClickDateUser(data));
      })
      .catch((err) => {
        console.log('Err:', err);
      });
  };

  const options = [];
  if (userAction.allUsers.length > 0) {
    userAction.allUsers
      .filter((e) => e.id != localStorage.getItem('clickedUserId'))
      .map((e) => {
        const obj = {
          value: e.id,
          label: e.name,
        };
        options.push(obj);
      });
  }

  const MySelect = () => (
    <>
      <MultiSelect
        options={options}
        value={selectValue}
        onChange={setSelectValue}
        labelledBy="Foydalanuvchi tanlash"
        autoBlur={false}
      />
    </>
  );

  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    FetchDateInfos();
    localStorage.setItem('compare', compareDate());
  }, []);

  return (
    <>
      <div className="container">
        <div className="bg-white shadow-sm my-md-2 p-4 rounded">
          <div className="row align-items-center">
            <div className="col-md-6 text-start">
              <h1 className="pt-2 pb-4">Barcha ijrolar Ro'yhati</h1>
            </div>

            <div className="col-md-3 text-end">{userAction.clickedDate}</div>

            {localStorage.getItem('compare') == 'true' ? (
              <div className="col-md-3 text-end">
                <button
                  onClick={handleShow}
                  className="btn btn-opus d-flex justify-content-between align-items-center f-r"
                >
                  <AiOutlinePlus /> {t('tasks.addEvent')}
                </button>
              </div>
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
                      <th scope="row" className={e.isAdmin ? 'rib' : null}>
                        {e.id}
                      </th>
                      <td>{e.desc}</td>
                      <td className="iconDiv">
                        {e.attachments.length > 0 ? (
                          e.attachments.map((e, i) => (
                            <a
                              key={i}
                              href={globalURL + e.path}
                              target="_blank"
                              download
                            >
                              <span title={e.key}>
                                <FileIcon
                                  extension={e.ext}
                                  {...defaultStyles[e.ext]}
                                />
                              </span>
                            </a>
                          ))
                        ) : (
                          <p>{t('tasks.fileNo')}</p>
                        )}
                      </td>
                      <td>{e.start_date}</td>
                      <td>{e.end_date}</td>

                      <td className="sts">
                        <div
                          className={
                            e.status === 2
                              ? 'badge bg-warning'
                              : e.status === 1
                              ? 'badge bg-danger text-white'
                              : 'badge bg-success text-white'
                          }
                        >
                          {e.status === 2
                            ? t('calendar.bjdti')
                            : e.status === 1
                            ? t('calendar.bjdm')
                            : e.status === 3
                            ? t('calendar.bjd')
                            : t('calendar.no')}
                        </div>
                      </td>
                      <td className="history text-center ">
                        {e.history.length > 0 ? (
                          <>
                            <button
                              onClick={() => handleClickHist(e.history)}
                              className="btn btn-link btn-hist"
                            >
                              {e.history[e.history.length - 1].desc}
                            </button>
                          </>
                        ) : (
                          <p>{t('tasks.infoNo')}</p>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleClickPlus(e.id)}
                          className="btn btn-outline-opus d-flex justify-content-between align-items-center mx-auto"
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

            {localStorage.getItem('role') === 'adminClicked' ? (
              <div className=" py-2 ">
                <div>
                  <label className="form-label  text-dark">
                    {t('modal.eventName')}
                  </label>
                </div>

                <MySelect />
                <div className="fv-plugins-message-container invalid-feedback"></div>
              </div>
            ) : null}

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
          <Button type="button" variant="sec" onClick={handleClose}>
            {t('myacc.back')}
          </Button>
          <Button onClick={addEvent} variant="opus">
            {t('myacc.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Historyni  bosganda */}
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
            variant="sec"
            onClick={() => setClickDesc(false)}
          >
            {t('myacc.back')}
          </Button>
          <Button onClick={addDesc} variant="opus">
            {t('myacc.save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllTasksToday;
