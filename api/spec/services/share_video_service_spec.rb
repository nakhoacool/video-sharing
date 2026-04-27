require "rails_helper"

RSpec.describe ShareVideoService do
  subject(:service) { described_class.new(video_repository: video_repo) }

  let(:video_repo) { instance_double(VideoRepository) }
  let(:user)       { build_stubbed(:user, name: "Alice") }

  let(:valid_params) do
    { title: "Cool Video", description: "A description", link: "https://youtu.be/dQw4w9WgXcQ" }
  end

  describe "#call" do
    context "with valid params" do
      let(:video) { build_stubbed(:video, title: "Cool Video", link: "https://youtu.be/dQw4w9WgXcQ", user: user) }

      before do
        allow(video_repo).to receive(:build).and_return(video)
        allow(video_repo).to receive(:save).with(video).and_return(true)
        allow(ActionCable.server).to receive(:broadcast)
      end

      it "returns a successful result" do
        result = service.call(user: user, params: valid_params)
        expect(result).to be_success
      end

      it "returns the video as data" do
        result = service.call(user: user, params: valid_params)
        expect(result.data).to eq(video)
      end

      it "broadcasts a notification to the notifications channel" do
        service.call(user: user, params: valid_params)

        expect(ActionCable.server).to have_received(:broadcast).with(
          "notifications",
          hash_including(
            type: "new_video_shared",
            video: hash_including(title: "Cool Video"),
            shared_by: { name: "Alice" }
          )
        )
      end
    end

    context "with invalid params" do
      let(:video) { build_stubbed(:video) }

      before do
        video.errors.add(:title, "can't be blank")
        allow(video_repo).to receive(:build).and_return(video)
        allow(video_repo).to receive(:save).and_return(false)
      end

      it "returns a failure result" do
        result = service.call(user: user, params: { title: "", link: "" })
        expect(result).to be_failure
      end

      it "does not broadcast a notification" do
        allow(ActionCable.server).to receive(:broadcast)
        service.call(user: user, params: { title: "", link: "" })
        expect(ActionCable.server).not_to have_received(:broadcast)
      end
    end
  end
end
