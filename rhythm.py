import webapp2
from google.appengine.ext import db

class Rhythm(db.Model):
    title = db.StringProperty(multiline=False, required=True)
    xml = db.TextProperty(required=True)
    owner = db.StringProperty(multiline=False, required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    last_modified = db.DateTimeProperty(auto_now=True)
    rhythm_type = db.IntegerProperty(default=2, required=True)