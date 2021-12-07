from models import *
from functools import wraps

import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
  
        try:
            # decoding the payload to fetch the stored details
            print(token)
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            print(data)
            current_user = User.query\
                .filter_by(id = data['public_id'])\
                .first()
        except Exception as E:
            return jsonify({
                'message' : str(E)
            }), 401
        # returns the current logged in users contex to the routes
        return  f(current_user, *args, **kwargs)
  
    return decorated
@app.after_request
def after_request(response):
    header = response.headers
    header.add('Access-Control-Allow-Origin', '*')
    header.add('Access-Control-Allow-Headers', '*')
    header.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

@app.route('/uploads/<path:path>')
def send_uploads(path):
    return send_from_directory('uploads', path)