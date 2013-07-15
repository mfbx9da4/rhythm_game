from google.appengine.ext import db

class WaitingUsers(db.Model):
  user_id = db.StringProperty()
  time = db.TimeProperty()