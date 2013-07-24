"""
export PATH=$PATH:/home/david/Dropbox/Programming/Python/Miscellaneous/extensions/google_appengine
dev_appserver.py helloworld/
appcfg.py update helloworld/

"""

__website__ = 'http://rhythmludus.appspot.com/'


import webapp2

from object_models import BaseHandler
from rhythmgame import game
from gamesetup import CreateChannel
from gamesetup import GameRequest

class Home(BaseHandler):
      def get(self): 
            self.write('HOME')

class Enterer(BaseHandler):
    def get(self):
        self.render('rhythm_enterer.html')

    def post(self):
        pass



    
config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}

app = webapp2.WSGIApplication([('/', Home),
                               ('/game', game),
                               ('/rhythm_enterer', Enterer)
                               ],
                               debug=True,
                               config=config)
