import webapp2
import hashlib
import random
import string
from google.appengine.ext import db
from object_models import BaseHandler
from webapp2_extras import sessions

class RhythmAutorisation(db.Model):
	username = db.StringProperty(multiline=False, required=True)
	rhythmname = db.StringProperty(multiline=False, required=True)
	rhythmType = db.IntegerProperty(required=True, default=2)


