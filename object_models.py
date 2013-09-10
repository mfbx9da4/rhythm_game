import os

import webapp2
import jinja2
from google.appengine.ext import db
from webapp2_extras import sessions
from userDB import User

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir),
                               autoescape=True)

def render_str(template, params):
    t = jinja_env.get_template(template)
    return t.render(params)

def blog_key(name='default'):
    return db.key.from_path('blogs', name)


class BlogPost(db.Model):
    """Models an individual Guestbook entry with an author, content, and date."""
    subject = db.StringProperty(multiline=False, required=True)
    content = db.TextProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    last_modified = db.DateTimeProperty(auto_now=True)

    def render(self):
        self._render_text = self.content.replace('\n', '<br>')
        return render_str('post.html', p=self)


class BaseHandler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))

    def error(self, string, *args, **kwargs):
        webapp2.logging.error(string, *args, **kwargs)

    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)
        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)
 
    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session()

    def isLoggedIn(self):
        if self.session.get('user'):
            return True
        else:
            return False

    def isUserValid(self):
        if self.isLoggedIn():
            user = self.session.get('user')
            return user.emailValidated
        else:
            return False

    def requireLogin(self):
        print "requireLogin: " + str(self.isLoggedIn())
        if not self.isLoggedIn():
            self.redirect('/login')
            return False
        else:
            return True

    def getUser(self):
        if self.isLoggedIn():
            username = self.session.get('user')
            user_query = User.all().filter('username =', username)
            return user_query.fetch(1)[0]
        else:
            return None