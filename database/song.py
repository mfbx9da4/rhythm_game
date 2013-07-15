from google.appengine.ext import db

class Songs(db.Model):
	song_name = db.StringProperty()
