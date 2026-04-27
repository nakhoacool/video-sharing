class ListVideosService
  def initialize(video_repository: VideoRepository.new)
    @video_repository = video_repository
  end

  def call
    videos = @video_repository.all_ordered
    ServiceResult.success(videos)
  end
end
