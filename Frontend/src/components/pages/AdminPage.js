import React from 'react';
import { Container } from 'react-bootstrap';
import AdminCard from '../AdminCard';
import AccountImg from '../../assets/images/account.png';

const AdminPage = () => {
  return (
    <Container>
      <div className="bg-white rounded shadow-sm p-3 my-3">
        <div className="text-start">
          <h2>Admin panel</h2>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <AdminCard pic={AccountImg} title="lorem ipsum" rank="admin" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AdminPage;
