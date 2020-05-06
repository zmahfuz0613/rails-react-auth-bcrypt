class AuthenticationController < ApplicationController
  before_action :authorize_request, only: [:verify]
  # POST /auth/login
  def login
    @user = User.find_by(username: login_params[:username])
    if @user.authenticate(login_params[:password]) #authenticate method provided by Bcrypt and 'has_secure_password'
      token = encode(user_id: @user.id)
      render json: { user: @user.return_data, token: token }, status: :ok
    else
      render json: { errors: "unauthorized" }, status: :unauthorized
    end
  end

  def verify
    render json: @current_user.return_data
  end

  private

  def login_params
    params.require(:auth).permit(:username, :password)
  end
end
