module Api
  module V1
    class VideosController < ApplicationController
      include Authenticatable
      skip_before_action :authenticate_user!, only: [ :index ]

      def index
        result = ListVideosService.new.call
        render json: result.data.map { |v| VideoSerializer.new(v).as_json }, status: :ok
      end

      def create
        result = ShareVideoService.new.call(user: current_user, params: video_params)

        if result.success?
          render json: VideoSerializer.new(result.data).as_json, status: :created
        else
          render json: { errors: result.errors }, status: :unprocessable_entity
        end
      end

      private

      def video_params
        params.permit(:title, :description, :link)
      end
    end
  end
end
