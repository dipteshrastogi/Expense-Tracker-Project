# utils/threshold.py
import smtplib
from email.mime.text import MIMEText
from flask import current_app
from models import User

async def check_and_notify(user_id, session):
    """Calculate this user’s savings; if they’ve crossed the threshold, send them an email."""
    # 1) load user and their expenses
    user = await session.get(User, user_id)
    total_exp = sum(e.amount for e in user.expenses or [])
    income    = float(getattr(user, "income", 0))
    savings   = income - total_exp

    threshold = current_app.config["SAVINGS_THRESHOLD"]
    if savings < threshold:
        body = (
            f"Hi {user.username},\n\n"
            f"You’ve just crossed your savings threshold of "
            f"${threshold:.2f} with ${savings:.2f} in the bank!\n"
            "Expend money wisely !!!!\n"
        )
        msg = MIMEText(body)
        msg["Subject"] = " 🚨 Savings Alert"
        msg["From"]    = current_app.config["SMTP_USER"]
        msg["To"]      = user.email

        with smtplib.SMTP(
            current_app.config["SMTP_HOST"],
            current_app.config["SMTP_PORT"]
        ) as smtp:
            smtp.starttls()
            smtp.login(
                current_app.config["SMTP_USER"],
                current_app.config["SMTP_PASS"]
            )
            smtp.send_message(msg)
