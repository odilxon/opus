import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { LogInUser } from '../../redux/actions/UserAction';
import { toast } from 'react-toastify';
import { NewPassUrl } from '../../service';
// import { LoginUrl } from '../../service';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showpass, setShowpass] = useState(false);

  // const dispatch = useDispatch();
  // const userInfo = useSelector((state) => state);

  const navigate = useNavigate();
  const userInfo = useSelector((state) => state);

  const { userAction } = userInfo;
  console.log(userInfo);

  const editPassword = async (e) => {
    e.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.append('current_password', currentPassword);
    bodyFormData.append('new_password', password);

    if (!currentPassword || !password) {
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
    if (currentPassword === password) {
      return toast.warning("Parol o'zgarishsiz qoldi", {
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
      url: NewPassUrl,
      data: bodyFormData,
      headers: { 'x-access-token': localStorage.getItem('userToken') },
    })
      .then((response) => {
        console.log(response);
        setCurrentPassword('');
        setPassword('');

        navigate('/myAccount');
        return toast.success('Amal bajarildi', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
  };

  // useEffect(() => {
  //   if (!localStorage.getItem('userToken')) {
  //     navigate('/');
  //   }
  // }, [navigate]);
  return (
    <div className="LogIn">
      <div className="container">
        <h1 className="text-center py-3">Metronic</h1>
        <div className="bg-white rounded shadow-sm p-5 mx-auto mb-2">
          <form onSubmit={editPassword}>
            <h2 className="text-center h3">Change Password</h2>

            <div className=" py-2 ">
              <label className="form-label  text-dark">Email</label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="email"
                name="email"
                placeholder="Placeholder"
                value={userAction.userInfos.email}
                aria-label="Disabled input"
                disabled={true}
                readOnly
              />

              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className=" py-2 ">
              <label htmlFor="lastpass" className="form-label  text-dark">
                Current Password
              </label>

              <input
                className="form-control form-control-lg form-control-solid disabled"
                type={showpass ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                id="lastpass"
              />
              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>
            <div className=" py-2 ">
              <label htmlFor="newpass" className="form-label  text-dark">
                New Password
              </label>

              <input
                className="form-control form-control-lg form-control-solid disabled"
                type={showpass ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="newpass"
              />
              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className=" py-2 ">
              <label className="form-label  text-dark">
                <input
                  type="checkbox"
                  checked={showpass}
                  onChange={() => setShowpass(!showpass)}
                />
                {'   '} Show password
              </label>
              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className="py-2 pt-3 d-grid gap-2">
              <Link to="/myAccount" className="btn btn-secondary fw-bold">
                Back
              </Link>
              <button className="btn  btn-primary fw-bold">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
