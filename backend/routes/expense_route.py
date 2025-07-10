from flask import Blueprint, request
from controllers.expense_controller import create_expense, read_expense, edit_expense, delete_expense, recent_6_expense, recentThreeMonthExpense, latest_month_total
from middlewares.auth_middleware import protectRoute

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/create', methods=['POST'])
@protectRoute
async def register_expense():
    data = request.get_json() or {}
    print("Hola Amigos")
    return await create_expense(data)


@expense_bp.route('/update', methods=['PUT'])
@protectRoute
async def update_expense():
    data = request.get_json() or {}
    return await edit_expense(data)


@expense_bp.route('/read', methods=['GET'])
@protectRoute
async def read_exp():
    return await read_expense()


@expense_bp.route('/delete', methods=['DELETE'])
@protectRoute
async def del_expense():
    data = request.get_json() or {}
    return await delete_expense(data)

@expense_bp.route('/recent', methods=['GET'])
@protectRoute
async def recent_six_expenses():
    return await recent_6_expense()

@expense_bp.route('/recentmonthsExpense', methods=['GET'])
@protectRoute
async def recent_three_month_expenses():
    return await recentThreeMonthExpense()

@expense_bp.route('/latestMonthTotal', methods=['GET'])
@protectRoute
async def total_expense():
    return await latest_month_total()