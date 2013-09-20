from google.appengine.ext import db

class User(db.Model):
	username = db.StringProperty(multiline=False, required=True)
	userRights = db.IntegerProperty(required=True, default=1 )
	userType = db.IntegerProperty(required=True )
	joined = db.DateTimeProperty(auto_now_add=True)
	points = db.IntegerProperty(required=True, default=0 )
	email = db.StringProperty(multiline=False, required=True)

class FBUser(db.Model):
	username = db.StringProperty(multiline=False, required=True)
	userID = db.IntegerProperty(required=True)

class EmailUser(db.Model):
	username = db.StringProperty(multiline=False, required=True)
	password = db.StringProperty(multiline=False, required=True)
	salt = db.StringProperty(multiline=False, required=True)
	emailValidated = db.BooleanProperty(default= False, required=True)
	code = db.StringProperty(multiline=False, required=False)