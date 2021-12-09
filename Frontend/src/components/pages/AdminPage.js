import React, { useEffect, useState } from 'react';
import AdminCard from '../AdminCard';
import { Link, useNavigate } from 'react-router-dom';
import AccountImg from '../../assets/images/account.png';
import { Container, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { HandleAllUsers } from '../../redux/actions/UserAction';
import { AllUSerUrl, globalURL, UserAddUrl } from '../../service';
import axios from 'axios';

import { useTranslation } from 'react-i18next';

const AdminPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [role, setRole] = useState('');
  const [deport, setDeport] = useState('');
  const [rank, setRank] = useState('');
  const [password, setPassword] = useState('');
  const [checkPass, setCheckPass] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state);
  const { userAction } = userInfo;

  const clickedCard = (id) => {
    localStorage.setItem('clickedUserId', id);
    localStorage.setItem('role', 'adminClicked');
    navigate('/calendar');
  };

  const addUser = async (e) => {
    e.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.append('name', name);
    bodyFormData.append('email', email);
    bodyFormData.append('role', 'user');
    bodyFormData.append('department', deport);
    bodyFormData.append('rank', rank);
    bodyFormData.append('password', password);
    await axios({
      method: 'post',
      url: UserAddUrl,
      data: bodyFormData,
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        const { data } = response;
        console.log(data);
        setName('');
        setPassword('');
        setRank('');
        // setRole('');
        setEmail('');
        setDeport('');
        setCheckPass('');
        setShowModal(false);
        getAllUser();
      })
      .catch((err) => {
        console.log('Err:', err);
      });
  };

  const back = () => {
    setName('');
    setPassword('');
    setRank('');
    // setRole('');
    setEmail('');
    setDeport('');
    setCheckPass('');
    setShowModal(false);
  };

  const getAllUser = async () => {
    await axios({
      method: 'get',
      url: AllUSerUrl,
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        const { data } = response;
        console.log(data);
        dispatch(HandleAllUsers(data));
      })
      .catch((err) => {
        console.log('Err:', err);
      });
  };

  useEffect(() => {
    getAllUser();

    if (localStorage.getItem('role') !== 'admin') {
      navigate('/calendar');
    }
  }, []);
  return (
    <Container>
      <div className="bg-white rounded shadow-sm p-3 p-md-4 my-3">
        <div className="row">
          <div className="col-md-7">
            <h2>{t('admin.title')}</h2>
          </div>
          <div className="col-md-5 text-end">
            <button
              onClick={() => {
                setShowModal(!showModal);
              }}
              className="btn btn-opus"
            >
              {t('admin.addUser')}
            </button>
          </div>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title> {t('admin.addUser')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={addUser} className="p-3">
              <div className=" py-2 ">
                <label className="form-label  text-dark">
                  {t('admin.email')}
                </label>

                <input
                  className="form-control form-control-lg form-control-solid "
                  type="email"
                  name="email"
                  placeholder={t('admin.emailplc')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className=" py-2 ">
                <label className="form-label  text-dark">
                  {t('admin.name')}
                </label>

                <input
                  className="form-control form-control-lg form-control-solid "
                  type="text"
                  name="name"
                  placeholder={t('admin.nameplc')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* <div className=" py-2 ">
                <label className="form-label  text-dark">Role</label>

                <input
                  className="form-control form-control-lg form-control-solid "
                  type="text"
                  name="role"
                  placeholder="name"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div> */}
              <div className=" py-2 ">
                <label className="form-label  text-dark">
                  {t('admin.depart')}
                </label>

                <input
                  className="form-control form-control-lg form-control-solid "
                  type="text"
                  name="depart"
                  placeholder={t('admin.departplc')}
                  value={deport}
                  onChange={(e) => setDeport(e.target.value)}
                />
              </div>
              <div className=" py-2 ">
                <label className="form-label  text-dark">
                  {t('admin.rank')}
                </label>

                <input
                  className="form-control form-control-lg form-control-solid "
                  type="text"
                  name="Rank"
                  placeholder={t('admin.rankplc')}
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                />
              </div>
              <div className=" py-2 ">
                <label className="form-label  text-dark">
                  {t('chpass.npass')}
                </label>

                <input
                  className="form-control form-control-lg form-control-solid "
                  type={checkPass ? 'text' : 'password'}
                  name="password"
                  placeholder={t('chpass.npassplc')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className=" py-2 ">
                <label className="form-label  text-dark">
                  <input
                    type="checkbox"
                    checked={checkPass}
                    onChange={() => setCheckPass(!checkPass)}
                    
                  />
                  {'   '} {t('chpass.checkpass')}
                </label>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant='sec'   onClick={back}>
              {t('tasks.back')}
            </Button>
            <Button onClick={addUser}  variant='opus'>
              {t('admin.save')}
            </Button>
          </Modal.Footer>
        </Modal>
        <hr />
        {userAction.allUsers.length > 0 ? (
          <div className="row">
            {userAction.allUsers.map((e, i) => (
              <div
                onClick={() => clickedCard(e.id)}
                key={i}
                className="col-md-6 col-lg-4 col-xl-3"
              >
                <AdminCard
                  pic={
                    e.image && e.image !== 'no'
                      ? globalURL + e.image
                      : AccountImg
                  }
                  title={e.name}
                  rank={e.department}
                />
              </div>
            ))}
          </div>
        ) : (
          <h2 className="text-center">Foydalanuvchi yo'q</h2>
        )}
      </div>
    </Container>
  );
};

export default AdminPage;
