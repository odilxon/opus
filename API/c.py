from app import *

def Create_DB():
    db.create_all()

def Drop_DB():
    db.drop_all()

def admins():
    u = User(name='admin', email='radmin@admin.uz', role="admin")
    u.set_password('admin')
    db.session.add(u)
    db.session.commit()
Drop_DB()
Create_DB()
admins()