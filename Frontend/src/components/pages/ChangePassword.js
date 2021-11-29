import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogInUser } from '../../redux/actions/UserAction';
import { toast } from 'react-toastify';
import { LoginUrl } from '../../service';

const ChangePassword = () => {
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state);

  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <div className="LogIn">
      <div className="container">
        <h1 className="text-center py-3">Metronic</h1>
        <div className="bg-white rounded shadow-sm p-5 mx-auto">
          <form
          //   onSubmit={fetchUser}
          >
            <h2 className="text-center h3">Change Password</h2>

            <div className=" py-2 ">
              <label className="form-label  text-dark">Email</label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="email"
                name="email"
                placeholder="Placeholder"
                value="Mail.com"
                aria-label="Disabled input "
                disabled={true}
                readOnly
              />

              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className=" py-2 ">
              <label className="form-label  text-dark">Last Password</label>

              <input
                className="form-control form-control-lg form-control-solid disabled"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className=" py-2 ">
              <label className="form-label  text-dark">Last Password 2</label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
