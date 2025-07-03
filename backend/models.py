import bcrypt
from app import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'user'

    id        = db.Column(db.Integer, primary_key=True)                # PK
    username  = db.Column(db.String(30), nullable=False, unique=True)
    email     = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.LargeBinary(60), nullable=False) #bcrypt hashes are bytes

    # OPTIONAL: lets you do `u.categories` and `u.expenses`
    categories = db.relationship('Category', backref='owner', lazy=True)
    expenses   = db.relationship('Expense',  backref='spender', lazy=True)

    def set_password(self, password: str):
        """Hash a plaintext password and store the binary result."""
        # bcrypt.gensalt() generates a random salt with default cost (12)
        salt = bcrypt.gensalt()
        # bcrypt.hashpw returns the salted hash as bytes
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)

    def check_password(self, password: str) -> bool:
        """Compare a plaintext password against the stored hash."""
        # bcrypt.hashpw(password, stored_hash) will re‑salt and produce the same hash if valid
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash)



class Category(db.Model):
    __tablename__ = 'category'

    id       = db.Column(db.Integer, primary_key=True)                 # PK
    name     = db.Column(db.String(50), nullable=False, unique=True)
    icon     = db.Column(db.String(50))                                # e.g. "fa-utensils" or "🍔"

    user_id  = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),          # ──► REQUIRED: links Category → User
        nullable=False
    )

    # `backref='owner'` on User.categories gives you category.owner



class Expense(db.Model):
    __tablename__ = 'expense'

    id          = db.Column(db.Integer, primary_key=True)             # PK
    amount      = db.Column(db.Float,   nullable=False)
    timestamp   = db.Column(db.DateTime, default=datetime.utcnow)

    user_id     = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),          # ──► REQUIRED: links Expense → User
        nullable=False
    )
    category_id = db.Column(
        db.Integer,
        db.ForeignKey('category.id'),      # ──► REQUIRED: links Expense → Category
        nullable=False
    )

    # OPTIONAL: lets you do `e.category` and `e.spender`
    category    = db.relationship('Category', backref='expenses', lazy=True)
