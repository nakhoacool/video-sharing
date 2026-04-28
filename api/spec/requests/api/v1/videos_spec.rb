require "rails_helper"

RSpec.describe "/api/v1/videos", type: :request do
  let(:user) { create(:user) }

  describe "GET /api/v1/videos" do
      it "returns 200 with a list of videos" do
        create_list(:video, 3, user: user)
        get "/api/v1/videos"

        expect(response).to have_http_status(:ok)
        expect(json_response.length).to eq(3)
      end

      it "returns videos with expected fields" do
        create(:video, user: user, title: "My Video")
        get "/api/v1/videos"

        video_json = json_response.first
        expect(video_json).to include(:id, :title, :description, :link, :created_at, :shared_by)
        expect(video_json[:shared_by]).to include(:email)
      end

      it "returns videos ordered newest first" do
        older = create(:video, user: user, created_at: 2.days.ago)
        newer = create(:video, user: user, created_at: 1.hour.ago)

        get "/api/v1/videos"

        ids = json_response.map { |v| v[:id] }
        expect(ids.first).to eq(newer.id)
        expect(ids.last).to eq(older.id)
      end
  end

  describe "POST /api/v1/videos" do
    let(:valid_params) do
      {
        title: "Rick Astley - Never Gonna Give You Up",
        description: "Classic music video",
        link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      }
    end

    context "when authenticated with valid params" do
      it "creates a video and returns 201" do
        expect {
          post "/api/v1/videos", params: valid_params, headers: auth_headers(user)
        }.to change(Video, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "returns the created video data" do
        post "/api/v1/videos", params: valid_params, headers: auth_headers(user)

        body = json_response
        expect(body[:title]).to eq("Rick Astley - Never Gonna Give You Up")
        expect(body[:shared_by][:email]).to eq(user.email)
      end

      it "broadcasts a notification via Action Cable" do
        expect(ActionCable.server).to receive(:broadcast).with(
          "notifications",
          hash_including(type: "new_video_shared")
        )

        post "/api/v1/videos", params: valid_params, headers: auth_headers(user)
      end
    end

    context "when authenticated with invalid params" do
      it "returns 422 for a non-YouTube link" do
        post "/api/v1/videos",
             params: valid_params.merge(link: "https://vimeo.com/123"),
             headers: auth_headers(user)

        expect(response).to have_http_status(:unprocessable_content)
        expect(json_response[:errors]).not_to be_empty
      end

      it "returns 422 when title is blank" do
        post "/api/v1/videos",
             params: valid_params.merge(title: ""),
             headers: auth_headers(user)

        expect(response).to have_http_status(:unprocessable_content)
      end
    end

    context "when unauthenticated" do
      it "returns 401" do
        post "/api/v1/videos", params: valid_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
