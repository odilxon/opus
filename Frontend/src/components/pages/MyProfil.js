import React, { useEffect, useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { AiOutlineMail } from 'react-icons/ai';
import { TiArrowUpOutline, TiArrowDownOutline } from 'react-icons/ti';
import AccountImg from '../../assets/images/account.jpg';
import { MdOutlineModeEdit, MdOutlineClose } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetUserInfoUrl,
  globalURL,
  LoginUrl,
  PostPhotoUrl,
} from '../../service';

const MyProfil = () => {
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  // const [picteruUser, setPictureUser] = useState('');
  const [tel, setTel] = useState('');
  const [editProfil, setEditProfil] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state);

  const ChangeImage = async (e) => {
    const file = e.target.files[0];
    var bodyFormData = new FormData();
    bodyFormData.append('image', file);
    await axios({
      method: 'post',
      url: GetUserInfoUrl,
      data: bodyFormData,
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        console.log(response.data);
        const { data } = response;
        const dataLocal = {
          department: data.department,
          email: data.email,
          id: data.id,
          image: `${globalURL}/data.image`,
          name: data.name,
          rank: data.rank,
          role: data.role,
        };

        localStorage.setItem('userInfos', JSON.stringify(dataLocal));
      })
      .catch((err) => {
        console.log('Err:', err);
      });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.append('name', name);
    bodyFormData.append('fullName', fullName);
    bodyFormData.append('tel', tel);

    if (!name || !fullName || !tel) {
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
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        const { data } = response;
        console.log(response.data);
        setName('');
        setFullName('');
        setTel('');

        const dataLocal = {
          department: data.department,
          email: data.email,
          id: data.id,
          image: `${globalURL}/data.image`,
          name: data.name,
          rank: data.rank,
          role: data.role,
        };
        localStorage.setItem('userInfos', JSON.stringify(dataLocal));
        setEditProfil(false);

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

  const getUserInfo = async () => {
    await axios({
      method: 'get',
      url: GetUserInfoUrl,
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        const { data } = response;
        console.log(data);
        const dataLocal = {
          department: data.department,
          email: data.email,
          id: data.id,
          image: `${globalURL}/data.image`,
          name: data.name,
          rank: data.rank,
          role: data.role,
        };
        localStorage.setItem('userInfos', JSON.stringify(dataLocal));
      })
      .catch((err) => {
        console.log('Err:', err);
      });
  };

  // console.log(JSON.parse(localStorage.getItem('userInfos')));
  let infLocalS = JSON.parse(localStorage.getItem('userInfos'));

  // useEffect(() => {
  //   if (!localStorage.getItem('userToken') || !userlStorage) {
  //     navigate('/');
  //   }
  // }, [navigate, userlStorage]);
  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="container">
      <div className="userProfil bg-white rounded shadow-sm p-3 my-3">
        <div className="row">
          <div className="userInfo col-md-3">
            <img
              src={
                infLocalS.image.slice(
                  infLocalS.image.length - 10,
                  infLocalS.image.length
                ) !== 'data.image'
                  ? infLocalS.image
                  : AccountImg
              }
              alt="random"
              className="img-fluid rounded"
            />
          </div>
          <div className="infos col-md-9">
            <h1 className="h2">
              {/* {userlStorage.name} */}
              {infLocalS.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10.0813 3.7242C10.8849 2.16438 13.1151 2.16438 13.9187 3.7242V3.7242C14.4016 4.66147 15.4909 5.1127 16.4951 4.79139V4.79139C18.1663 4.25668 19.7433 5.83365 19.2086 7.50485V7.50485C18.8873 8.50905 19.3385 9.59842 20.2758 10.0813V10.0813C21.8356 10.8849 21.8356 13.1151 20.2758 13.9187V13.9187C19.3385 14.4016 18.8873 15.491 19.2086 16.4951V16.4951C19.7433 18.1663 18.1663 19.7433 16.4951 19.2086V19.2086C15.491 18.8873 14.4016 19.3385 13.9187 20.2758V20.2758C13.1151 21.8356 10.8849 21.8356 10.0813 20.2758V20.2758C9.59842 19.3385 8.50905 18.8873 7.50485 19.2086V19.2086C5.83365 19.7433 4.25668 18.1663 4.79139 16.4951V16.4951C5.1127 15.491 4.66147 14.4016 3.7242 13.9187V13.9187C2.16438 13.1151 2.16438 10.8849 3.7242 10.0813V10.0813C4.66147 9.59842 5.1127 8.50905 4.79139 7.50485V7.50485C4.25668 5.83365 5.83365 4.25668 7.50485 4.79139V4.79139C8.50905 5.1127 9.59842 4.66147 10.0813 3.7242V3.7242Z"
                  fill="#00A3FF"
                ></path>
                <path
                  className="permanent"
                  d="M14.8563 9.1903C15.0606 8.94984 15.3771 8.9385 15.6175 9.14289C15.858 9.34728 15.8229 9.66433 15.6185 9.9048L11.863 14.6558C11.6554 14.9001 11.2876 14.9258 11.048 14.7128L8.47656 12.4271C8.24068 12.2174 8.21944 11.8563 8.42911 11.6204C8.63877 11.3845 8.99996 11.3633 9.23583 11.5729L11.3706 13.4705L14.8563 9.1903Z"
                  fill="white"
                ></path>
              </svg>
            </h1>
            <p className="text-muted">
              <span>
                <MdAccountCircle /> Developer
              </span>
              <span>
                <MdAccountCircle /> Developer
              </span>
              <span>
                <AiOutlineMail /> Developer
              </span>
            </p>
            <div className="row">
              <div className="col-md-4 col-lg-3">
                <div className="progres border  border-dashed rounded py-3 px-4  mb-3">
                  <div className="d-flex align-items-center ">
                    <TiArrowUpOutline color="#50cd89" />
                    <div className="fs-2 fw-bolder counted">$4,500</div>
                  </div>
                  <p className="text-muted h5">Earnings</p>
                </div>
              </div>

              <div className="col-md-4 col-lg-3">
                <div className="progres border  border-dashed rounded py-3 px-4  mb-3">
                  <div className="d-flex align-items-center ">
                    <TiArrowDownOutline color="#f3527a" />
                    <div className="fs-2 fw-bolder counted">75</div>
                  </div>
                  <p className="text-muted h5">projects</p>
                </div>
              </div>

              <div className="col-md-4 col-lg-3">
                <div className="progres border  border-dashed rounded py-3 px-4  mb-3">
                  <div className="d-flex align-items-center ">
                    <TiArrowUpOutline color="#50cd89" />
                    <div className="fs-2 fw-bolder counted">60%</div>
                  </div>
                  <p className="text-muted h5">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profilDetails bg-white rounded shadow-sm py-3 my-3">
        <div className="card_header px-5 pt-2 pb-1">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-6 col-lg-4">
              <h2 className="h3">Profile Details</h2>
            </div>
            <div className="col-md-6 col-lg-4 text-end">
              <button
                onClick={() => setEditProfil(!editProfil)}
                className="btn btn-primary"
              >
                Edit Profil
              </button>
            </div>
          </div>
        </div>

        {editProfil ? (
          <>
            <hr />
            <div className="detail px-4">
              <form onSubmit={submitEdit}>
                <div className="row my-3 mt-lg-4">
                  <div className="col-lg-4  form-label">
                    <label htmlFor="pic">Avatar</label>
                  </div>
                  <div className="col-lg-8 image-input">
                    <div
                      className="image-wrapper"
                      style={{ backgroundImage: `url(${AccountImg})` }}
                    >
                      <label
                        className="edit-icon icon-pic shadow"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="edit Image"
                        htmlFor="pic"
                        onChange={ChangeImage}
                      >
                        <MdOutlineModeEdit />
                        <input
                          id="pic"
                          type="file"
                          name="avatar"
                          accept=".png, .jpg, .jpeg"
                        />
                      </label>
                      <div
                        className="close-icon icon-pic shadow"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="Remove Image"
                      >
                        <MdOutlineClose />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 form-label mt-lg-3">
                    <label htmlFor="name">Full Name</label>
                  </div>
                  <div className="col-lg-8 image-input">
                    <div className="row mt-lg-3">
                      <div className="col-lg-6 my-2">
                        <input
                          className="form-control form-control-lg form-control-solid "
                          type="text"
                          name="name"
                          placeholder="Placeholder"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          id="name"
                        />
                      </div>
                      <div className="col-lg-6 my-2">
                        <input
                          className="form-control form-control-lg form-control-solid "
                          type="text"
                          name="fullname"
                          placeholder="Placeholder"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 form-label mt-lg-3">
                    <label htmlFor="tel">Contact number</label>
                  </div>
                  <div className="col-lg-8 image-input">
                    <div className="row mt-lg-3">
                      <div className=" my-2">
                        <input
                          className="form-control form-control-lg form-control-solid "
                          type="tel"
                          name="tel"
                          placeholder="Placeholder"
                          value={tel}
                          onChange={(e) => setTel(e.target.value)}
                          id="tel"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />

                <div className="row my-3 mt-lg-4 align-items-center justify-content-end">
                  <div className="col-md-4 text-end">
                    <button type="reset" className="btn btn-account me-2">
                      Discard
                    </button>
                    <button className="btn btn-primary">Save changes</button>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : null}
      </div>

      <div className="profilDetails bg-white rounded shadow-sm py-3 my-3">
        <div className="detail px-4">
          <div className="row my-3 mt-lg-4 align-items-center justify-content-between">
            <div className="col-6 col-lg-5">
              <h3 className="h4">Passwpord</h3>
              <p className="text-muted">asadbekazamov@gmail.com</p>
            </div>
            <div className="col-md-6 col-lg-4 text-end">
              <Link to="/changePassword" className="btn btn-account">
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfil;
