from models import *
from functools import wraps
import jwt, requests

class SMS:
    def __init__(self, app) -> None:
        self.LOGIN = app.config.get('SMS_LOGIN')
        self.PASS = app.config.get('SMS_PASS')
        self.URL = app.config.get('SMS_URL')
        if None in [self.LOGIN, self.PASS, self.URL]:
            raise AttributeError('SMS credentials are not set')
        self.EXAMPLE = json.loads('''{ "messages": [ { "recipient":"998932446330", "message-id":"opus000000001", "sms":{ "originator": "3700", "content": { "text": "Test message" } } } ] }''')
    def Send(self, reciver:str, message:str) -> int:
        """[summary]

        Args:
            reciver (str): Phone number of person +9989XAAABBCC
            message (str): Body of message to send

        Returns:
            (int): Returns status code of request if 200 then it is sent
        """
        if not(type(reciver) == str and len(reciver) == 13):
            return 404 
        if not("+" == reciver[0] and "+9989" in reciver):
            return 404
        body = self.EXAMPLE
        body['messages'][0]['sms']['content']['text'] = message
        body['messages'][0]['recipient'] = reciver
        session = requests.Session()
        session.auth = (self.LOGIN, self.PASS)
        send = session.post(self.URL, json=body)
        return send.status_code
    def Task_create(self, reciver:str, task_id:int) -> int:
        msg = "Сизга янги вазифа яратилди #%s. IJRO.AGRO.UZ"%(task_id)
        return self.Send(reciver,msg)

sms = SMS(app)

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
    return send_from_directory('uploads', path, as_attachment=True)

def HASH_FILE(filename):
    print(filename)
    name , ext = filename.rsplit('.',1)
    sha = sha256(name.encode()).hexdigest()
    return "%s.%s"%(sha,ext)

    