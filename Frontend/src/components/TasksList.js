import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const TasksList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state);
  const { userAction } = userInfo;
  console.log(userAction.clickDate);

  const tableData = async () => {
    // var bodyFormData = new FormData();
    // bodyFormData.append('image', file);
    await axios({
      method: 'get',
      url: 'http://26.175.162.142:5000/user/tasks',
      // url: GetUserInfoUrl,
      params: {
        date: userAction.clickDate,
      },
      headers: {
        'x-access-token': localStorage.getItem('userToken'),
      },
    })
      .then((response) => {
        console.log(response.data);
        const { data } = response;
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

  // useEffect(() => {
  //   tableData();
  // }, []);

  return (
    <div className="bg-white shadow-sm my-md-2">
      <h1>Tasklar ro'yhati</h1>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TasksList;
