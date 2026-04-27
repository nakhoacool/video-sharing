class ShareVideoService
  def initialize(video_repository: VideoRepository.new)
    @video_repository = video_repository
  end

  def call(user:, params:)
    video = @video_repository.build(
      title: params[:title],
      description: params[:description],
      link: params[:link],
      user: user
    )

    if @video_repository.save(video)
      broadcast_notification(video)
      ServiceResult.success(video)
    else
      ServiceResult.failure(video.errors.full_messages)
    end
  end

  private

  def broadcast_notification(video)
    ActionCable.server.broadcast(
      "notifications",
      {
        type: "new_video_shared",
        video: { title: video.title, link: video.link },
        shared_by: { name: video.user.name }
      }
    )
  end
end
