from core import *
from datetime import datetime, timedelta
from sqlalchemy import or_,and_

@app.route("/login",methods=['POST'])
def login_a():
    email = request.form.get('email')
    password = request.form.get('password')
    print(request.form)
    user = User.query.filter(User.email==email).first()
    if user:
        ch = user.check_password(password)
        if ch:
            token = jwt.encode({
                'public_id': user.id,
                'exp' : datetime.utcnow() + timedelta(days = 100)
                    }, app.config['SECRET_KEY'],algorithm="HS256")
            print(token)
            return jsonify({"token" : token,"msg": "ok"}),200
        return jsonify({"msg": "incorrect"}), 401
    return jsonify({"msg": "not found"}), 404

@app.route("/ping", methods=['GET'])
@token_required
def ping(c):
    return "Post"

@app.route("/user", methods=['GET', 'POST'])
@token_required
def userdata(c):
    '''
    img
    department
    rank
    '''
    if request.method in ['OPTIONS', 'GET']:
        return c.format(),200    
    if request.method=='POST':
        u = User.query.get(c.id)
        u.name = request.form.get('name')
        u.email = request.form.get('email')
        u.role = request.form.get('role')
        u.image = request.form.get('image')
        u.department = request.form.get('department')
        u.rank = request.form.get('rank')

        db.session.commit()
        return u.format(),201
    return c.format(),200


@app.route("/newpass", methods=['POST'])
@token_required
def newpass(c):
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    u = User.query.get(c.id)
    if u.check_password(current_password):
        u.set_password(new_password)

        db.session.commit()
        return jsonify({"msg": "Success"}), 200
    else:
        return jsonify({"msg": "Incorrect password"}),405
@app.route("/user/tasks", methods=['GET'])
@token_required
def user_tasks(c):
    
    tasks = db.session.query(Task)\
        .join(Task_Meta, Task_Meta.task_id == Task.id)\
        .filter(or_(Task.owner_id == c.id, and_(Task_Meta.key == 'user_id',Task_Meta.value == str(c.id))))\
        .all()
    ret_data = []
    for task in tasks:
        T = task.format()
        T['attributes'] = [ x.format() for x in Task_Meta.query.filter(Task_Meta.task_id == task.id).all()]
        ret_data.append(T)
    return jsonify(ret_data)
