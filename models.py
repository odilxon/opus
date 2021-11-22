from flask import *
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin,LoginManager, login_manager, login_required, current_user, login_user, logout_user
from sqlalchemy import Date
from sqlalchemy.orm import backref, relationship, selectinload
from sqlalchemy.sql.elements import False_

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:admin@127.0.0.1:5432/opus"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'magnum-opus'

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login_page'

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(500))
    role = db.Column(db.String(100), nullable=True)
    tasks = db.relationship("Task", backref='user')
    tasks = db.relationship("Task_History", backref='user')

class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_table = db.Column(db.DateTime, nullable=False)
    desc = db.Column(db.String, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    task_metas = db.relationship("Task_Meta", backref='task')
    task_metas = db.relationship("Task_History", backref='task')

class Task_Meta(db.Model):
    __tablename__ = 'task_meta'
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String, nullable=False)
    value = db.Column(db.String, nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)

class Task_History(db.Model):
    __tablename__ = 'task_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    desc = db.Column(db.String, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False)

class Attachment(db.Model):
    __tablename__ = 'attachment'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Integer, nullable=False)
    type_id = db.Column(db.Integer, nullable=False)
    path = db.Column(db.String, nullable=False)
