"""
export PATH=$PATH:/home/david/Dropbox/Programming/Python/Miscellaneous/extensions/google_appengine
dev_appserver.py helloworld/
appcfg.py update helloworld/

"""

__website__ = 'http://rhythmludus.appspot.com/'


from xml.dom import minidom as md
import xml.etree.cElementTree as ET
import re

import webapp2
from google.appengine.ext import db

from object_models import BaseHandler
from rhythmgame import game
from gamesetup import CreateChannel
from gamesetup import GameRequest
from song import RandomSong

from login import ValidationEmail
from login import FBEndPoint
from login import SignUp
from login import FBSignUp
from login import Login
from login import CreateUser
from login import Logout
from userDB import User  
from RhythmAuto import RhythmAutorisation 

import json

class ManageRhythms(BaseHandler):
      def get(self): 
            params = {}
            self.response.write(self.render_template_arg('my_rhythm.html', params))

class Home(BaseHandler):
      def get(self): 
            self.write('HOME')


class Rhythm(db.Model):
    title = db.StringProperty(multiline=False, required=True)
    xml = db.TextProperty(required=True)
    owner = db.StringProperty(multiline=False, required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    last_modified = db.DateTimeProperty(auto_now=True)
    rhythm_type = db.IntegerProperty(default=2, required=True)


class Song(db.Model):
    title = db.StringProperty(multiline=False, required=True)
    created = db.DateTimeProperty(auto_now_add=True)

class RhythmEnterer(BaseHandler):
    def get(self):
        if not self.requireLogin():
          return
        params = {}
        if self.getUser().userRights == 2:
          params["admin"] = True
        else:
          params["admin"] = False
        if self.request.get('edit') and self.request.get('title'):
          params["edit"] = True
          params["title"] = self.request.get('title')
        self.response.write(self.render_template_arg('rhythm_enterer.html', params))

class SongEnterer(BaseHandler):
    def get(self):
        self.response.write(self.render_template('song_enterer.html'))

class SongsQuery(BaseHandler):
  def get(self):
      song_db = Song.all().fetch(10)
      songName = [ s.title for s in song_db ]
      # songName=["one", "two", "three"]
      songName = {'songs': songName}
      encoder = json.JSONEncoder()
      songs = encoder.encode(songName)
      return self.write(songs)


class RhythmInfo(BaseHandler):
    def get(self):
        self.arg = self.request.get('arg')
        if self.arg == 'all_templates':
          self.rhythms = Rhythm.all().filter('rhythm_type = ', 1).fetch(limit=None)
          user = self.getUser()
          privateRhythms = Rhythm.all()
          privateRhythmsName = RhythmAutorisation.all().filter('username = ', user.username).fetch(limit=None)
          for name in privateRhythmsName:
            self.rhythms.append(privateRhythms.filter('rhythm_type = ', 2, 'title = ', name).get())
            privateRhythms = Rhythm.all()
          for rhythm in Rhythm.all().filter('owner = ', self.getUser().username).fetch(limit=None):
            if rhythm.rhythm_type == 2:
              self.rhythms.append(rhythm)
          for rhythm in Rhythm.all().filter('rhythm_type = ', 3).fetch(limit=None):
            self.rhythms.append(rhythm)
          return self.write(self.getEncodedRhythms())
        elif self.arg == 'all_official':
          self.rhythms = Rhythm.all().filter('rhythm_type = ', 1).fetch(limit=None)
          return self.write(self.getEncodedRhythms())
        elif self.arg == 'all_publicly_shared':
          self.rhythms = Rhythm.all().filter('rhythm_type = ', 3).fetch(limit=None)
          return self.write(self.getEncodedRhythms())
        elif self.arg == 'all_personal':
          if self.isLoggedIn():
            self.rhythms = Rhythm.all().filter('owner = ', self.getUser().username).fetch(limit=None)
          else:
            self.rhythms = []
          return self.write(self.getEncodedRhythms())
        elif self.arg == 'all_personally_shared':
          if isLoggedIn:
            self.rhythm = []
            privateRhythms = Rhythm.all()
            privateRhythmsName = RhythmAutorisation.all().filter('username = ', user.username).fetch(limit=None)
            for name in privateRhythmsName:
              self.rhythms.append(privateRhythms.filter('rhythm_type = ', 2, 'title = ', name).get())
              privateRhythms = Rhythm.all()
          else:
            self.rhythms = []
          return self.write(self.getEncodedRhythms())
          

    def getEncodedRhythms(self):
        rhythms = [{ 'title': str(r.title), 'date': str(r.last_modified), 'type': str(r.rhythm_type), "owner": str(r.owner) } for r in self.rhythms]
        rhythms = {'rhythms': rhythms}
        encoder = json.JSONEncoder()
        return encoder.encode(rhythms)


class RhythmsQuery(BaseHandler):
    def get(self):
        self.arg = self.request.get('arg')
        title = self.request.get('title')
        if title and self.arg == 'get':
          self.getNamedRhythm(title)
        elif title and self.arg == 'delete':
          rhythm = Rhythm.all().filter('title =', title).get()
          if rhythm.owner == self.getUser().username:
            rhythm.delete()
        elif self.arg == 'delete_all':
          self.deleteAll()

    def getNamedRhythm(self, title):
        q = Rhythm.all().filter('title =', title)
        r = q.fetch(1)
        if r:
          out = r[0].xml
          self.response.headers['Content-Type'] = "text/xml"
          return self.response.out.write(out)
        else:
          return self.write('not found')
        
    def deleteAll(self):
        for r in self.rhythms:
            r.delete()
        return self.write(str([r.title for r in self.rhythms]))

    def validType(self, type):
      if type == 1:
        return self.getUser().userRights == 2
      else:
        return type < 4 and type > 0

    def post(self):
        title, type_str, xml_str = self.request.body.split('|')
        xml = md.parseString(xml_str)
        type = int(type_str)
        if valid_rhythm(xml) and self.validType(type):
          if self.request.get('arg') == 'edit':
            rhy = Rhythm.all().filter('title = ', title).get()
            if rhy.owner == self.getUser().username:
              rhy.xml = xml.toxml()
              rhy.rhythm_type = type
            else:
              return self.write('Invalid rhythm or owner')
          elif valid_title(title):
            rhy = Rhythm(title=str(title), xml=xml.toxml(), owner=self.getUser().username, rhythm_type = type )
          rhy.put()
        else:
          return self.write('invalid rhythm')

class Index(BaseHandler):
      def get(self): 
            pages = stripOutRouteStrings(app.router.match_routes)
            self.write.out(self.render_template_arg('index.html', pages=pages))

def stripOutRouteStrings(routes):
      strs = []
      for r in routes:
            strs.append(re.findall('/[a-zA-Z/0-9._()]*', r.template)[0])
      return strs


def valid_rhythm(xml):
    if xml.getElementsByTagName('note'):
      return True

def valid_title(title):
    if not Rhythm.all().filter('title =', title).get():
        return True

class SongDb(BaseHandler):
    def get(self):
          db.delete(Song.all());
          song = Song(title="sound/conga/1.wav")
          song.put()
          song = Song(title="sound/conga/2.wav")
          song.put()
          song = Song(title="sound/conga/3.wav")
          song.put()
          return self.write("DB initialised")

class ReceiveEmail (BaseHandler):
    def post(self):
      self.mime = self.get('MIME')


config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}

app = webapp2.WSGIApplication([('/home', Home),
                               ('/game', game),
                               ('/randomsong', RandomSong),
                               ('/rhythm_enterer', RhythmEnterer),
                               ('/sign_up', SignUp),
                               ('/login', Login),
                               ('/logout', Logout),
                               ('/create_user', CreateUser),
                               ('/song_enterer', SongEnterer),
                               ('/rhythm_db', RhythmsQuery),
                               ('/song_db', SongsQuery),
                               ('/init_db', SongDb),
                               ('/rhythm_info', RhythmInfo),
                               ('/validation', ValidationEmail),
                               ('/my_rhythms', ManageRhythms),
                               ('/_ah/mail/support@rhythmludus.appspotmail.com', ReceiveEmail),
                               ('/fb_endpoint', FBEndPoint),
                               ('/facebook_sign_up', FBSignUp),
                               ('/index', Index)
                               ],
                               debug=True,
                               config=config)
