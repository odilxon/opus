from app import *

def Create_DB():
    db.create_all()

def Drop_DB():
    db.drop_all()

def admins():
    u = User(name='admin', email='admin@admin.uz', role="admin")
    u.set_password('admin')
    db.session.add(u)
    db.session.commit()

Create_DB()
admins()