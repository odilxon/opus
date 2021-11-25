from core import *
from datetime import datetime, timedelta


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
    if request.method=='POST':
        u = User.query.get(c.id)
        u.name = request.form.get('name')

        db.session.commit()
        return u.format(),201
    return c.format(),200


@app.route("/newpass", methods=['POST'])
@token_required
def newpass(c):
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    if c.check_password(current_password):
        c.password = c.set_password(new_password)
        db.session.commit()
        return jsonify({"msg": "Success"}), 200
    else:
        return jsonify({"msg": "Incorrect password"}),405