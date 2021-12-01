import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { CdataUrl } from '../service';

const TasksList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state);
  const { userAction } = userInfo;
  console.log(userAction.clickDate);

  // const tableData = async () => {
  //   // var bodyFormData = new FormData();
  //   // bodyFormData.append('image', file);
  //   await axios({
  //     method: 'get',
  //     url: CdataUrl,
  //     // url: GetUserInfoUrl,
  //     params: {
  //       date: userAction.clickDate,
  //     },
  //     headers: {
  //       'x-access-token': localStorage.getItem('userToken'),
  //     },
  //   })
  //     .then((response) => {
  //       console.log(response.data);
  //       const { data } = response;
  //       // const dataLocal = {
  //       //   department: data.department,
  //       //   email: data.email,
  //       //   id: data.id,
  //       //   image: data.image,
  //       //   name: data.name,
  //       //   rank: data.rank,
  //       //   role: data.role,
  //       // };
  //       // localStorage.setItem('UserInfos', JSON.stringify(dataLocal));
  //     })
  //     .catch((err) => {
  //       console.log('Err:', err);
  //     });
  // };

  // useEffect(() => {
  //   tableData();
  // }, []);

  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <div className="container">
      <div className="bg-white shadow-sm my-md-2 p-4 rounded">
        <div className="row align-items-center">
          <div className="col-md-6 text-start">
            <h1 className="pt-2 pb-4">Tasklar ro'yhati</h1>
          </div>

          {userAction.clickedDate ? (
            <div className="col-md-6 text-end">{userAction.clickedDate}</div>
          ) : null}
        </div>
        {userAction.clickDate ? (
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
                  <td>{e.start_date}</td>
                  <td>{e.end_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2 className="text-center py-2 h4">
            Bu sanada hech qanday ma'lumot yo'q...
          </h2>
        )}
      </div>
    </div>
  );
};

export default TasksList;
