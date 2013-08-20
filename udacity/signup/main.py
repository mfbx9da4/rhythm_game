"""The form elements where the user inputs their username, 
password, password again, and email address must be named 
"username", "password", "verify", and "email", respectively. The form
method must be POST, not GET. Upon invalid user input, your web
app should re-render the form for the user. Upon valid user input
, your web app should redirect to a welcome page for the user. You must enter the full
url into the supplied textbox above, including the path. For example, our example app is
running at http://udacity-cs253.appspot.com/unit2/signup, but if we instead only entered 
http://udacity-cs253.appspot.com/
then the grading script would not work.

Username: "^[a-zA-Z0-9_-]{3,20}$" Password: "^.{3,20}$" Email: "^[\S]+@[\S]+\.[\S]+$"
Example code for validating a username is as follows:

  import re
  USER_RE = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
  def valid_username(username):
    return USER_RE.match(username)

"""

import os
import re

import webapp2
import jinja2

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir),
                               autoescape=True)



def render_str(template, **params):
    t = jinja_env.get_template(template)
    return t.render(params)

class BaseHandler(webapp2.RequestHandler):
    def render(self, template, **kw):
        self.response.out.write(render_str(template, **kw))

    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)


USER_RE = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
def valid_username(username):
	if not USER_RE.match(username):
		return 'invalid uname'
	else:
		return ''

PWD_RE = re.compile(r"^.{3,20}$")
def valid_pwd(pwd):
	if not PWD_RE.match(pwd):
		return 'invlaid pwd', PWD_RE.match(pwd), pwd
	else:
		return ''

def valid_verify(verify, pwd, pwd_err):
	if not pwd_err:
		if not verify == pwd:
			return 'not matching pwds'
		else: 
			return ''
	else: 
		return ''

EMAIL_RE = re.compile(r"^[\S]+@[\S]+\.[\S]+$")
def valid_email(email):
	if email:
		if not EMAIL_RE.match(email):
			return 'invalid email'
		else:
			return ''


class SignupHandler(BaseHandler):
	def get(self):
		self.render('signup.html')

	def post(self):
		params = {}
		params['uname'] = self.request.get('username')
		params['uname_error'] = valid_username(params['uname'])
		params['pwd'] = self.request.get('password')
		params['pwd_error'] = valid_pwd(params['pwd'])
		params['verify'] = self.request.get('verify')
		params['verify_error'] = valid_verify(params['verify'], params['pwd'], params['pwd_error'])
		params['email'] = self.request.get('email')
		params['email_error'] = valid_email(params['email'])
		if params['email_error'] == params['verify_error'] == params['uname_error'] == '':
			self.redirect('/welcome', username=params['uname'])
		else:
			self.render('signup.html', **params)


class ThanksHandler(webapp2.RequestHandler):
    def get(self):
    	uname = self.request.get('username')
        self.response.out.write("Welcome, " + uname)

