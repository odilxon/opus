from datetime import datetime
from flask import *
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy import Date
from sqlalchemy.orm import backref, relationship, selectinload
from sqlalchemy.sql.elements import False_
from sqlalchemy.sql.sqltypes import TIMESTAMP
from werkzeug.security import generate_password_hash, check_password_hash
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from hashlib import sha256
app = Flask(__name__)
app.config.from_object('config.main')

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), unique=True)
    role = db.Column(db.String(100), nullable=True)
    image = db.Column(db.String(500), nullable=True)
    department = db.Column(db.String(500), nullable=True)
    rank = db.Column(db.String(500), nullable=True)
    password = db.Column(db.String(500))
    tasks = db.relationship("Task_History", backref='user')
    owner_ids = db.relationship("Task", backref='user')
    def set_password(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)
    def format(self):
        return {
            "id" : self.id,
            "name" : self.name,
            "email" : self.email,
            "role" : self.role,
            "image" : self.image,
            "department" : self.department,
            "rank" : self.rank,
        }
    def __repr__(self):
        return "%s"%self.name

class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_table = db.Column(db.Date, nullable=False)
    desc = db.Column(db.String, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    task_metas = db.relationship("Task_Meta", backref='task')
    task_histories = db.relationship("Task_History", backref='task')
    def format(self):
        return {
            "id" : self.id,
            "start_date" : str(self.start_date),
            "end_date" : str(self.end_table),
            "desc" : self.desc,
            "status" : self.status,
            "owner_id" : self.owner_id,
        }

class Task_Meta(db.Model):
    __tablename__ = 'task_meta'
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String, nullable=False)
    value = db.Column(db.String, nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    def format(self):
        return {
            "id" : self.id,
            "key" : self.key,
            "value" : self.value
        }

class Task_History(db.Model):
    __tablename__ = 'task_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    desc = db.Column(db.String, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default = datetime.now)
    def format(self):
        return {
            "id" : self.id,
            "user_name" : self.user.name,
            "user_depart" : self.user.department,
            "desc" : self.desc,
            "timestamp" : self.timestamp.timestamp()
        }

class Attachment(db.Model):
    __tablename__ = 'attachment'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, nullable=False)
    type_id = db.Column(db.Integer, nullable=False)
    path = db.Column(db.String, nullable=False)

    def format(self):
        return {
            'id' : self.id,
            'type' : self.type,
            'type_id' : self.type_id,
            'path' : self.path,
            'ext': self.path.rsplit('.',1)[-1]
    }

admin = Admin(app, name='microblog', template_mode='bootstrap4')
admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Task, db.session))
admin.add_view(ModelView(Task_Meta, db.session))
admin.add_view(ModelView(Task_History, db.session))
admin.add_view(ModelView(Attachment, db.session))