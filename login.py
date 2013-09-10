import webapp2
import hashlib
import hmac
import random
import string
from google.appengine.ext import db
from google.appengine.api import mail
from object_models import BaseHandler
from webapp2_extras import sessions
from emailValidator import isEmailAddressValid
from google.appengine.api import mail
from userDB import User
from userDB import EmailUser
from userDB import FBUser
from string import maketrans
import base64
import json
import urllib2
import urllib
import re

facebookSecret= '30b536df7633cc10c255ec66d73090fd'

class FBSignUp(BaseHandler):
	def get(self):
		parameter = {}
		if self.request.get('errorMessage'):
			parameter['message'] = self.request.get('errorMessage')
		self.response.write( self.render_template_arg('facebook_sign_up.html', parameter))

class SignUp(BaseHandler):
    def get(self):
        self.response.write( self.render_template('signup.html') )


class Logout(BaseHandler):
	def get(self):
		if self.isLoggedIn():
			self.session.pop('user')
		return self.redirect('/home')

class Login(BaseHandler):
	def get(self):
		self.response.write(self.render_template('login.html'))

	def post(self):
		if self.request.get('username') and self.request.get('password'):
			username = self.request.get('username')
			password = self.request.get('password')
			user_query = EmailUser.all().filter('username =', username)
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
				user = User( key_name= username, username = username,  email = email, userType = 1 )
				user.put()
				emailUser = EmailUser( key_name= username, username = username, password = hashed_passwword, salt = salt, code = code )
				emailUser.put()
				self.sendValidationCode(username, email, code)
				self.write('Succesfully signed up')
			else:
				self.write(self.validation.getMessage())				
		else:
			self.write('A technical problem occured')

class FBEndPoint(SignUp):
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

	def checkUserID(self, userID):
		# Check the username is not already in use:
		user_query = FBUser.all().filter('userID =', userID)
		id = user_query.fetch(1)
		if len(id) != 0:
			self.validation.setInvalid()
			self.validation.addErrorMessage('The facebook account is already registered.')

	def get(self):
		code = self.request.get('code')
		url = "https://graph.facebook.com/oauth/access_token?client_id=539751139430183&redirect_uri=https%3A%2F%2Frhythmludus.appspot.com%2Ffb_endpoint&client_secret=30b536df7633cc10c255ec66d73090fd&code="+code
		response = urllib2.urlopen(url).read()
		regex = "^access_token=(.+)&expires=(.+)$"
		regexResult = re.search(regex, response)
		if regexResult:
			oauthtoken = str(regexResult.group(1))
			expireDate= int(regexResult.group(2))

			urlAppToken = "https://graph.facebook.com/oauth/access_token?client_id=539751139430183&client_secret="+facebookSecret+"&grant_type=client_credentials"
			responseAppToken = urllib2.urlopen(urlAppToken).read()
			regexAppToken = "^access_token=(.+)$"
			appToken = re.search(regexAppToken, responseAppToken).group(1)

			urlUserId = "https://graph.facebook.com/debug_token?input_token="+oauthtoken+"&access_token="+appToken
			responseUserID = urllib2.urlopen(urlUserId).read()

			userData = json.loads(responseUserID)
			userID = userData['data']['user_id']
			user_query = FBUser.all().filter('userID = ', userID)
			users = user_query.fetch(2)
			if len(users) == 1:
				user = users[0]
				self.session['user'] = user.username
				if self.session.get('redirect'):
					self.redirect(self.session.get('redirect'))
				else:
					self.redirect('/home')
			else:
				return self.redirect('/facebook_sign_up')
		else:
			return self.write('Error')

	def post(self):
		global facebookSecret
		self.validation = FieldValidation()

		signedRequest = self.request.get('signed_request')
		
		payload = str(signedRequest.split('.', 2)[1])
		transformedPayload = payload.translate(maketrans('-_', '+/'))
		nbPadding = len(transformedPayload) % 4
		while nbPadding < 4 :
			nbPadding += 1
			transformedPayload += '='
		dataJson = base64.decodestring(transformedPayload)
		data = json.loads(dataJson)
		username = data['registration']['username']
		email = data['registration']['email']
		userId = int(data['user_id'])

		expectedKey = hmac.new( facebookSecret, payload, hashlib.sha256).digest()
		receivedEncodedKey = str(signedRequest.split('.', 2)[0])
		receivedTempKey = receivedEncodedKey.translate(maketrans('-_', '+/'))
		nbPadding = len(receivedTempKey) % 4
		while nbPadding < 4 :
			nbPadding += 1
			receivedTempKey += '='
		receivedKey = base64.decodestring(receivedTempKey)
		if expectedKey != receivedKey:
			return self.write( 'Registration failed!' )	

		self.checkEmail(email)
		self.checkUserID(userId)

		if self.validation.isValid():
			user = User( key_name= username, username = username,  email = email, userType = 2 )
			user.put()

			fbUser = FBUser( username=username, userID=userId )
			fbUser.put()
			return self.redirect("https://www.facebook.com/dialog/oauth?client_id=539751139430183&redirect_uri=https%3A%2F%2Frhythmludus.appspot.com%2Ffb_endpoint")
		else:
			self.redirect('/facebook_sign_up?errorMessage='+self.validation.getMessage())

class ValidationEmail(BaseHandler):
  def get(self):
    code = self.request.get('code')     
    username = self.request.get('username')
    user_query = EmailUser.all().filter('username = ', username)
    user = user_query.get()
    if user != None and user.code == code:
      user.emailValidated = True
      user.code = ''
      user.put()
      self.write('Email Validated')
    else:
      self.write('Error')

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