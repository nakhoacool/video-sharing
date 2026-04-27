require "rails_helper"

RSpec.describe ListVideosService do
  subject(:service) { described_class.new(video_repository: video_repo) }

  let(:video_repo) { instance_double(VideoRepository) }

  describe "#call" do
    it "returns a successful result containing all videos" do
      videos = build_stubbed_list(:video, 3)
      allow(video_repo).to receive(:all_ordered).and_return(videos)

      result = service.call
      expect(result).to be_success
      expect(result.data).to eq(videos)
    end

    it "returns an empty list when no videos exist" do
      allow(video_repo).to receive(:all_ordered).and_return([])

      result = service.call
      expect(result).to be_success
      expect(result.data).to be_empty
    end
  end
end
