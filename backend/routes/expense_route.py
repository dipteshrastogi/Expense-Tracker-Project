from flask import Blueprint, request
from controllers.expense_controller import create_expense, read_expense, edit_expense, delete_expense
from middlewares.auth_middleware import protectRoute

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/create', methods=['POST'])
@protectRoute
async def register_expense():
    data = request.get_json() or {}
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
