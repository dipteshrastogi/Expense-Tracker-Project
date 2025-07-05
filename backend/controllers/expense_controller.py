from flask import jsonify, g
from sqlalchemy import select
from models import Expense
from utils.extensions import async_session
from utils.alert_user import check_and_notify

async def create_expense(data):
    amount = data.get('amount')
    categoryName = data.get('categoryName')
    
    if not amount or not categoryName:
        return jsonify(msg="Amount or category missing"), 400
    
    userId = g.current_user

    if not userId:
        return jsonify(msg="Unauthorized user"), 401
    
    try:
        income = data.get("income")
        title = data.get("title")

        async with async_session() as session:
            newExpense = Expense(title=title, amount=amount, category = categoryName, user_id=userId)
            session.add(newExpense)
            await session.commit()
            await check_and_notify(g.current_user, session)
    
    except Exception as e:
        print(e)
        return jsonify(msg="Internal server Error aa raha"), 500
    
    
    res = jsonify(msg="Expense added successfully", 
                  expense={
                      "id": newExpense.id,
                      "amount": amount,
                      "category": categoryName,
                      "title": title,
                  })
    res.status_code = 200
    return res
    

async def read_expense(): #not pure async-orm and also not pure core-query
    userId = g.current_user

    if not userId:
        return jsonify(msg="Unauthorized user"), 401

    async with async_session() as session:
        # 1) build the SELECT
        stmt = select(Expense).where(Expense.user_id == userId)

        # 2) execute it
        result = await session.execute(stmt)

        # 3) extract ORM objects
        rows = result.scalars().all()

    # 4) serialize as JSON
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


async def edit_expense(data):
    expense_id = data.get('id')
    amount = data.get('amount')
    categoryName = data.get('categoryName')
    title = data.get("title")

    if not amount and not categoryName and not title:
        return jsonify(msg="Fields which has to be updating is missing")
    
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

            await session.commit()
            await check_and_notify(g.current_user, session)


    except Exception as e:
        print(e)
        return jsonify(msg="Internal server Error"), 500
    
    
    return jsonify(
            id=expense.id,
            amount=expense.amount,
            category=expense.category,
            title=expense.title,
            timestamp=expense.timestamp.isoformat()
        ), 200
    
async def delete_expense(data):
    expense_id = data.get('id')
    
    if not expense_id:
        return jsonify(msg="Expense id missing"), 401
    
    userId = g.current_user
    print(userId)

    if not userId:
        return jsonify(msg="Unauthorized user"), 401
    
    try:
        async with async_session() as session:
            result = await session.get(Expense, expense_id)
            if not result or int(result.user_id)!=int(userId):
                return jsonify(msg="No such expense exists"), 401
            
            await session.delete(result)
            await session.commit()
    
    except Exception as e:
        print(e)
        return jsonify(msg="Internal server Error"), 500

    return jsonify(msg="Expense deleted successfully"), 200