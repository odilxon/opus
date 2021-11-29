import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogInUser } from '../../redux/actions/UserAction';
import { toast } from 'react-toastify';
import { LoginUrl } from '../../service';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state);
  const { user } = userInfo;

  const fetchUser = async (e) => {
    e.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.append('email', email);
    bodyFormData.append('password', password);
    //    .post('http://26.175.162.142:5000/login')
    //    .catch((e) => console.log('err', e));
    //  dispatch(aunthUser(response));
    //  console.log(response);

    if (!email || !password) {
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
      url: LoginUrl,
      // url: 'https://jsonplaceholder.typicode.com/posts',
      data: bodyFormData,
      // data: { email: email, password: password },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        const tokeen = response.data.token;
        // const tokeen = response.data.id;
        dispatch(LogInUser(tokeen));
        localStorage.setItem('userToken', tokeen);
        setEmail('');
        setPassword('');
      })
      .catch((err) => {
        console.log('Err:', err);
      });

    if (localStorage.getItem('userToken')) {
      navigate('/myAccount');

      return toast.success('Tabriklaymiz, Amal bajarildi', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      return toast.error('Login yoki parol xato!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      navigate('/myAccount');
    }
  }, [navigate]);
  return (
    <div className="LogIn">
      <div className="container">
        <h1 className="text-center py-5">Metronic</h1>
        <div className="bg-white rounded shadow-sm p-5 mx-auto">
          <form onSubmit={fetchUser}>
            <h2 className="text-center h3">Sign In to Metronic</h2>

            <div className=" py-2 ">
              <label className="form-label  text-dark">Email</label>

              <input
                className="form-control form-control-lg form-control-solid "
                type="email"
                name="email"
                placeholder="Placeholder"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="fv-plugins-message-container invalid-feedback"></div>
            </div>

            <div className=" py-2 ">
              <label className="form-label  text-dark">Password</label>

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
              <button className="btn btn-primary fw-bold"> Continue</button>
            </div>
          </form>
        </div>
      </div>

      <div className="links pb-5">
        <Link className="text-muted" to="/">
          About
        </Link>
        <Link className="text-muted" to="/">
          Contact
        </Link>
        <Link className="text-muted" to="/">
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default LogIn;
