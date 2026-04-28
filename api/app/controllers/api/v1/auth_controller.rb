module Api
  module V1
    class AuthController < ApplicationController
      def register
        result = RegisterUserService.new.call(register_params)

        if result.success?
          token = JsonWebToken.encode({ user_id: result.data.id })
          render json: {
            user: UserSerializer.new(result.data).as_json,
            token: token
          }, status: :created
        else
          render json: { errors: result.errors }, status: :unprocessable_content
        end
      end

      def login
        result = AuthenticateUserService.new.call(
          email: params[:email],
          password: params[:password]
        )

        if result.success?
          render json: {
            user: UserSerializer.new(result.data[:user]).as_json,
            token: result.data[:token]
          }, status: :ok
        else
          render json: { errors: result.errors }, status: :unauthorized
        end
      end

      private

      def register_params
        params.permit(:name, :email, :password, :password_confirmation)
      end
    end
  end
end
