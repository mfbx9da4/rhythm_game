import webapp2
import hashlib
import random
import string
from google.appengine.ext import db
from google.appengine.api import mail
from object_models import BaseHandler
from webapp2_extras import sessions
from emailValidator import isEmailAddressValid
from google.appengine.api import mail
from userDB import User

class SignUp(BaseHandler):
    def get(self):
        self.render('signup.html')


class Logout(BaseHandler):
	def get(self):
		if self.isLoggedIn():
			self.session.delete('user')

class Login(BaseHandler):
	def get(self):
		self.render('login.html')

	def post(self):
		if self.request.get('username') and self.request.get('password'):
			username = self.request.get('username')
			password = self.request.get('password')
			user_query = User.all().filter('username =', username)
			users = user_query.fetch(2)
			if len(users) == 1:
				user = users[0]
				hash = hashlib.sha256(password + user.salt)
				hashed_passwword = hash.hexdigest()
				if user.password == hashed_passwword:
					self.session['user'] = user.username
					if self.session.get('redirect'):
						self.redirect(self.session.get('redirect'))
					else:
						self.redirect('/home')
				else:
					self.write('Wrong password or username')
			else:
				usersname = ''.join( user.username for user in users)
				self.write('Wrong password or username: ' + str(len(users)) + usersname )
		else:
			self.write('A technical problem occured')

class CreateUser(BaseHandler):

	def sendValidationCode(self, username, to, code):
		confirmation_url = 'http://rhythmludus.appspot.com//validation?username='+username+'&code='+code
		sender_address = "Rhythmludus Support <support@rhythmludus.appspotmail.com>"
		subject = "Confirm your address email"
		body = "Thank you for creating an account! Please confirm your email address by clicking on the link below: " + confirmation_url
		mail.send_mail(sender_address, to, subject, body)

	def checkRequestArguments(self):
		if not self.request.get('username'): 
			self.validation.setInvalid()
			self.validation.addErrorMessage('The username field is compulsory')
		if not self.request.get('password'):
			self.validation.setInvalid()
			self.validation.addErrorMessage('The password field is compulsory')
		if not self.request.get('password1'): 
			self.validation.setInvalid()
			self.validation.addErrorMessage('The repeat password field is compulsory')
		if not self.request.get('email'):
			self.validation.setInvalid()
			self.validation.addErrorMessage('The email field is compulsory')

	def checkPasswordsValidity(self, password, password1):
		#Check the passwords are equals:
		if password1 != password:
			self.validation.setInvalid()
			self.validation.addErrorMessage('The 2 passwords are different.')
		
		#Check the length of the passwords:
		if len(password) < 6:
			self.validation.setInvalid()
			self.validation.addErrorMessage('The password must be at least 6 characters long.')

	def checkEmail(self, email):
		#Chech validity of address email:
		if not isEmailAddressValid(email):
			self.validation.setInvalid()
			self.validation.addErrorMessage('Address email invalid.')

		# Check the username is not already in use:
		user_query = User.all().filter('email =', email)
		email = user_query.fetch(1)
		if len(email) != 0:
			self.validation.setInvalid()
			self.validation.addErrorMessage('The email is already in use.')

	def checkUsername(self, username):
		#Check the length of the username:
		if len(username) < 6:
			self.validation.setInvalid()
			self.validation.addErrorMessage('The username must be at least 6 characters long.')

		# Check the username is not already in use:
		user_query = User.all().filter('username =', username)
		users = user_query.fetch(1)
		if len(users) != 0:
			self.validation.setInvalid()
			self.validation.addErrorMessage('The username is already in use.')



	def post(self):
		self.validation = FieldValidation()
		self.checkRequestArguments()

		if self.validation.isValid():
			username = self.request.get('username')
			email = self.request.get('email')
			password = self.request.get('password')
			password1 = self.request.get('password1')

			self.checkEmail(email)
			self.checkPasswordsValidity(password, password1)
			self.checkUsername(username)

			if self.validation.isValid():
				len_salt = 30
				salt = ''.join(random.choice(string.letters) for s in range(len_salt))
				hash = hashlib.sha256(password + salt)
				hashed_passwword = hash.hexdigest()
				len_code = 30
				code = ''.join(random.choice(string.letters) for s in range(len_code))
				user = User( code = code, key_name= username, username = username, password = hashed_passwword, salt = salt, email = email )
				user.put();
				self.sendValidationCode(username, email, code)
				self.write('Succesfully signed up')
			else:
				self.write(self.validation.getMessage())				
		else:
			self.write('A technical problem occured')


class FieldValidation:
	def __init__(self):
		self.message = ''
		self.valid = True

	def setInvalid(self):
		self.valid = False

	def addErrorMessage(self, message):
		self.message += ( '</br>' + message )

	def getMessage(self):
		return self.message

	def isValid(self):
		return self.valid