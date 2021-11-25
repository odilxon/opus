from core import *
from wtforms import *
from flask_wtf import FlaskForm
from wtforms.validators import *

class LoginForm(FlaskForm):
    username = StringField('username', [DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])
    remember_me = BooleanField("Remember")