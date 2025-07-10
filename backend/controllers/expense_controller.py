from flask import jsonify, g
from datetime import datetime, timedelta
from collections import defaultdict
from sqlalchemy import select, desc
from models import Expense
from utils.extensions import async_session
from utils.alert_user import check_and_notify

# ------------------------- CREATE -------------------------
async def create_expense(data):
    amount = int(data.get('amount'))
    categoryName = data.get('categoryName')
    title = data.get("title")
    date_str = data.get("date")  # expected format: "YYYY-MM-DD"
    
    if not amount or not categoryName or not title or not date_str:
        return jsonify(msg="Data is missing"), 400

    userId = g.current_user
    if not userId:
        return jsonify(msg="Unauthorized user"), 401

    try:
        # ✅ Parse date string to datetime object
        timestamp = datetime.strptime(date_str, "%Y-%m-%d")

        async with async_session() as session:
            newExpense = Expense(
                title=title,
                amount=amount,
                category=categoryName,
                timestamp=timestamp,
                user_id=userId
            )
            session.add(newExpense)
            await session.commit()
            await check_and_notify(userId, session)

    except Exception as e:
        print(e)
        return jsonify(msg="Internal server Error aa raha"), 500

    return jsonify(
        success=True,
        msg="Expense added successfully",
        expense={
            "id": newExpense.id,
            "amount": amount,
            "category": categoryName,
            "title": title,
            "timestamp": timestamp.isoformat()
        }
    ), 200


# ------------------------- READ -------------------------
async def read_expense():
    userId = g.current_user
    if not userId:
        return jsonify(msg="Unauthorized"), 401

    async with async_session() as session:
        stmt = select(Expense).where(Expense.user_id == userId)
        result = await session.execute(stmt)
        rows = result.scalars().all()

    expenses = [
        {
            "id": e.id,
            "title": e.title,
            "amount": e.amount,
            "category": e.category,
            "timestamp": e.timestamp.isoformat()
        }
        for e in rows
    ]

    return jsonify(expenses=expenses), 200


# ------------------------- EDIT -------------------------
async def edit_expense(data):
    expense_id = data.get('id')
    amount = int(data.get('amount'))
    categoryName = data.get('categoryName')
    title = data.get("title")
    date_str = data.get("date")

    if not any([amount, categoryName, title, date_str]):
        return jsonify(msg="Fields to update are missing"), 400

    userId = g.current_user
    if not userId:
        return jsonify(msg="Unauthorized user"), 401

    try:
        async with async_session() as session:
            result = await session.execute(
                select(Expense).where(
                    Expense.id == expense_id,
                    Expense.user_id == userId
                )
            )
            expense = result.scalars().one()

            if amount is not None:
                expense.amount = amount
            if categoryName is not None:
                expense.category = categoryName
            if title is not None:
                expense.title = title
            if date_str is not None:
                # ✅ Convert date string to datetime
                expense.timestamp = datetime.strptime(date_str, "%Y-%m-%d")

            await session.commit()
            await check_and_notify(userId, session)

    except Exception as e:
        print(e)
        return jsonify(msg="Internal server Error"), 500

    return jsonify(
        success=True,
        expense={
            "id": expense.id,
            "amount": expense.amount,
            "category": expense.category,
            "title": expense.title,
            "timestamp": expense.timestamp.isoformat()
        }
    ), 200


# ------------------------- DELETE -------------------------
async def delete_expense(data):
    expense_id = data.get('id')
    if not expense_id:
        return jsonify(msg="Expense id missing"), 400

    userId = g.current_user
    if not userId:
        return jsonify(msg="Unauthorized user"), 401

    try:
        async with async_session() as session:
            result = await session.get(Expense, expense_id)
            if not result or int(result.user_id) != int(userId):
                return jsonify(msg="No such expense exists"), 404

            await session.delete(result)
            await session.commit()

    except Exception as e:
        print(e)
        return jsonify(msg="Internal server Error"), 500

    return jsonify(success=True, msg="Expense deleted successfully"), 200


# ------------------------- RECENT 6 -------------------------
async def recent_6_expense():
    userId = g.current_user
    if not userId:
        return jsonify(msg="Unauthorized"), 401

    async with async_session() as session:
        try:
            stmt = (
                select(Expense)
                .where(Expense.user_id == userId)
                .order_by(desc(Expense.timestamp))
                .limit(6)
            )
            result = await session.execute(stmt)
            rows = result.scalars().all()

            recent_expenses = [
                {
                    "id": e.id,
                    "title": e.title,
                    "amount": e.amount,
                    "category": e.category,
                    "timestamp": e.timestamp.isoformat()
                }
                for e in rows
            ]

            return jsonify(expenses=recent_expenses), 200

        except Exception as e:
            print("Error in recent_6_expense:", e)
            return jsonify(msg="Internal server error"), 500


# ------------------------- RECENT 3 MONTHS -------------------------
async def recentThreeMonthExpense():
    userId = g.current_user
    if not userId:
        return jsonify(msg="Unauthorized user"), 401

    cutoff = datetime.utcnow() - timedelta(days=90)

    async with async_session() as session:
        try:
            stmt = (
                select(Expense)
                .where(
                    Expense.user_id == userId,
                    Expense.timestamp >= cutoff
                )
                .order_by(desc(Expense.timestamp))
            )
            result = await session.execute(stmt)
            rows = result.scalars().all()

            recent_expenses = [
                {
                    "id": e.id,
                    "title": e.title,
                    "amount": e.amount,
                    "category": e.category,
                    "timestamp": e.timestamp.isoformat()
                }
                for e in rows
            ]

            return jsonify(expenses=recent_expenses), 200

        except Exception as e:
            print("Error in recentThreeMonthExpense:", e)
            return jsonify(msg="Internal server error"), 500


async def latest_month_total():
    user_id = g.current_user
    async with async_session() as session:
        stmt = select(Expense).where(Expense.user_id == user_id)
        result = await session.execute(stmt)
        expenses = result.scalars().all()

    # Group and get the latest month

    month_map = defaultdict(list)
    for e in expenses:
        key = e.timestamp.strftime('%Y-%m')  # '2024-07' format
        month_map[key].append(e.amount)

    if not month_map:
        return jsonify(total=0), 200

    latest_month = max(month_map.keys())  # latest 'YYYY-MM'
    total = sum(month_map[latest_month])
    return jsonify(total=total), 200